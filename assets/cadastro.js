document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do formulário
    const form = document.getElementById('cadastro-form');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmaSenhaInput = document.getElementById('confirma-senha');
    const cepInput = document.getElementById('cep');
    const telefoneInput = document.getElementById('telefone'); // NOVO: Seleção do campo de telefone

    // Seleciona os elementos de erro
    const emailError = document.getElementById('email-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    // REMOVIDO: Seleção da barra de força e texto

    // Validação do Email em tempo real
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(email)) {
                emailError.textContent = '';
                emailInput.classList.remove('invalid');
                emailInput.classList.add('valid');
            } else {
                emailError.textContent = 'Formato de e-mail inválido.';
                emailInput.classList.remove('valid');
                emailInput.classList.add('invalid');
            }
        });
    }

    
    // validação de confirmação
    if (senhaInput) {
        senhaInput.addEventListener('input', () => {
            validarConfirmacaoSenha();
        });
    }

    // Validação da Confirmação de Senha
    if (confirmaSenhaInput) {
        confirmaSenhaInput.addEventListener('input', validarConfirmacaoSenha);
    }

    function validarConfirmacaoSenha() {
        if (!senhaInput || !confirmaSenhaInput) return;
        const senha = senhaInput.value;
        const confirmaSenha = confirmaSenhaInput.value;

        if (confirmaSenha.length === 0 && senha.length === 0) {
            confirmPasswordError.textContent = '';
            confirmaSenhaInput.classList.remove('invalid', 'valid');
            return;
        }

        if (senha === confirmaSenha) {
            confirmPasswordError.textContent = '';
            confirmaSenhaInput.classList.remove('invalid');
            confirmaSenhaInput.classList.add('valid');
        } else {
            confirmPasswordError.textContent = 'As senhas não coincidem.';
            confirmaSenhaInput.classList.remove('valid');
            confirmaSenhaInput.classList.add('invalid');
        }
    }

    // Máscara automática para o campo CEP
    if (cepInput) {
        cepInput.addEventListener('input', (event) => {
            let valor = event.target.value.replace(/\D/g, '');
            valor = valor.substring(0, 8);
            if (valor.length > 5) {
                valor = valor.substring(0, 5) + '-' + valor.substring(5);
            }
            event.target.value = valor;
        });
    }
    
    // NOVO: Máscara automática para o campo Telefone
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (event) => {
            let valor = event.target.value.replace(/\D/g, '');
            valor = valor.substring(0, 11); // Limita a 11 dígitos (DDD + 9 dígitos)

            let valorFormatado = '';
            if (valor.length > 0) {
                valorFormatado = '(' + valor.substring(0, 2);
            }
            if (valor.length > 2) {
                valorFormatado += ') ' + valor.substring(2, 7);
            }
            if (valor.length > 7) {
                valorFormatado += '-' + valor.substring(7);
            }
            
            event.target.value = valorFormatado;
        });
    }


    // Prevenção de envio se os dados estiverem inválidos
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const hasInvalidFields = form.querySelector('input.invalid');
            const isPasswordConfirmed = senhaInput.value === confirmaSenhaInput.value && senhaInput.value.length > 0;

            if (hasInvalidFields || !isPasswordConfirmed) {
                alert('Por favor, corrija os erros no formulário antes de enviar.');
            } else {
                alert('Cadastro realizado com sucesso!');
                // form.submit(); 
            }
        });
    }
});