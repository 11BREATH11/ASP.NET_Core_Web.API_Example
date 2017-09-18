using System.Collections.Generic;
using BLL;
using BLL.Models;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{    
	[Produces("application/json")]	
	public class UserController : Controller
    {
		private readonly IMainService _mainService;        

		public UserController(IMainService mainService)
	    {
		    _mainService = mainService;
	    }

		[HttpGet]
		[Route("api/User/All")]
		public IEnumerable<UsersView> GetUsersAll()
        {
            return _mainService.GetAllUsers();
        }

		[Authorize]
		[HttpGet]
		[Route("api/User")]
		public UsersPageView GetUsers(int pageNumber, int pageSize)
		{
			return _mainService.GetUsersView(pageNumber, pageSize);
		}

		[Authorize]
		[HttpPost]
		[Route("api/User")]
		public Users PostUser([FromBody]Users user)
		{
			return _mainService.CreateUser(user);
		}

		[Authorize]
		[HttpDelete]
		[Route("api/User")]
		public string DeleteUser(int id)
		{
			_mainService.DeleteUser(id);

		    return "";
		}
	}
}
