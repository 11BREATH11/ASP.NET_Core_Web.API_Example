using API;
using API.Providers;
using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;



namespace API.Controllers
{
	[Produces("application/json")]
	[Route("api/Account")]
    public class AccountController : Controller
    {
        private IAuthRepository _repo = null;
		private IConfiguration configuration = null;

		public AccountController(IAuthRepository authRepository, IConfiguration configuration)
        {
            _repo = authRepository;		

			this.configuration = configuration;
		}

        // POST api/Account/Register        
        [Route("Register")]		
		public async Task<IActionResult> Register([FromBody]UserModel userModel)
        {
             if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

			 IdentityResult result = await _repo.RegisterUser(userModel);

             IActionResult errorResult = GetErrorResult(result);

             if (errorResult != null)
             {
                 return errorResult;
             }

             return Ok();
        }
		
		[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
		[AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IActionResult> GetExternalLogin(string provider, string error = null)
        {
            string redirectUri = string.Empty;

            if (error != null)
            {
                return BadRequest(Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
				return new ChallengeResult(provider);
			}

            var redirectUriValidationResult = ValidateClientAndRedirectUri(Request, ref redirectUri);

            if (!string.IsNullOrWhiteSpace(redirectUriValidationResult))
            {
                return BadRequest(redirectUriValidationResult);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return StatusCode(500);
            }

            if (externalLogin.LoginProvider != provider)
            {
				await AuthenticationHttpContextExtensions.SignOutAsync(Request.HttpContext);

                return new ChallengeResult(provider);
            }

            IdentityUser user = await _repo.FindAsync(new UserLoginInfo(externalLogin.LoginProvider, externalLogin.ProviderKey, null));

            bool hasRegistered = user != null;

            redirectUri = string.Format("{0}#external_access_token={1}&provider={2}&haslocalaccount={3}&external_user_name={4}",
                                            redirectUri,
                                            externalLogin.ExternalAccessToken,
                                            externalLogin.LoginProvider,
                                            hasRegistered.ToString(),
                                            WebUtility.UrlEncode(externalLogin.UserName));

            return Redirect(redirectUri);

        }

		// POST api/Account/RegisterExternal
		[AllowAnonymous]
		[Route("RegisterExternal")]
		public async Task<IActionResult> RegisterExternal([FromBody]RegisterExternalBindingModel model)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var verifiedAccessToken = await VerifyExternalAccessToken(model.Provider, model.ExternalAccessToken);
            if (verifiedAccessToken == null)
            {
                return BadRequest("Invalid Provider or External Access Token");
            }

            IdentityUser user = await _repo.FindAsync(new UserLoginInfo(model.Provider, verifiedAccessToken.user_id,null));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                return BadRequest("External user is already registered");
            }

			user = new IdentityUser() { UserName = model.UserName };

			IdentityResult result = await _repo.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

			result = await _repo.AddLoginAsync(user, new UserLoginInfo(model.Provider, verifiedAccessToken.user_id, model.Provider));

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            //generate access token response
            var accessTokenResponse = GenerateLocalAccessTokenResponseAsync(user).Result;

            return Ok(accessTokenResponse);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ObtainLocalAccessToken")]
        public async Task<IActionResult> ObtainLocalAccessToken(string provider, string externalAccessToken)
        {

            if (string.IsNullOrWhiteSpace(provider) || string.IsNullOrWhiteSpace(externalAccessToken))
            {
                return BadRequest("Provider or external access token is not sent");
            }

            var verifiedAccessToken = await VerifyExternalAccessToken(provider, externalAccessToken);
            if (verifiedAccessToken == null)
            {
                return BadRequest("Invalid Provider or External Access Token");
            }

            IdentityUser user = await _repo.FindAsync(new UserLoginInfo(provider, verifiedAccessToken.user_id, null));

            bool hasRegistered = user != null;

            if (!hasRegistered)
            {
                return BadRequest("External user is not registered");
            }

            //generate access token response
            var accessTokenResponse = await GenerateLocalAccessTokenResponseAsync(user);

            return Ok(accessTokenResponse);

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repo.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return StatusCode(500);
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private string ValidateClientAndRedirectUri(HttpRequest request, ref string redirectUriOutput)
        {
			var redirectUriString = request.Query["redirect_uri"];

			if (string.IsNullOrWhiteSpace(redirectUriString))
            {
                return "redirect_uri is required";
            }

            bool validUri = Uri.TryCreate(redirectUriString, UriKind.Absolute, out Uri redirectUri);

            if (!validUri)
            {
                return "redirect_uri is invalid";
            }

            var clientId = request.Query["client_id"];

            if (string.IsNullOrWhiteSpace(clientId))
            {
                return "client_Id is required";
            }

            var client = _repo.FindClient(clientId);

            if (client == null)
            {
                return string.Format("Client_id '{0}' is not registered in the system.", clientId);
            }

            if (!string.Equals(client.AllowedOrigin, redirectUri.GetLeftPart(UriPartial.Authority), StringComparison.OrdinalIgnoreCase))
            {
                return string.Format("The given URL is not allowed by Client_id '{0}' configuration.", clientId);
            }

            redirectUriOutput = redirectUri.AbsoluteUri;

            return string.Empty;

        }        

        private async Task<ParsedExternalAccessToken> VerifyExternalAccessToken(string provider, string accessToken)
        {
            ParsedExternalAccessToken parsedToken = null;

            var verifyTokenEndPoint = "";

            if (provider == "Facebook")
            {
                //You can get it from here: https://developers.facebook.com/tools/accesstoken/
                //More about debug_tokn here: http://stackoverflow.com/questions/16641083/how-does-one-get-the-app-access-token-for-debug-token-inspection-on-facebook
                var appToken = "1509585805754382|3-9m9K59Ca-3av6NKEexIbMGcPQ";
                verifyTokenEndPoint = string.Format("https://graph.facebook.com/debug_token?input_token={0}&access_token={1}", accessToken, appToken);
            }
            else if (provider == "Google")
            {
                verifyTokenEndPoint = string.Format("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={0}", accessToken);
            }
            else
            {
                return null;
            }

            var client = new HttpClient();
            var uri = new Uri(verifyTokenEndPoint);
            var response = await client.GetAsync(uri);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                dynamic jObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(content);

                parsedToken = new ParsedExternalAccessToken();

                if (provider == "Facebook")
                {
                    parsedToken.user_id = jObj["data"]["user_id"];
                    parsedToken.app_id = jObj["data"]["app_id"];

                    if (!string.Equals(configuration["auth:facebook:appid"], parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }
                }
                else if (provider == "Google")
                {
                    parsedToken.user_id = jObj["user_id"];
                    parsedToken.app_id = jObj["audience"];

                    if (!string.Equals(configuration["auth:google:clientid"], parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }

                }

            }

            return parsedToken;
        }

        private async Task<JObject> GenerateLocalAccessTokenResponseAsync(IdentityUser user)
        {			
			SymmetricSecurityKey signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["tokenValidationParameters:secretKey"]));

			var _options = new TokenProviderOptions
			{
				Audience = configuration["tokenValidationParameters:audience"],
				Issuer = configuration["tokenValidationParameters:issure"],
				SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256),
				Expiration = TimeSpan.FromMinutes(double.Parse(configuration["tokenValidationParameters:expiration"]))
			};

			var SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

			var expiration = TimeSpan.FromMinutes(3600);			

			var now = DateTime.UtcNow;

			var userClaims = await _repo.GetRolesAsync(user);

			List<Claim> claims = new List<Claim>();
			claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
			claims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
			claims.Add(new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64));

			foreach (var x in userClaims)
			{
				claims.Add(new Claim(ClaimTypes.Role, x));
			}

			var jwt = new JwtSecurityToken(
				issuer: _options.Issuer,
				audience: _options.Audience,
				claims: claims,
				notBefore: now,
				expires: now.Add(_options.Expiration),
				signingCredentials: _options.SigningCredentials);

			var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

			var response = new
			{
				access_token = encodedJwt,
				expires_in = (int)expiration.TotalSeconds
			};

			JObject tokenResponse = new JObject(
									  new JProperty("userName", user.UserName),
									  new JProperty("access_token", encodedJwt),
									  new JProperty("expires_in", (int)_options.Expiration.TotalSeconds));


			return tokenResponse;
		}

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }
            public string ExternalAccessToken { get; set; }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer) || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirst(ClaimTypes.Name).Value,
                    ExternalAccessToken = identity.FindFirst("ExternalAccessToken").Value
                };
            }
        }

        #endregion
    }
}
