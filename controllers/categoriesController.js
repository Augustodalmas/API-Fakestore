`Controlador de metodos http de categorias, get, post, put e delete`

const Category = require("../Models/Categories");

//Função controladora de metodos
const categoriesController = {
    //Retorna todos os itens de categorias
    getALL: async (req, res) => {
        try {
            if (req.cookies.lang === 'pt-BR') {
                const categories = await Category.find().select("name_pt");
                const transformed = categories.map(category => (
                    category.name_pt
                ))
                res.json(transformed);
            } else if (req.cookies.lang === 'en-US') {
                const categories = await Category.find().select("name_en");
                const transformed = categories.map(category => (
                    category.name_en
                ))
                res.json(transformed);
            } else {
                const categories = await Category.find().select("name_es");
                const transformed = categories.map(category => (
                    category.name_es
                ))
                res.json(transformed);
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },
    //Retorna uma categoria em especifica baseada em seu ID
    get: async (req, res) => {
        try {
            const id = req.params.id;
            if (id.length !== 24 && id.length !== 12) {
                res.status(404).json({ msg: "ID encontrado Inválido" });
                return;
            }
            const category = await Category.findById(id)
            if (category === null) {
                res.status(404).json({ msg: "Categoria não encontrada!" });
                return;
            }
            res.json(category)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },
    //Metodo de criação de categoria
    create: async (req, res) => {
        try {
            //LowerCase para quando for filtrar nao retornar NULL
            const category_pt = req.body.name_pt.toLowerCase()
            const category_en = req.body.name_en.toLowerCase()
            const category_es = req.body.name_es.toLowerCase()
            await Category.create({
                name_pt: category_pt,
                name_en: category_en,
                name_es: category_es
            });
            res.status(201).json({ msg: "Categoria criada com sucesso!", status: 201 })
        } catch (error) {
            console.log("Erro ao criar categoria:", error);
            return res.status(500).json({ msg: "Erro ao criar categoria", error: error.message });
        }
    },
    //Metodo para deletar uma categoria do banco
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            if (id.length !== 24 && id.length !== 12) {
                res.status(404).json({ msg: "ID encontrado Inválido" });
                return;
            }
            const deleteCategory = await Category.findByIdAndDelete(id)
            if (deleteCategory === null) {
                res.status(404).json({ msg: "Categoria não encontrada!" });
                return;
            }
            res.status(200).json({ deleteCategory, msg: "Categoria deletada com sucesso!" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: "Erro ao deletar uma categoria", error: error.message });
        }
    },
    //Metodo para atualizar um nome de categoria
    update: async (req, res) => {
        try {
            const id = req.params.id;
            //LowerCase para quando for filtrar nao retornar NULL
            const category_pt = req.body.category.name_pt.toLowerCase()
            const category_en = req.body.category.name_en.toLowerCase()
            const category_es = req.body.category.name_es.toLowerCase()
            const categorie = {
                name_pt: category_pt,
                name_en: category_en,
                name_es: category_es,
            }
            if (id.length !== 24 && id.length !== 12) {
                res.status(404).json({ msg: "ID encontrado Inválido" });
                return;
            }
            try {
                const updateCategory = await Category.findByIdAndUpdate(id, categorie);
                if (updateCategory === null) {
                    res.status(404).json({ updateCategory, msg: "Categoria não encontrado!" });
                    return;
                }
                res.status(200).json({ msg: "Produto atualizado com sucesso!" })
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ msg: "Erro ao atualizar a categoria", error: error.message });
        }
    }
};


module.exports = categoriesController;