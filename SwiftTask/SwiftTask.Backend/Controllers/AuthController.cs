using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SwiftTask.Backend.Models;

namespace SwiftTask.Backend.Controllers;

// AuthController handles authenticated user-related endpoints.
[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase {
    private readonly UserManager<SwiftTaskUser> _userManager;

    public AuthController(UserManager<SwiftTaskUser> userManager) => _userManager = userManager;

    // Returns the currently authenticated user's basic information (Id, UserName, Email).
    // Requires the user to be authenticated via [Authorize] attribute.
    // Returns 401 Unauthorized if the user is not authenticated.
    [HttpGet("/me")]
    [Authorize]
    public async Task<ActionResult> GetUser() {
        if (User?.Identity?.IsAuthenticated != true)
            return Unauthorized();
        try {
            var user = await _userManager.GetUserAsync(User);
            var anotherUser = await _userManager.FindByIdAsync(user.Id);

            return user == null
                ? Unauthorized()
                : Ok(new {
                    id = user.Id,
                    userName = user.UserName,
                    email = user.Email
                });
        } catch (Exception ex) {
            await Console.Out.WriteLineAsync(ex.Message);
            return Unauthorized();
        }

    }
}
