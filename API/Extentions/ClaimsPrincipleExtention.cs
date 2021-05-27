using System.Security.Claims;

namespace API.Extentions
{
    public static class ClaimsPrincipalExtention
    {
        public static string GetUsername(this ClaimsPrincipal user){
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        }
    }
}