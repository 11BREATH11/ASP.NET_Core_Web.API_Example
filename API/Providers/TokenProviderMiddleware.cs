using API.Entities;
using DAL;
using DAL.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Providers
{
    public class TokenProviderMiddleware
    {
        private readonly RequestDelegate _next;
        private TokenProviderOptions _options;
		private IAuthRepository _repo = null;

		public TokenProviderMiddleware(
            RequestDelegate next,
            IOptions<TokenProviderOptions> options

            )
        {
            _next = next;
            _options = options.Value;
        }

        public Task Invoke(HttpContext context, IAuthRepository authRepository)
        {
			_repo = authRepository;

			if (!context.Request.Path.Equals(_options.Path, StringComparison.Ordinal))
            {
                return _next(context);
            }
            if (!context.Request.Method.Equals("POST") || !context.Request.HasFormContentType)
            {
                context.Response.StatusCode = 400;

                return context.Response.WriteAsync("Bad Request");
            }			

			Client client = null;

			if (context.Request.Form.ContainsKey("client_id"))
			{
				string clientId = string.Empty;
				string clientSecret = string.Empty;				

				clientId = context.Request.Form["client_id"];

				client = _repo.FindClient(clientId);				

				if (client == null)
				{
					context.Response.StatusCode = 400;
					context.Response.WriteAsync(string.Format("Client '{0}' is not registered in the system.", clientId));
					
					return Task.FromResult<object>(null);
				}

				if (client.ApplicationType == DAL.Models.ApplicationTypes.NativeConfidential)
				{
					if (string.IsNullOrWhiteSpace(clientSecret))
					{					
						context.Response.StatusCode = 400;
						context.Response.WriteAsync("Client secret should be sent.");

						return Task.FromResult<object>(null);
					}
					else
					{
						if (client.Secret != Helper.GetHash(clientSecret))
						{
							context.Response.StatusCode = 400;
							context.Response.WriteAsync("Client secret is invalid.");

							return Task.FromResult<object>(null);
						}
					}
				}

				if (!client.Active)
				{					
					context.Response.StatusCode = 400;
					context.Response.WriteAsync("Client is inactive.");

					return Task.FromResult<object>(null);					
				}				
			}

			var grant_type = context.Request.Form["grant_type"];			

			if (grant_type == "refresh_token")
			{
				return RefreshToken(context,client);
			}

			if (grant_type == "password")
			{
				return GenerateToken(context, client);
			}

			context.Response.StatusCode = 400;

			return context.Response.WriteAsync("Bad Request");
		}

		public async Task RefreshToken(HttpContext context, Client client)
		{
			string refreshTokenId = context.Request.Form["refresh_token"];

			var hashedTokenId = Helper.GetHash(refreshTokenId);

			var refreshToken = await _repo.FindRefreshToken(hashedTokenId);

			if (refreshToken != null)
			{				
				var result = await _repo.RemoveRefreshToken(hashedTokenId);
			}

			var user = await _repo.FindUserById(refreshToken.ProtectedTicket);

			await GenerateToken(context, client, user);
		}

		private async Task GenerateToken(HttpContext context, Client client, IdentityUser user = null)
        {
			if (user == null)
			{
				string username = context.Request.Form["username"];
				string password = context.Request.Form["password"];
				
				user = await _repo.FindUser(username, password);
			}

			if (user == null)
			{
				context.Response.StatusCode = 400;
				await context.Response.WriteAsync("Invalid username or password");
				return;
			}

			var refreshTokenId = Guid.NewGuid().ToString("n");

			if (client != null)
			{
				var token = new RefreshToken();

				token = new RefreshToken()
				{
					Id = Helper.GetHash(refreshTokenId),
					ClientId = client.Id,
					Subject = user.UserName,
					IssuedUtc = DateTime.UtcNow,
					ExpiresUtc = DateTime.UtcNow.AddMinutes(Convert.ToDouble(client.RefreshTokenLifeTime)),
					ProtectedTicket = user.Id
				};
				
				var result = await _repo.AddRefreshToken(token);					
			}		         

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

			context.Response.ContentType = "application/json";

			if (client == null)
			{
				var response = new
				{
					access_token = encodedJwt,
					expires_in = (int)_options.Expiration.TotalSeconds					
				};

				await context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
			}
			else
			{
				var response = new
				{
					access_token = encodedJwt,
					expires_in = (int)_options.Expiration.TotalSeconds,
					refresh_token = refreshTokenId
				};

				await context.Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
			}         
        }
    }

    public static class TokenProviderMiddlewareExtensions
    {
        public static IApplicationBuilder UseJWTTokenProviderMiddleware(this IApplicationBuilder builder, IOptions<TokenProviderOptions> options)
        {
            return builder.UseMiddleware<TokenProviderMiddleware>(options);
        }
    }
}
