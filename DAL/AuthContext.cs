using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DAL.Entities;

namespace DAL
{
    public class AuthContext : IdentityDbContext<IdentityUser>
    {
		/*public AuthContext()
            : base("AuthContext")
        {
            var ensureDLLIsCopied = System.Data.Entity.SqlServer.SqlProviderServices.Instance;
        }*/		

		public AuthContext(DbContextOptions<AuthContext> options)
            : base(options)
        {
		}

		public DbSet<Client> Clients { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }

}