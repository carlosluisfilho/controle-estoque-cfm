async function searchFood() {
    const foodName = document.getElementById('searchFood').value.trim();
    const searchResult = document.getElementById('searchResult');

    if (!foodName) {
        searchResult.innerHTML = '⚠️ Digite um nome para buscar!';
        searchResult.style.color = 'red';
        return;
    }

    console.log(`🔍 Buscando alimento: ${foodName}`); // ✅ Log para depuração

    try {
        const response = await fetch(`/food/search?name=${encodeURIComponent(foodName)}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        console.log(`📡 Resposta da API:`, response); // ✅ Log para ver a resposta do backend

        if (!response.ok) {
            searchResult.innerHTML = '❌ Alimento não encontrado!';
            searchResult.style.color = 'red';
            return;
        }

        const data = await response.json();
        console.log(`✅ Dados recebidos:`, data); // ✅ Log para ver os dados recebidos

        searchResult.innerHTML = `✅ <b>${data.name}</b> encontrado! Quantidade disponível: <b>${data.quantity}</b>`;
        searchResult.style.color = 'green';

        // Preencher automaticamente o ID no campo do formulário
        document.getElementById('donationFoodId').value = data.id;
    } catch (error) {
        console.error('❌ Erro ao buscar alimento:', error);
        searchResult.innerHTML = '❌ Erro ao buscar alimento!';
        searchResult.style.color = 'red';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('btnSearchFood');
    if (searchButton) {
        searchButton.addEventListener('click', searchFood);
    } else {
        console.error("❌ ERRO: Botão de busca não encontrado!");
    }
});
