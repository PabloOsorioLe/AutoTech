namespace BackendCore.Models
{
    public class Categoria
    {
        public int CategoriaID { get; set; }
        public string NombreCategoria { get; set; } = null!;
        public int UserID { get; set; }
    }

}
