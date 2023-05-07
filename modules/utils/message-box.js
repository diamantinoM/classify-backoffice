export async function showErrorMessage(
  msg = "Algo está errado! Reinicie a aplicação."
) {
  return await window.versions.dialog({
    type: "error",
    message: msg,
    buttons: ["Continuar"],
    title: "Classify",
    icon: "./renderer/images/classify-logo.png",
    detail:
      "Em caso deste erro persistir, entre em contato com o administrador.",
  });
}

export async function showMessage(type, msg, btns, title, options) {
  return await window.versions.dialog({
    type: type,
    message: msg,
    buttons: btns,
    title: `Classify | ${title}`,
    icon: "./renderer/images/classify-logo.png",
    ...options,
  });
}
