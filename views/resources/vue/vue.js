
const vue = new Vue({
    el: "#app",
    data: {
        userdata: [],
        usuarios: [],
        modalAberto: false,
    },
    mounted(){
        
        fetch("http://localhost:3000/user-info")
        .then(response => response.json())
        .then(data => {
            this.userdata = data;
        });
             
        fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(users => {
            this.usuarios = users;
        })
    },
    methods: {
        deletar(userName) {
            fetch(`http://localhost:3000/deletar-usuario/${userName}`, {  
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
              
                    this.usuarios = this.usuarios.filter(user => user.nome !== userName);
                } else {
                    console.error('Erro ao deletar usuário:', response.statusText);
                }
            })
            .catch(error => console.error('Erro na requisição:', error));
        },
        abrirModal(user) {
            this.usuarioEditando = { ...user }; 
            this.modalAberto = true;
        },
        fecharModal() {
            this.modalAberto = false;
        },
        salvarAlteracoes() {
            fetch(`http://localhost:3000/usuarios/${this.usuarioEditando.id_usuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.usuarioEditando)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar o usuário');
                }
                return response.json();
            })
            .then(data => {
                console.log('Usuário atualizado:', data);
            
                const index = this.usuarios.findIndex(user => user.id_usuario === this.usuarioEditando.id_usuario);
                if (index !== -1) {
                    this.usuarios.splice(index, 1, this.usuarioEditando);
                }
                this.fecharModal();
            })
            .catch(error => {
                console.error('Erro:', error);
            });
            
        }
        
    }
})