document.addEventListener('DOMContentLoaded', () => {

    // 1. Seleciona os elementos do formulário de login
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    // Verifica se o formulário realmente existe na página atual
    if (loginForm) {

        // 2. Adiciona um "escutador" para o evento de envio do formulário
        loginForm.addEventListener('submit', (event) => {
            
            // 3. Previne o comportamento padrão do navegador (que é recarregar a página)
            event.preventDefault();

            // 4. Pega os valores digitados pelo usuário
            const email = emailInput.value.trim();
            const senha = senhaInput.value.trim();

            // 5. Validação básica: verifica se os campos não estão vazios
            if (email === '' || senha === '') {
                alert('Por favor, preencha todos os campos.');
                return; // Para a execução aqui se os campos estiverem vazios
            }

            // --- SIMULAÇÃO DE AUTENTICAÇÃO ---
            // Em um site real, esta verificação seria feita no servidor (back-end).
            // Aqui, vamos apenas comparar com dados fixos para teste.

            const emailCorreto = 'user@padaria.com';
            const senhaCorreta = 'senha123';
            
            // 6. Verifica se os dados digitados correspondem aos dados de teste
            if (email === emailCorreto && senha === senhaCorreta) {
                // Se estiverem corretos:
                alert('Login realizado com sucesso! Bem-vindo(a)!');
                
                // Redireciona o usuário para a página inicial
                window.location.href = '/index.html';

            } else {
                // Se estiverem incorretos:
                alert('Email ou senha incorretos. Tente novamente.');
                senhaInput.value = ''; // Limpa o campo de senha por segurança
            }
        });
    }
});