using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SwiftTask.Backend.Models;

namespace SwiftTask.Backend.Controllers;
[Route( "[controller]" )]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<SwiftTaskUser> _userManager;

    public AuthController( UserManager<SwiftTaskUser> userManager )
    {
        _userManager = userManager;
    }

    [HttpGet( "/me" )]
    [Authorize]
    public async Task<ActionResult> GetUser()
    {
        if( User?.Identity?.IsAuthenticated != true )
            return Unauthorized();

        var user = await _userManager.GetUserAsync( User );
        var anotherUser = await _userManager.FindByIdAsync( user.Id );

        if( user == null )
            return Unauthorized();

        return Ok( new
        {
            user.Id,
            user.UserName,
            user.Email
        } );
    }
}
