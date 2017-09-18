using API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using DAL.Entities;

namespace DAL
{
    public class AuthRepository : IAuthRepository
	{
        private AuthContext _ctx;

        private UserManager<IdentityUser> _userManager;

        public AuthRepository(DbContextOptions<AuthContext> option, UserManager<IdentityUser> manager)
        {
			_ctx = new AuthContext(option);
			_userManager = manager;
		}

        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            IdentityUser user = new IdentityUser
            {
                UserName = userModel.UserName
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

            return result;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
			IdentityUser user = await _userManager.FindByNameAsync(userName);

			return user;
        }

		public async Task<IdentityUser> FindUserById(string id)
		{
			IdentityUser user = await _userManager.FindByIdAsync(id);

			return user;
		}

		public Client FindClient(string clientId)
        {
            var client = _ctx.Clients.Find(clientId);

            return client;
        }

        public async Task<bool> AddRefreshToken(RefreshToken token)
        {

           var existingToken = _ctx.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

           if (existingToken != null)
           {
             var result = await RemoveRefreshToken(existingToken);
           }
          
            _ctx.RefreshTokens.Add(token);

            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
           var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

           if (refreshToken != null) {
               _ctx.RefreshTokens.Remove(refreshToken);
               return await _ctx.SaveChangesAsync() > 0;
           }

           return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            _ctx.RefreshTokens.Remove(refreshToken);
             return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            return refreshToken;
        }

        public List<RefreshToken> GetAllRefreshTokens()
        {
             return  _ctx.RefreshTokens.ToList();
        }

        public async Task<IdentityUser> FindAsync(UserLoginInfo loginInfo)
        {
            IdentityUser user = await _userManager.FindByLoginAsync(loginInfo.LoginProvider, loginInfo.ProviderKey);

            return user;
        }

        public async Task<IdentityResult> CreateAsync(IdentityUser user)
        {
            var result = await _userManager.CreateAsync(user);

            return result;
        }

        public async Task<IdentityResult> AddLoginAsync(IdentityUser user, UserLoginInfo login)
        {
            var result = await _userManager.AddLoginAsync(user, login);

            return result;
        }

		public async Task<List<string>> GetRolesAsync(IdentityUser user)
		{
			var result = await _userManager.GetRolesAsync(user);			

			return  result.ToList();
		}

		public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }
    }
}