using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL
{
    public class OwnersPetsContext : DbContext
    {
		/*public OwnersPetsContext() : base("name=OwnersPetsContext")
        {
            var ensureDLLIsCopied = System.Data.Entity.SqlServer.SqlProviderServices.Instance;
        }*/

		public OwnersPetsContext()		
		{

		}

		public OwnersPetsContext(DbContextOptions<OwnersPetsContext> options)
            : base(options)
        {

		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>().ToTable("Users");
            modelBuilder.Entity<Pets>().ToTable("Pets");
            modelBuilder.Entity<UsersPets>().ToTable("UsersPets");

            base.OnModelCreating(modelBuilder);
        }

    }

}