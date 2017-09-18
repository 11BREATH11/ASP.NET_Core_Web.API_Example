using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    [Table("Users")]
    public class Users
	{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id
		{
			get;
			set;
		}

		public string Name
		{
			get;
			set;
		}
        
        public virtual ICollection<UsersPets> UsersPets { get; set; }
    }
}
