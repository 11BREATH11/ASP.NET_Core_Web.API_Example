﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Models
{
	public class UsersPageView
	{
		public IEnumerable<UsersView> Items;
		public int TotalItems;
	}
}
