using DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orders
{
    public class AuthDbContextFactory : IDesignTimeDbContextFactory<AuthContext>
	{
		/*private IConfiguration config;
		public OwnersDbContextFactory(IConfiguration config)
		{
			this.config = config;
		}*/

		public AuthContext CreateDbContext(string[] args)
		{
			var builder = new DbContextOptionsBuilder<AuthContext>();
			builder.UseSqlServer("Data Source=HOME-PC;Initial Catalog=AngularJSAuth;Integrated Security=SSPI;");

			return new AuthContext(builder.Options);
		}
	}
}
