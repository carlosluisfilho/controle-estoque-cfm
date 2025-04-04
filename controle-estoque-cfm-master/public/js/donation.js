// ✅ Busca alimento pelo nome e preenche automaticamente o ID no formulário de doação
async function searchFood() {
    const foodName = document.getElementById('searchFood').value.trim();
    const searchResult = document.getElementById('searchResult');

    if (!foodName) {
        searchResult.innerHTML = '⚠️ Digite um nome para buscar!';
        searchResult.style.color = 'red';
        return;
    }

    console.log(`🔍 Buscando alimento: ${foodName}`);

    try {
        const response = await fetch(`/food/search?name=${encodeURIComponent(foodName)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log('📡 Resposta da API:', response);

        if (!response.ok) {
            searchResult.innerHTML = '❌ Alimento não encontrado!';
            searchResult.style.color = 'red';
            return;
        }

        const data = await response.json();
        console.log('✅ Dados recebidos:', data);

        searchResult.innerHTML = `✅ <b>${data.name}</b> encontrado! Quantidade disponível: <b>${data.quantity}</b>`;
        searchResult.style.color = 'green';

        document.getElementById('donationFoodId').value = data.id;

        // Também pré-preenche a validade do alimento, se houver
        if (data.expiration) {
            const expInput = document.getElementById('donationExpiration');
            if (expInput) expInput.value = data.expiration;
        }

    } catch (error) {
        console.error('❌ Erro ao buscar alimento:', error);
        searchResult.innerHTML = '❌ Erro ao buscar alimento!';
        searchResult.style.color = 'red';
    }
}

// ✅ Evento ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('btnSearchFood');
    if (searchButton) {
        searchButton.addEventListener('click', searchFood);
    } else {
        console.error("❌ ERRO: Botão de busca não encontrado!");
    }
});
