// Função para buscar alimento por nome
async function searchFood() {
    const foodName = document.getElementById('searchFood').value.trim();
    const searchResult = document.getElementById('searchResult');

    if (!foodName) {
        searchResult.innerHTML = '⚠️ Digite um nome para buscar!';
        searchResult.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`/food?name=${encodeURIComponent(foodName)}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            searchResult.innerHTML = '❌ Alimento não encontrado!';
            searchResult.style.color = 'red';
            return;
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            searchResult.innerHTML = '❌ Alimento não encontrado!';
            searchResult.style.color = 'red';
            return;
        }

        const food = data[0];
        searchResult.innerHTML = `✅ <b>${food.name}</b> encontrado! Quantidade disponível: <b>${food.quantity}</b>`;
        searchResult.style.color = 'green';

        document.getElementById('distributionFoodId').value = food.id;
    } catch (error) {
        console.error('❌ Erro ao buscar alimento:', error);
        searchResult.innerHTML = '❌ Erro ao buscar alimento!';
        searchResult.style.color = 'red';
    }
}

// Função para registrar distribuição
async function registerDistribution(event) {
    event.preventDefault();

    const foodId = document.getElementById('distributionFoodId').value;
    const quantity = document.getElementById('distributionQuantity').value;
    const house_name = document.getElementById('houseName').value;

    if (!foodId || !quantity || !house_name) {
        alert('Preencha todos os campos para registrar a distribuição.');
        return;
    }

    try {
        const response = await fetch('/distribution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ food_id: foodId, quantity, house_name })
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Erro ao registrar distribuição: ${errorData.message || response.statusText}`);
            return;
        }

        alert('✅ Distribuição registrada com sucesso!');
        document.getElementById('distributionForm').reset();
        document.getElementById('searchResult').innerHTML = '';
    } catch (error) {
        console.error('Erro ao registrar distribuição:', error);
        alert('❌ Erro inesperado ao registrar distribuição.');
    }
}

// Evento de carregamento do DOM
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('btnSearchFood');
    const form = document.getElementById('distributionForm');

    if (searchButton) searchButton.addEventListener('click', searchFood);
    if (form) form.addEventListener('submit', registerDistribution);
});
