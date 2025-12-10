export const validarFuerzaPassword = (password) => {
    let puntaje = 0;
    
    // Longitud mínima
    if (password.length >= 8) puntaje += 1;
    if (password.length >= 12) puntaje += 1;
    
    // Contiene mayúsculas
    if (/[A-Z]/.test(password)) puntaje += 1;
    
    // Contiene minúsculas
    if (/[a-z]/.test(password)) puntaje += 1;
    
    // Contiene números
    if (/[0-9]/.test(password)) puntaje += 1;
    
    // Contiene caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) puntaje += 1;
    
    if (puntaje <= 2) return 'débil';
    if (puntaje <= 4) return 'intermedio';
    return 'fuerte';
};

export const validarRequisitosPassword = (password) => {
    const errores = [];
    
    if (password.length < 8) {
        errores.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
        errores.push('Debe contener al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
        errores.push('Debe contener al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
        errores.push('Debe contener al menos un número');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        errores.push('Debe contener al menos un carácter especial');
    }
    
    return errores;
};