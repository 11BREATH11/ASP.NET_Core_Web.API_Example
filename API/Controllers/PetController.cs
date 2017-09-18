using BLL;
using BLL.Models;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
	[Produces("application/json")]
	[Route("api/Pet")]
	public class PetController : Controller
    {
		private readonly IMainService _mainService;

		public PetController(IMainService mainService)
	    {
		    _mainService = mainService;
	    }		

		[HttpGet]
		public PetsPageView GetPets(int userId,int pageNumber, int pageSize)
		{
			return _mainService.GetPetsView(userId,pageNumber, pageSize);
		}

		[HttpPost]
		public PetsView PostPet([FromBody]Pets pet,int userId)
		{
			return _mainService.CreatePet(pet, userId);
		}

		[HttpDelete]
		public string DeletePet(int id)
		{
			_mainService.DeletePet(id);

            return "";
		}
	}
}
