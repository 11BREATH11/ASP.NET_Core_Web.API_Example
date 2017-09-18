using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
	public interface IGenericRepository : IDisposable
	{
		T Insert<T>(T model) where T : class;
		T Update<T>(T model) where T : class;
		void Delete<T>(T model) where T : class;
	    IEnumerable<T> SelectAll<T>() where T : class;
        DbSet<T> Table<T>() where T : class;
	    T Select<T>(int pk) where T : class;
	}
}
