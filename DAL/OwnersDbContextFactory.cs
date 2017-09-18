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
    public class OwnersDbContextFactory : IDesignTimeDbContextFactory<OwnersPetsContext>
	{
		/*private IConfiguration config;
		public OwnersDbContextFactory(IConfiguration config)
		{
			this.config = config;
		}*/

		public OwnersPetsContext CreateDbContext(string[] args)
		{
			var builder = new DbContextOptionsBuilder<OwnersPetsContext>();
			builder.UseSqlServer("Data Source=HOME-PC;Initial Catalog=OwnersPets;Integrated Security=SSPI;");

			return new OwnersPetsContext(builder.Options);
		}
	}
}
