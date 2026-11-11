const form = document.getElementById('imc-form');
const inputPeso = document.getElementById('peso');
const inputAltura = document.getElementById('altura');
const erroPeso = document.getElementById('erro-peso');
const erroAltura = document.getElementById('erro-altura');
const resultado = document.getElementById('resultado');
const imcNumero = document.getElementById('imc-numero');
const imcClassificacao = document.getElementById('imc-classificacao');
const btnLimpar = document.getElementById('btn-limpar');

const CLASSES_IMC = [
  'muito-baixo',
  'normal',
  'sobrepeso',
  'obesidade-1',
  'obesidade-2',
  'obesidade-3',
];

function classificarIMC(imc) {
  if (imc < 18.5) return { classe: 'muito-baixo', texto: '⬇️ Abaixo do peso' };
  if (imc < 25)   return { classe: 'normal',      texto: '✅ Peso normal' };
  if (imc < 30)   return { classe: 'sobrepeso',   texto: '⚠️ Sobrepeso' };
  if (imc < 35)   return { classe: 'obesidade-1', texto: '🔴 Obesidade grau I' };
  if (imc < 40)   return { classe: 'obesidade-2', texto: '🔴 Obesidade grau II' };
  return           { classe: 'obesidade-3',        texto: '🔴 Obesidade grau III' };
}

function validarPeso(valor) {
  if (valor === '' || valor === null) return 'Informe o peso.';
  const num = parseFloat(valor);
  if (isNaN(num))       return 'Peso deve ser um número.';
  if (num <= 0)         return 'Peso deve ser maior que zero.';
  if (num > 600)        return 'Peso inválido (máx. 600 kg).';
  return '';
}

function validarAltura(valor) {
  if (valor === '' || valor === null) return 'Informe a altura.';
  const num = parseFloat(valor);
  if (isNaN(num))       return 'Altura deve ser um número.';
  if (num <= 0)         return 'Altura deve ser maior que zero.';
  if (num < 0.5)        return 'Altura inválida (mín. 0,50 m).';
  if (num > 3)          return 'Altura inválida (máx. 3,00 m).';
  return '';
}

function mostrarErro(elemento, mensagem) {
  elemento.textContent = mensagem;
  elemento.previousElementSibling.previousElementSibling.classList.toggle('input-erro', mensagem !== '');
}

function limparDestaque() {
  CLASSES_IMC.forEach(c => resultado.classList.remove(c));
  document.querySelectorAll('.escala-item').forEach(el => el.classList.remove('ativo'));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const valPeso = inputPeso.value.trim();
  const valAltura = inputAltura.value.trim();

  const msgPeso = validarPeso(valPeso);
  const msgAltura = validarAltura(valAltura);

  mostrarErro(erroPeso, msgPeso);
  mostrarErro(erroAltura, msgAltura);

  if (msgPeso || msgAltura) return;

  const peso = parseFloat(valPeso);
  const altura = parseFloat(valAltura);
  const imc = peso / (altura * altura);

  const { classe, texto } = classificarIMC(imc);

  imcNumero.textContent = imc.toFixed(2).replace('.', ',');
  imcClassificacao.textContent = texto;

  limparDestaque();
  resultado.classList.remove('hidden');
  resultado.classList.add(classe);

  // destaca a faixa correspondente na escala
  const indice = CLASSES_IMC.indexOf(classe);
  document.querySelectorAll('.escala-item')[indice].classList.add('ativo');

  resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Validação em tempo real
inputPeso.addEventListener('input', () => {
  if (erroPeso.textContent) mostrarErro(erroPeso, validarPeso(inputPeso.value.trim()));
});

inputAltura.addEventListener('input', () => {
  if (erroAltura.textContent) mostrarErro(erroAltura, validarAltura(inputAltura.value.trim()));
});

// Bloqueia letras e caracteres inválidos em inputs numéricos
[inputPeso, inputAltura].forEach(input => {
  input.addEventListener('keydown', (e) => {
    const permitidos = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','.',',' ,'-'];
    if (!permitidos.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault();
  });
});

btnLimpar.addEventListener('click', () => {
  form.reset();
  mostrarErro(erroPeso, '');
  mostrarErro(erroAltura, '');
  limparDestaque();
  resultado.classList.add('hidden');
});