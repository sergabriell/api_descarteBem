# api_descarteBem

## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/user`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

-   **Requisição**  

    -   name
    -   email
    -   cpf
    -   password
    -   address

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "name": "José",
    "email": "jose@email.com",
    "cpf": "12345678910",
    "password": "12345senha",
    "address": "ST. D Norte QND 47, Brasília, DF, 70297-400"
}
```
### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

-   **Requisição**  

    -   email
    -   password

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "password": "12345senha"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "user": {
        "id": "2532e9e7-dcfc-4a03-8b42-75c35b4d1c44",
        "name": "José",
        "email": "jose@email.com",
		"address": "ST. D Norte QND 47, Brasília, DF, 70297-400"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, deverão exigir o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado.

### **Detalhar usuário**

#### `GET` `/user`

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
{
    "id": "2532e9e7-dcfc-4a03-8b42-75c35b4d1c44",
    "name": "José",
    "email": "jose@email.com",
    "cpf": "12345678910",
    "password": "12345senha",
    "address": "ST. D Norte QND 47, Brasília, DF, 70297-400",
    "score": 0
}
```

### **Atualizar usuário**

#### `PATCH` `/user`

#### **Exemplo de requisição**

```javascript
// PATCH /user
{
    "name": "José",
    "email": "jose@email.com",
    "cpf": "12345678910",
    "password": "12345senha",
    "address": "ST. D Norte QND 47, Brasília, DF, 70297-400",
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
    'Já existe um usuário cadastrado com o e-mail informado.'
```

### **Excluir Usuário**

#### `DELETE` `/user`

## **ATENÇÃO**: Usuário só poderar ser excluido se não houver trocas e compras.

#### **Exemplos de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
    'Exclua suas trocas e compras para poder deletar sua conta.'
```

### **Listar Categorias**

#### `GET` `/categories`

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
[
    {
        "id": "1cdfe9fa-63b8-4067-aha0-dc7f89cbf546",
        "name": "Plastico",
		"score": "300"
    },
    {
		"id": "bc13fd83-efd1-4faf-8786-774ba114d453",
		"name": "Vidro",
		"score": "80"
	},
]
```

### **Listar Cupons**

#### `GET` `/vouchers`

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
[
    {
		"id": "343gd3ce-be10-408f-bed9-493579d77812",
		"name": "Cupom R$20 iFood",
		"value": "6500"
	},
	{
		"id": "0762c678-216d-4e7f-aed1-10a639628f76",
		"name": "Cupom R$30 iFood",
		"value": "8000"
	},
]
```

### **Listar Pontos de Coleta**

#### `GET` `/collect-points`

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
[
    {
		"id": "f4s475c2-47te-4505-92fe-a7c0710a1df7",
		"name": "UP Colégio Integral",
		"address": "St. A Norte QNA, 37, casa 01, Brasília, DF, 72110-370"
	},
	{
		"id": "fa9200f6-1885-48a5-964c-28ac443f6634",
		"name": "INEESP - Instituto Nacional de Ensino Especial",
		"address": "ST. D Norte QND 47, Brasília, DF, 70297-400"
	},
]
```

### **Cadastrar troca para o usuário logado**

#### `POST` `/exchange`

#### **Exemplo de requisição**

```javascript
// POST /exchange
{
	"category_id": "154de72f-4bc4-4631-bc4d-c13a11880651",
	"collect_point_id": "94d11390-88bf-4427-8b51-b722f9324ef7",
	"amount": "2"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
{
	"mensagem": "Parabéns! Você fez um descarte consciente!"
}
```

### **Listar trocas do usuário**

#### `GET` `/exchange`

#### **Exemplos de resposta**

```javascript
// HTTP Status 201
[	
    {
		"id": "be3b53d7-cee2-4de3-8ad7-8335995caec2",
		"user_name": "José",
		"category_name": "Óleo Vegetal",
		"amount": 2,
		"collection_location": "Escola Canadense de Brasília",
		"collection_address": "QS 5, Águas Claras, Brasília, DF, 71955-000",
		"score": "6000"
	}
]
```

### **Atualizar troca do usúario**

#### `PUT` `/exchange/:exchange_id`

#### **Exemplo de requisição**

```javascript
// PUT /exchange/be3b53d7-cee2-4de3-8ad7-8335995caec2
{
	"category_id": "a5681011-6930-404e-b591-c62887b67f7f",
	"collect_point_id": "0d5fb9e2-9503-45b3-84f5-a111d4885ef5",
	"amount": "1"
}
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

### **Deletar troca do usúario**

#### `DELETE` `/exchange/:exchange_id`

#### **Exemplo de requisição**

```javascript
// DELETE /exchange/be3b53d7-cee2-4de3-8ad7-8335995caec2
```

#### **Exemplo de resposta**

```javascript
// HTTP Status 204
// Sem conteúdo no corpo (body) da resposta
```

### **Registrar compra de cupom do usúario**

#### `POST` `/shopping`

#### **Exemplo de requisição**

```javascript
// POST /shopping
{
	"voucher_id": "de9ad33e-dae8-4d85-938d-d06d5f62a0ca"
}
```

#### **Exemplos de resposta**

```javascript
// Se tiver pontos
// HTTP Status 201
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 401
{
    "mensagem": "Você não tem ponstos suficientes..."
}
```

### **Listar compras de cupom do usúario**

#### `GET` `/shopping`

#### **Exemplo de requisição**

```javascript
// GET /shopping
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200
[
	{
		"id": "93ac37ac-ffea-4856-9ffa-6f69b3c849bb",
		"user_name": "José",
		"cpf": "12345678912",
		"email": "lolzeiro@email.com",
		"voucher": "Cupom R$50 Faber-Castell",
		"value": "11000"
	}
]
```

```javascript
// HTTP Status 200
[]
```

### **Deletar compra de cupom do usúario**

#### `DELETE` `/shopping/:id_shopping`

#### **Exemplo de requisição**

```javascript
// DELETE /shopping/be3b53d7-cee2-4de3-8ad7-8235995caec2
```

#### **Exemplos de respostas**

```javascript
// HTTP Status 200
{
	"mensagem": "Compra deletada com sucesso!"
}
```

```javascript
// HTTP Status 401
{
    "mensagem": "Compra não encontrada."
}
```