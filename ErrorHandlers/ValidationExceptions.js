class ValidationError extends Error{
    constructor(messege) {
        super(messege);
        this.name = 'VALIDATION_ERROR'
        this.messege = messege
    }
    
}

export default ValidationError