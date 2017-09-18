using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using BLL.Models;
using DAL;
using DAL.Models;

namespace BLL
{
	public class MainService: IMainService
	{
		private readonly IGenericRepository _gRep;
		
		public MainService(IGenericRepository genericRepository)
		{
			_gRep = genericRepository;
		}

		#region Users

		public Users InsertUser(Users user)
		{
			var newUser = _gRep.Insert<Users>(user);

			return newUser;
		}

		public IEnumerable<UsersView> GetAllUsers()
		{
            var usersView = from user in _gRep.Table<Users>()
                            select new UsersView
                            {
                                Id = user.Id,
                                Name = user.Name,
                                TotalPets = user.UsersPets.Count
                            };


            return usersView;
        }

		public UsersPageView GetUsersView(int pageNumber, int pageSize)
		{
		    var usersView = from user in _gRep.Table<Users>().OrderBy(m => m.Id).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                select new UsersView
				{
					Id = user.Id,
					Name = user.Name,
					TotalPets = user.UsersPets.Count
				};
						
			var usersPageView = new UsersPageView
			{
				Items = usersView,
				TotalItems = _gRep.Table<Users>().Count()
			};

			return usersPageView;
		}

		public Users CreateUser(Users user)
		{
			return _gRep.Insert(user);
		}
		public void DeleteUser(int id)
		{
			var user = _gRep.Table<Users>().First(m => m.Id == id);
			_gRep.Delete(user);
		}

		#endregion

		#region Pets

		public Pets InsertPets(Pets pet)
		{
			var newPet = _gRep.Insert<Pets>(pet);

			return newPet;
		}

		public IEnumerable<Pets> GetAllPets()
		{
			return _gRep.SelectAll<Pets>();
		}

		public PetsPageView GetPetsView(int userId, int pageNumber, int pageSize)
		{
            var petsView = from pets  in _gRep.Table<UsersPets>().Where(p => p.UserId == userId)
                           select new PetsView
                            {
                               Id = pets.Id,
                               Name = pets.Pets.Name,                               
                            };           

            
            var petsPageView = new PetsPageView
			{
				Items = petsView.OrderBy(m => m.Id).Skip((pageNumber - 1) * pageSize).Take(pageSize),
				TotalItems = petsView.Count(),
				UserName =  _gRep.Table<Users>().First(p => p.Id == userId).Name

			};

			return petsPageView;
		}

		public PetsView CreatePet(Pets pet,int userId)
		{
			var newPet = _gRep.Insert(pet);

			var petUser = new UsersPets
			{
				UserId = userId,
				PetId = newPet.Id
			};

			_gRep.Insert(petUser);

			return new PetsView {Id = pet.Id, Name = pet.Name };
		}
		public void DeletePet(int id)
		{
			var user = _gRep.Table<Pets>().First(m => m.Id == id);
			_gRep.Delete(user);
        }

		#endregion
	}
}
