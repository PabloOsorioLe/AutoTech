using BackendCore.Data;
using BackendCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BackendCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly BackendCoreContext _context;

        public ProductosController(BackendCoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var productos = await _context.Productos
                .Include(p => p.Categoria)  // Incluir categoría relacionada
                .Where(p => p.Estado == 1)
                .ToListAsync();
            return Ok(productos);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Producto producto)
        {
            producto.Estado = 1;
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();
            return Ok(producto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Producto updatedProducto)
        {
            if (id != updatedProducto.Id)
            {
                return BadRequest(new { message = "ID del producto no coincide" });
            }

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            producto.Nombre = updatedProducto.Nombre;
            producto.CategoriaID = updatedProducto.CategoriaID; // actualizar FK categoría
            producto.Codigo = updatedProducto.Codigo;
            producto.Precio = updatedProducto.Precio;
            producto.Stock = updatedProducto.Stock;
            producto.Proveedor = updatedProducto.Proveedor;
            producto.Ubicacion = updatedProducto.Ubicacion;
            producto.FechaIngreso = updatedProducto.FechaIngreso;
            producto.Descripcion = updatedProducto.Descripcion;
            producto.ImagenUrl = updatedProducto.ImagenUrl;

            await _context.SaveChangesAsync();

            return Ok(producto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            producto.Estado = 0;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Producto desactivado (no eliminado físicamente)" });
        }
    }
}
