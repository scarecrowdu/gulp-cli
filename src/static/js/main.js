// import 'babel-polyfill';
// import '../styles/main.scss';

function log(x, y = 'World') {
  console.log(`${x}, ${y}`);
  return { x, y };
}

log('Hello');
log('Hello', 'China');
log('Hello', '');
log('VINCENT', '');
