using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
	public class UsersPets
	{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id
        {
            get;
            set;
        }

        public int UserId
		{
			get;
			set;
		}

		public int PetId
		{
			get;
			set;
		}

        [ForeignKey("UserId")]
        public virtual Users Users { get; set; }

        [ForeignKey("PetId")]
        public virtual Pets Pets { get; set; }

    }
}
