const vue = new Vue({
    el: "#app",
    data: {
        userdata: {},
        produtos: [],
        produtoEditando: {},
        modalAberto: false,
    },
    mounted() {
        fetch("http://localhost:3000/user-info")
            .then(response => response.json())
            .then(data => {
                this.userdata = data;
            });
        
        fetch("http://localhost:3000/produtos")
            .then(response => response.json())
            .then(produtos => {
                this.produtos = produtos;
            });
    },
    methods: {
        deletar(produtoId) {
            fetch(`http://localhost:3000/deletar-produto/${produtoId}`, {  
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    this.produtos = this.produtos.filter(produto => produto.id_produto !== produtoId);
                } else {
                    console.error('Erro ao deletar produto:', response.statusText);
                }
            })
            .catch(error => console.error('Erro na requisição:', error));
        },
        
        abrirModal(produto) {
            this.produtoEditando = { ...produto };
            this.modalAberto = true;
        },
        
        fecharModal() {
            this.modalAberto = false;
        },
        
        salvarAlteracoes() {
            if (!this.produtoEditando.id_produto) {
                console.error('Produto não possui ID válido');
                return;
            }

            fetch(`http://localhost:3000/produtos/${this.produtoEditando.id_produto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.produtoEditando)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar o produto');
                }
                return response.json();
            })
            .then(data => {
                console.log('Produto atualizado:', data);
                
                const index = this.produtos.findIndex(produto => produto.id_produto === this.produtoEditando.id_produto);
                if (index !== -1) {
                    this.produtos.splice(index, 1, this.produtoEditando);
                }
                this.fecharModal();
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        }
        
    }
});
