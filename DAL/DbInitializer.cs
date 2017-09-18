using API.Entities;
using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL
{
	public static class DbInitializer
	{
		public static void Initialize(AuthContext context)
		{
			if (!context.Clients.Any())
			{
				context.Clients.Add(new Client
				{
					Id = "ngAuthApp",
					Secret = Helper.GetHash("11breath11@gmail.com"),
					Name = "Angular Application",
					ApplicationType = DAL.Models.ApplicationTypes.JavaScript,
					Active = true,
					RefreshTokenLifeTime = 7200,
					AllowedOrigin = "http://localhost:8510"
				});

				context.SaveChanges();
			}
		}
	}
}
