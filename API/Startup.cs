using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;
using DAL;
using BLL;
using Microsoft.AspNetCore.Identity;
using DAL.Models;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using API.Providers;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API
{
    public class Startup
    {		
		private static SymmetricSecurityKey signingKey;

		public object Database { get; private set; }

		public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
			signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration["tokenValidationParameters:secretKey"]));
		}

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
			services.AddCors(options => options.AddPolicy("AllowAll", p => p.AllowAnyOrigin()
																  .AllowAnyMethod()
																   .AllowAnyHeader()));

			services.AddSingleton<IConfiguration>(Configuration);

			//services.AddDbContext<AuthContext>(options => options.UseSqlServer(Configuration.GetConnectionString("AuthContext")) );
			//services.AddDbContext<OwnersPetsContext>(options => options.UseSqlServer(Configuration.GetConnectionString("OwnersPetsContext")));

			services.AddDbContext<AuthContext>(options => options.UseInMemoryDatabase(Configuration.GetConnectionString("AuthContext")));
			services.AddDbContext<OwnersPetsContext>(options => options.UseInMemoryDatabase(Configuration.GetConnectionString("OwnersPetsContext")));

			services.AddTransient<IMainService, MainService>();
			services.AddTransient<IGenericRepository, GenericRepository>();
			services.AddTransient<IAuthRepository, AuthRepository>();

			services.AddMvc();			

			services.AddAuthentication().AddCookie();			

			services.AddAuthentication().AddGoogle(googleOptions =>
			{
				googleOptions.ClientId = Configuration["auth:google:clientid"];
				googleOptions.ClientSecret = Configuration["auth:google:clientsecret"];				
				googleOptions.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

				googleOptions.Events = new OAuthEvents
				{
					OnCreatingTicket = context =>
					{
						context.Identity.AddClaim(new Claim("ExternalAccessToken", context.AccessToken));				

						return Task.CompletedTask;
					}
				};
			});			

			services.AddAuthentication().AddFacebook(facebookOptions =>
			{
				facebookOptions.AppId = Configuration["auth:facebook:appid"];
				facebookOptions.AppSecret = Configuration["auth:facebook:appsecret"];
				facebookOptions.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;

				facebookOptions.Events = new OAuthEvents
				{
					OnCreatingTicket = context =>
					{
						context.Identity.AddClaim(new Claim("ExternalAccessToken", context.AccessToken));

						return Task.CompletedTask;
					}
				};
			});

			services.Configure<IdentityOptions>(options =>
			{
				// Password settings
				options.Password.RequireDigit = false;
				options.Password.RequiredLength = 6;
				options.Password.RequireNonAlphanumeric = false;
				options.Password.RequireUppercase = false;
				options.Password.RequireLowercase = false;						
			});
			
			services.AddIdentity<IdentityUser, IdentityRole>()
				.AddEntityFrameworkStores<AuthContext>()
				.AddDefaultTokenProviders();		


			var tokenValidationParameters = new TokenValidationParameters
			{
				//The signing key must match !
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = signingKey,

				//Validate the JWT Issuer (iss) claim
				ValidateIssuer = true,
				ValidIssuer = Configuration["tokenValidationParameters:issure"],

				//validate the JWT Audience (aud) claim

				ValidateAudience = true,
				ValidAudience = Configuration["tokenValidationParameters:audience"],

				//validate the token expiry
				ValidateLifetime = true,

				// If you  want to allow a certain amout of clock drift
				ClockSkew = TimeSpan.Zero				
			};

			services.AddAuthentication(o =>
			{
				o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

			}).AddJwtBearer(options =>
			{
				options.TokenValidationParameters = tokenValidationParameters;				
			});

		}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }			

			using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
			{
				var contextAuth = serviceScope.ServiceProvider.GetRequiredService<AuthContext>();
				contextAuth.Database.EnsureCreated();

				DbInitializer.Initialize(contextAuth);				

				var contextOwnersPets = serviceScope.ServiceProvider.GetRequiredService<OwnersPetsContext>();
				contextOwnersPets.Database.EnsureCreated();
			}

			app.UseCors("AllowAll");

			app.UseAuthentication();						

			var jwtOptions = new TokenProviderOptions
			{
				Audience = Configuration["tokenValidationParameters:audience"],
				Issuer = Configuration["tokenValidationParameters:issure"],
				SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256),
				Expiration = TimeSpan.FromMinutes(double.Parse(Configuration["tokenValidationParameters:expiration"]))
			};

			app.UseJWTTokenProviderMiddleware(Options.Create(jwtOptions));


			app.UseMvc();
		}	

	
	}
}