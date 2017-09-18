using System.Collections.Generic;
using BLL.Models;
using DAL.Models;

namespace BLL
{
	public interface IMainService
	{
		Users InsertUser(Users user);
		UsersPageView GetUsersView(int pageNumber, int pageSize);
		Users CreateUser(Users user);
		void DeleteUser(int id);
		Pets InsertPets(Pets pet);
	    IEnumerable<UsersView> GetAllUsers();
        PetsPageView GetPetsView(int userId, int pageNumber, int pageSize);
		PetsView CreatePet(Pets pet, int userId);
		void DeletePet(int id);

	}
}
