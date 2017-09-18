using API.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Models;
using Microsoft.AspNetCore.Identity;
using DAL.Entities;

namespace DAL
{
    public interface IAuthRepository : IDisposable
    {
		Task<IdentityResult> RegisterUser(UserModel userModel);

		Task<IdentityUser> FindUser(string userName, string password);

		Task<IdentityUser> FindUserById(string id);

		Client FindClient(string clientId);

		Task<bool> AddRefreshToken(RefreshToken token);

		Task<bool> RemoveRefreshToken(string refreshTokenId);

		Task<bool> RemoveRefreshToken(RefreshToken refreshToken);

		Task<RefreshToken> FindRefreshToken(string refreshTokenId);

		List<RefreshToken> GetAllRefreshTokens();

		Task<IdentityUser> FindAsync(UserLoginInfo loginInfo);

		Task<IdentityResult> CreateAsync(IdentityUser user);

		Task<IdentityResult> AddLoginAsync(IdentityUser user, UserLoginInfo login);

		Task<List<string>> GetRolesAsync(IdentityUser user);

	}
}