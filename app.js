class FormValidator {

    form;

    fields;
    messages;

    constructor(form) {
        if (!form)
            throw "Argument cannot be null"
        this.form = form;
    }

    validate(options) {

        this.fields = options.fields;

        this.messages = options.messages;

        if (!this.fieldsAreValid())
            throw "Ilegal fields";

        var formIsValid = true;

        for (const field in this.fields) {

            let el = this.element(field);

            let validators = this.fields[field];

            for (const key in validators) {

                let result = this._hooks[key].call(null, el.value, validators[key]);

                if (result) {

                    this.deleteErrorMessage(field);

                } else {

                    let message = this.messages[field][key];

                    formIsValid = false;

                    this.showErrorMessage(field, message);

                    break;
                }

            }

        }

        return formIsValid;

    }

    showErrorMessage(field, message) {
        var errorEl = document.querySelector('.' + field + '-error');
        var container = document.getElementsByName(field)[0].parentElement;
        if (errorEl != null) {
            errorEl.innerHTML = message;
        } else {
            errorEl = document.createElement('div');
            errorEl.className = field + '-error error';
            errorEl.innerHTML = message;
            container.append(errorEl);
        }
    }

    deleteErrorMessage(field) {
        var errorEl = document.querySelector('.' + field + '-error');
        if (errorEl) {
            errorEl.innerHTML = "";
        }
    }

    fieldsAreValid() {
        for (const key in this.fields) {
            if (!this.controlNames.includes(key)) {
                return false;
            }
        }
        return true;
    }

    get controlNames() {
        return this.elements.map(el => el.name);
    }

    element(name) {
        return this.elements.find(el => el.name == name);
    }

    get elements() {
        let elements = form.elements;
        elements = Array.from(elements)
            .filter(element => element.tagName !== 'BUTTON');
        return elements;
    }

    _hooks = {
        required: function (value, param) {
            if (param) {
                return value !== "" && value.length > 0;
            }
            return true;
        },
        maxLength: function (value, param) {
            return value.length <= param;
        },
        minLength: function (value, param) {
            return value.length >= param;
        },
        min: function (value, param) {
            return value >= param;
        },
        max: function (value, param) {
            return value <= param;
        },
        pattern: function (value, param) {
            let re = new RegExp(param);
            return re.test(value);
        }
    }

}

var options = {
    fields: {
        name: {
            required: true,
            maxLength: 20,
            minLength: 3,
            pattern: "^[a-zA-Z]+$"
        },
        lastname: {
            required: true
        },
        age: {
            required: true,
            min: 18,
            max: 70
        }
    },
    messages: {
        name: {
            required: "El nombre es requerido",
            maxLength: "El máximo de caractéres es 20",
            minLength: "Debe haber un mínimo de 3 caracteres",
            pattern: "Solo debe ingresar caracteres"
        },
        lastname: {
            required: "El apellido es requirido"
        },
        age: {
            required: "La edad es requerida",
            min: "El minimo es 18",
            max: "El máximo es 70"
        }
    }
}

var form = document.getElementById('form');

var formValidator = new FormValidator(form);

form.addEventListener('submit', function (e) {
    e.preventDefault();
    var isValid = formValidator.validate(options);
    if (isValid) {
        console.log("Formulario enviado");
    }
});

form.addEventListener('input', function (e) {
    formValidator.validate(options);
});