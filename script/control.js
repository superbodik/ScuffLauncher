// Получаем все кнопки с классом "side-button"
const buttons = document.querySelectorAll('.side-button');

// Проходим по каждой кнопке и добавляем обработчик события
buttons.forEach(button => {
  button.addEventListener('click', function() {
    // Убираем класс 'selected' у всех кнопок
    buttons.forEach(btn => btn.classList.remove('selected'));

    // Добавляем класс 'selected' к нажатой кнопке
    this.classList.add('selected');
  });
});


