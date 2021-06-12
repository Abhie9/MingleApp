using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FallbackController: Controller
    {
        //fallback to index to this controller
        public ActionResult Index(){
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            "wwwroot", "index.html"), "text/html");
        }
    }
}