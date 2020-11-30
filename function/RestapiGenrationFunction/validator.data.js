module.exports={
    parse:`{{parse}}('{{variable}}')`,
    
    string:{
        default:`.isString().withMessage('Should be string')`,
        min:`.isLength({min:{{min}}}).withMessage('Value should be greater than {{min}}')`,
        max:`.isLength({max:{{max}}}).withMessage('Value should be less than {{max}}')`
    },
    int:{
        default:`.isNumeric().withMessage('should be numeric')`,
        min:`.isFloat({min:{{min}}}).withMessage('value should be greater than {{min}}')`,
        max:`.isFloat({max:{{max}}}).withMessage('value should be less than {{max}}')`
    },
    boolean:{
        default:`.isBoolean().withMessage('Value should be boolean')`
    },
    float:{
        default:`.isFloat().withMessage('should be float')`,
        min:`.isFloat({min:{{min}}}).withMessage('value should be greater than {{min}}')`,
        max:`.isFloat({max:{{max}}}).withMessage('value should be less than {{max}}')`
    },
    email:{
        default: `.isEmail().withMessage('email is not correct')`,
        min:`.isLength({min:{{min}}}).withMessage('Value should be greater than {{min}}')`,
        max:`.isLength({max:{{max}}}).withMessage('Value should be less than {{max}}')`
    },
    required:`.not().isEmpty().withMessage('Should not be empty')`,
    regex:`.custom((value) => {
        
        if (!{{regex}}.test(value)) {
          throw new Error('Invalid Value');
        }
        return true;
      })
    `

}