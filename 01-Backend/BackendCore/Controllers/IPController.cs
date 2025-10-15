using Microsoft.AspNetCore.Mvc;

namespace FullPegaBackend.Controllers // Ajusta el namespace según el tuyo
{
    [ApiController]
    [Route("api/[controller]")]
    public class IPController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetIP()
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            return Ok(new { ip });
        }
    }
}
