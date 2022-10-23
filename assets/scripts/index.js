var Contacts = {
	index: window.localStorage.getItem("Contacts:index"),
	$table: document.getElementById("contacts-table"),
	$form: document.getElementById("contacts-form"),
	$button_save: document.getElementById("contacts-op-save"),
	$button_discard: document.getElementById("contacts-op-discard"),

	init: function() {
		// initialize storage index
		if (!Contacts.index) {
			window.localStorage.setItem("Contacts:index", Contacts.index = 1);
		}

		// initialize form
		Contacts.$form.reset();
		Contacts.$button_discard.addEventListener("click", function(event) {
			Contacts.$form.reset();
			Contacts.$form.id_entry.value = 0;
		}, true);
		Contacts.$form.addEventListener("submit", function(event) {
			var entry = {
				id: parseInt(this.id_entry.value),
				name: this.name.value,
				phone_number: this.phone_number.value,
				email: this.email.value
			};
			if (entry.id == 0) { // add
				Contacts.storeAdd(entry);
				Contacts.tableAdd(entry);
			}
			else { // edit
				Contacts.storeEdit(entry);
				Contacts.tableEdit(entry);
			}

			this.reset();
			this.id_entry.value = 0;
			event.preventDefault();
		}, true);

		// initialize table
		if (window.localStorage.length - 1) {
			var contacts_list = [], i, key;
			for (i = 0; i < window.localStorage.length; i++) {
				key = window.localStorage.key(i);
				if (/Contacts:\d+/.test(key)) {
					contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}

			if (contacts_list.length) {
				contacts_list
					.sort(function(a, b) {
						return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
					})
					.forEach(Contacts.tableAdd);
			}
		}
		Contacts.$table.addEventListener("click", function(event) {
			var op = event.target.getAttribute("data-op");
			if (/edit|remove/.test(op)) {
				var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
				if (op == "edit") {
					Contacts.$form.name.value = entry.name;
					Contacts.$form.phone_number.value = entry.phone_number;
					Contacts.$form.email.value = entry.email;
					Contacts.$form.id_entry.value = entry.id;
				}
				else if (op == "remove") {
					if (confirm('Are you sure you want to remove "'+ entry.name +' '+ entry.phone_number +'" from your contacts?')) {
						Contacts.storeRemove(entry);
						Contacts.tableRemove(entry);
					}
				}
				event.preventDefault();
			}
		}, true);
	},

	storeAdd: function(entry) {
		entry.id = Contacts.index;
		window.localStorage.setItem("Contacts:index", ++Contacts.index);
		window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
	},
	storeEdit: function(entry) {
		window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
	},
	storeRemove: function(entry) {
		window.localStorage.removeItem("Contacts:"+ entry.id);
	},

	tableAdd: function(entry) {
		var $tr = document.createElement("tr"), $td, key;
		for (key in entry) {
			if (entry.hasOwnProperty(key)) {
				$td = document.createElement("td");
				$td.appendChild(document.createTextNode(entry[key]));
				$tr.appendChild($td);
			}
		}
		$td = document.createElement("td");
		$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
		$tr.appendChild($td);
		$tr.setAttribute("id", "entry-"+ entry.id);
		Contacts.$table.appendChild($tr);
	},
	tableEdit: function(entry) {
		var $tr = document.getElementById("entry-"+ entry.id), $td, key;
		$tr.innerHTML = "";
		for (key in entry) {
			if (entry.hasOwnProperty(key)) {
				$td = document.createElement("td");
				$td.appendChild(document.createTextNode(entry[key]));
				$tr.appendChild($td);
			}
		}
		$td = document.createElement("td");
		$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
		$tr.appendChild($td);
	},
	tableRemove: function(entry) {
		Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
	}
};
Contacts.init();