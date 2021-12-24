export const genFavicon = (col1, col2) => {
  let canvas = document.createElement('canvas');
  canvas.height = 144;
  canvas.width = 144;
  let ctxt = canvas.getContext('2d');

  let grad0 = ctxt.createLinearGradient(0, 144, 144, 0);
  grad0.addColorStop(0, 'rgba(' + col1 + ',1.0)');
  grad0.addColorStop(0.66666, 'rgba(' + col1 + ',0)');

  let grad1 = ctxt.createLinearGradient(0, 144, 144, 0);
  grad1.addColorStop(0.33333, 'rgba(' + col2 + ',0)');
  grad1.addColorStop(1, 'rgba(' + col2 + ',1.0)');

  ctxt.beginPath();
  ctxt.fillStyle = '#ffffff';
  ctxt.rect(0,0,144,144);
  ctxt.fill();

  ctxt.beginPath();
  ctxt.fillStyle = grad0;
  ctxt.rect(12,12,120,120);
  ctxt.fill();

  ctxt.beginPath();
  ctxt.fillStyle = grad1;
  ctxt.rect(12,12,120,120);
  ctxt.fill();

  ctxt.beginPath();
  ctxt.fillStyle = '#ffffff';
  ctxt.font = 'Italic 900 144px "roboto mono"';
  ctxt.fillText('i', 15, 120);

  ctxt.beginPath();
  ctxt.fillText('.', 70, 120);

  return canvas.toDataURL('image/png');
}
