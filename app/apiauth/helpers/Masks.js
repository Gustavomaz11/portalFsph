export const setMaskCep =(cep)=> {

  if (!cep) return cep
  
  cep = cep.replace(/\D/g,'');

  cep = cep.replace(/(\d{5})(\d)/,'$1-$2');

  return cep

};

export const setMaskCpf = (cpf) => {
  
  var cpf = cpf.replace(/[^\d]/g, ''); //remove todos os caracteres não numéricos
  
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
 
};

export const setMaskCell = (tel) => {

  if (!tel) return tel;
  tel = tel.replace(/\D/g,'')
  
  tel = tel.replace(/(\d{2})(\d)/,"($1) $2")
  tel = tel.replace(/(\d)(\d{4})$/,"$1-$2")
 
  return tel;

};

export const setMaskClear = (value) => {
  if (!value) return value;
  return value.replace(/\D/g,'')
};
