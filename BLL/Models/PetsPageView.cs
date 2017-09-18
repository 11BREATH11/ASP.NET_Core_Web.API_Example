using BLL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
	public class PetsPageView
	{
		public IEnumerable<PetsView> Items;
		public int TotalItems;
		public string UserName;
	}
}
