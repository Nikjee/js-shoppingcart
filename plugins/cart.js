$.cart = function (options) {
  return new Promise((resolve, reject) => {
    const modal = $.modal({
      title: options.title,
      width: '800px',
      closable: false,
      content: options.content,
      Test: options.Test,
      onClose() {
        modal.destroy()
      },
      footerButtons: [
        {
          text: 'Отменить',
          type: 'secondary',
          handler() {
            modal.close()
            reject()
          },
        },
      ],
    })
    setTimeout(() => modal.open(), 100)
  })
}
