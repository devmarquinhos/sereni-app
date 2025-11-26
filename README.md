# Sereni

Aplicação cliente para o ecossistema **Sereni**, uma ferramenta de apoio à saúde mental. Desenvolvido com **React Native** e **Expo**, o aplicativo oferece uma interface para auxiliar no gerenciamento da ansiedade, conectando-se à Sereni API.

## ✨ Funcionalidades Principais

- **Autenticação:** Login e Cadastro de usuários.
- **Diário de Emoções:** Registro diário de humor e notas pessoais.
- **Trilhas de Aprendizado:** Módulos educativos para o usuário e sua rede de apoio.
- **Lições Interativas:** Player de conteúdo com cards e quizzes.
- **Botão SOS:** Acesso rápido a recursos de ajuda.

## 🛠️ Tecnologias Utilizadas

- **Core:** React Native, Expo, TypeScript
- **Estilização:** NativeWind (Tailwind CSS)
- **Estado & API:** Zustand, Axios
- **Navegação:** Expo Router

## 🚀 Como Rodar o Projeto

Pré-requisitos: Node.js instalado.

### 1. Instalação

Na pasta do projeto, instale as dependências:

```bash
npm install
```

### 2. Configuração da API

Antes de iniciar, verifique o arquivo `src/services/api.ts` e certifique-se de que o `baseURL` aponta para o endereço IP do seu backend rodando localmente:

```typescript
export const api = axios.create({
  baseURL: "http://SEU_IP_LOCAL:3000",
});
```

### 3. Execução

Inicie o servidor de desenvolvimento:

```bash
npx expo start
```

- Utilize o app **Expo Go** (Android/iOS) para escanear o QR Code ou execute em um emulador pressionando `a` (Android) ou `i` (iOS).

## 📜 Licença

Este projeto está sob a licença MIT.
