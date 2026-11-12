//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
};
//#endregion
//#region src/element.ts
function r(e = "div", t = {}, ...n) {
	let r = document.createElement(e);
	for (let e in t) e in r ? r[e] = t[e] : typeof t[e] == "boolean" ? r.toggleAttribute(e, t[e]) : r.setAttribute(e, t[e]);
	return r.append(...n), r;
}
function i(e, t) {
	for (let n in t) e.style[n] = t[n];
}
function a(e) {
	return document.createTextNode(e);
}
function o(e, ...t) {
	return r("div", { className: e }, ...t);
}
//#endregion
//#region src/value.ts
function s(e, t = "Value") {
	let n = document.createElement("div");
	if (e || typeof e == "boolean" || e === 0) switch (n.className = "sp-value", typeof e) {
		case "string":
			n.innerHTML = e;
			break;
		case "number":
			n.innerHTML = `${e}`;
			break;
		case "boolean":
			n.className = "";
			let t = document.createElement("label");
			t.className = "toggle";
			let r = document.createElement("input");
			r.type = "checkbox", e && r.setAttribute("checked", ""), t.appendChild(r);
			let i = document.createElement("span");
			i.className = "toggle-icon", t.appendChild(i), n.appendChild(t);
			break;
		case "object":
			d(n, e);
			break;
		default: n.innerText = "[Unsupported Value]";
	}
	else t && (n.className = "sp-placeholder-value", n.innerHTML = t);
	return n;
}
function c(e, t = "Value") {
	let n = s(e, t);
	return n.classList.add("sp-value", "sp-unstyled-value"), n;
}
function l(e) {
	let t = "";
	if (e && arguments.length) {
		let n = "", r = "";
		for (let t of e) switch (t.PropertyName && (n = t.PropertyName), t.Type) {
			case "WFDictionaryValueVariableAggrandizement":
				n = t.DictionaryKey;
				break;
			case "WFCoercionVariableAggrandizement":
				r = qt[t.CoercionItemClass];
				break;
		}
		n.length && (t += ` (${n})`), r.length && (t += ` (${r})`);
	}
	return t;
}
function u(e) {
	let t = e.match(/{(\d+), (\d+)}/);
	return t && t.length ? Number(t[1]) : 0;
}
function d(e, t) {
	if (!t) {
		e.innerText = "";
		return;
	}
	let n, r, i, a, o = [];
	if (t.Value) {
		if (t.Value.attachmentsByRange) {
			let n = f(String(t.Value.string)).replaceAll("&#xA;", "<br/>"), r = Object.keys(t.Value.attachmentsByRange).sort((e, t) => u(e) - u(t));
			for (let e of r) {
				let r = t.Value.attachmentsByRange[e], i = r.OutputName ?? r.Variable ?? r.VariableName ?? r.PropertyName, a = h(r.Aggrandizements, i, r.Type, r.OutputUUID);
				n = n.replace("￼", a.outerHTML);
			}
			e.innerHTML = n;
			return;
		}
		if (t.Value.string) {
			e.innerHTML = t.Value.string;
			return;
		}
		if (n = t.Value.VariableName ?? t.Value.OutputName ?? t.Value.PropertyName, r = t.Value.Type, i = t.Value.OutputUUID ?? t.Value.UUID, a = t.Value?.Prompt, t.Value.Aggrandizements && (o = t.Value.Aggrandizements), t.Value.Value && t.Value.Value.WFDictionaryFieldValueItems) {
			e.appendChild(dn(t.Value.Value.WFDictionaryFieldValueItems));
			return;
		}
	} else if (t.Variable) {
		let e = t.Variable.Value;
		n = e.VariableName ?? e.OutputName ?? e.PropertyName, r = e.Type, i = e.OutputUUID, t.Variable.Value.Aggrandizements && (o = t.Variable.Value.Aggrandizements);
	} else if (t.workflowName) {
		e.innerText = t.workflowName;
		return;
	} else {
		e.innerText = "[Unsupported Object]";
		return;
	}
	!n && r === "ExtensionInput" && (n = "Shortcut Input"), e.appendChild(h(o, n, r, i, a));
}
function f(e) {
	return e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function p(e) {
	let t = "f_cursive";
	switch (e !== "Variable" && (t = "globe"), e) {
		case "DeviceDetails": return "desktopcomputer";
		case "ExtensionInput": return "layers_fill";
		case "Ask": return "text_bubble";
		case "Clipboard": return "doc_on_clipboard";
		case "CurrentDate": return "calendar";
		default: return t;
	}
}
var m = [
	"DeviceDetails",
	"ExtensionInput",
	"CurrentDate",
	"Ask",
	"Clipboard"
];
function h(e, t, n, i, a) {
	let o = "f_cursive";
	switch (t) {
		case "ShortcutInput":
			t = "Shortcut Input";
			break;
		case "DeviceDetails":
			t = "Device Details";
			break;
		case "CurrentDate":
			t = "Current Date";
			break;
		case "Ask": t = "Ask Each Time";
	}
	let s = r("a", { className: "sp-variable-value external" });
	i ? s.setAttribute("href", `#action-${i}`) : n === "ExtensionInput" && s.setAttribute("href", "#shortcut-input");
	let c = r("div", { className: "sp-action-icon sp-variable-icon" });
	if (n) {
		switch (n) {
			case "DeviceDetails":
				t = "Device Details";
				break;
			case "ActionOutput":
				if (o = "wand_stars", i) {
					let e = Ft(i);
					e?.icon && (o = e.icon), e?.background && (c.style.backgroundColor = e?.background, c.style.color = "white");
				}
				break;
			case "ExtensionInput":
				t = "Shortcut Input";
				break;
			case "CurrentDate":
				t = "Current Date";
				break;
			default: t ||= n;
		}
		m.includes(n) && (o = p(n));
	}
	return c.appendChild(hn(o)), o && c.classList.add(o), a && (t += `: "${a}"`), e && (t += l(e)), s.append(c, r("div", { innerText: t })), s;
}
var g = 2, _ = 1;
function v(e, t) {
	let n;
	switch (t) {
		case g:
			n = "link.contentkit.emailaddress";
			break;
		case _:
			n = "link.contentkit.phonenumber";
			break;
	}
	return s(e[n]);
}
function y(e = 0) {
	return `${Math.floor(e * 100)}%`;
}
function b(e) {
	return e.charAt(0).toUpperCase() + e.substring(1);
}
//#endregion
//#region src/colors.ts
var x = {
	Red: "#ff3b2f",
	Yellow: "#ffc200",
	Orange: "#fc880f",
	Green: "#27cd41",
	Blue: "#007aff",
	LightBlue: "#55bef0",
	Purple: "#5e5ce6",
	Gray: "#8e8e93"
}, S = {
	title: "Text",
	background: x.Yellow,
	icon: "icon-text_alignleft",
	render: (e, t) => {
		let n = document.createElement("div"), r = B(R.gettext);
		n.appendChild(r);
		let i = document.createElement("div");
		i.className = "sp-action-content";
		let a = document.createElement("div");
		return a.className = "sp-scrollable-action-content", a.appendChild(c(t.WFTextActionText, "Text")), i.appendChild(a), n.appendChild(i), n.appendChild(document.createElement("br")), n;
	}
}, C = {
	title: "Comment",
	icon: "icon-text_alignleft",
	color: "#ffbf00",
	background: "#fbf5e8",
	render: (e, t) => {
		e.classList.add("sp-comment-action");
		let n = document.createElement("div"), r = B(R.comment);
		n.appendChild(r);
		let i = document.createElement("div");
		i.className = "sp-action-content";
		let a = document.createElement("div");
		return i.appendChild(a), a.className = "sp-scrollable-action-content", a.innerText = t.WFCommentActionText ?? null, n.appendChild(i), n.appendChild(document.createElement("br")), n;
	}
}, w = {
	title: "Set variable",
	icon: "f_cursive",
	background: x.Orange,
	render: (e, t) => B(R.setvariable, s(t.WFVariableName, "Variable Name"), z("to"), s(t.WFInput ?? null, "Input"))
}, T = {
	title: "Show alert",
	icon: "macwindow",
	background: x.Yellow,
	render: (e, t) => {
		let n = B(R.alert, s(t.WFAlertActionMessage, "Informational message"));
		return n.appendChild(Kt(R.alert, {
			Title: t.WFAlertActionTitle,
			"Show Cancel Button": t.WFAlertActionCancelButtonShown ?? !0
		})), n;
	}
}, E = {
	title: "Add",
	icon: "f_cursive",
	background: x.Orange,
	render: (e, t) => B(R.appendvariable, s(t.WFInput, "Input"), z("to"), s(t.WFVariableName, "Variable Name"))
}, D = {
	icon: "number",
	background: x.Gray,
	render: (e, t) => B(R.number, s(t.WFNumberActionNumber, "Number"))
}, O = {
	title: "Show",
	icon: "doc_text_search",
	background: x.Yellow,
	render: (e, t) => B(R.showresult, s(t.Text ?? null, "Result"))
}, k = {
	title: "List",
	background: x.Orange,
	icon: "list_bullet",
	render: (e, t) => {
		let n = r(), i = B(R.list);
		n.appendChild(i);
		let a = o("sp-action-list-content"), s = r("ul");
		if (t.WFItems.length !== 0) for (let e in t.WFItems) {
			let n = r("li"), i = t.WFItems[e];
			typeof i != "string" && (i = i.WFValue), n.appendChild(c(i, "List Item")), s.appendChild(n);
		}
		let l = t.WFItems.length, u = r("div", {
			className: "sp-action-list-footer",
			innerText: l + " item" + (l ? "s" : "")
		});
		return a.appendChild(s), a.appendChild(u), n.appendChild(a), n.appendChild(r("br")), n;
	}
}, A = { render: (e, t) => {
	let n = {
		icon: "arrow_2_circlepath_circle_fill",
		background: x.Gray
	}, r = [];
	return t.WFControlFlowMode === 0 ? (n.title = "Repeat with each item in", r.push(s(t.WFInput ?? null, "Items"))) : n.title = "End Repeat", B(n, ...r);
} }, j = { render: (e, t) => {
	let n = {
		icon: "arrow_2_squarepath",
		background: x.Gray
	}, r = [];
	return t.WFControlFlowMode === 0 ? (n.title = "Repeat", r.push(s(t.WFRepeatCount ?? null, "Times"), z("times"))) : n.title = "End Repeat", B(n, ...r);
} }, M;
(function(e) {
	e[e.None = -1] = "None", e[e.Any = 0] = "Any", e[e.All = 1] = "All";
})(M ||= {});
var N = {
	icon: "arrow_branch",
	background: x.Gray,
	render: (e, t) => {
		let n = [], i = [];
		switch (t.WFControlFlowMode) {
			case 2:
				R.conditional.title = "End If";
				break;
			case 1:
				R.conditional.title = "Otherwise";
				break;
			default: if (R.conditional.title = "If", t.WFConditions) {
				if (t.WFConditions.Value.WFActionParameterFilterPrefix !== M.None) {
					switch (t.WFConditions.Value.WFActionParameterFilterPrefix) {
						case M.Any:
							n.push(s("Any"));
							break;
						case M.All:
							n.push(s("All"));
							break;
					}
					n.push(z("are true"));
				}
				if (t.WFConditions.Value.WFActionParameterFilterTemplates) if (t.WFConditions.Value.WFActionParameterFilterTemplates.length === 1) n.push(...P(t.WFConditions.Value.WFActionParameterFilterTemplates[0]));
				else for (let e of t.WFConditions.Value.WFActionParameterFilterTemplates) i.push(o("sp-condition", Bt(...P(e))));
			} else n.push(...P(t));
		}
		let a = r("div", {}, B(R.conditional, ...n));
		return i.length !== 0 && a.append(Ht(...i)), a;
	}
};
function P(e) {
	let t = [];
	t.push(s(e.WFInput ?? null, "Input"));
	let n;
	switch (e.WFCondition) {
		case 4:
			n = "is";
			break;
		case 5:
			n = "is not";
			break;
		case 100:
			n = "has any value";
			break;
		case 101:
			n = "does not have any value";
			break;
		case 99:
			n = "contains";
			break;
		case 999:
			n = "does not contain";
			break;
		case 8:
			n = "begins with";
			break;
		case 9:
			n = "ends with";
			break;
		case 2:
			n = "greater than";
			break;
		case 3:
			n = "greater or equal to";
			break;
		case 0:
			n = "less than";
			break;
		case 1:
			n = "less or equal to";
			break;
		case 1003:
			n = "between";
			break;
	}
	return t.push(s(n, "Condition")), e.WFConditionalActionString && e.WFCondition !== 100 && e.WFCondition !== 101 && t.push(s(e.WFConditionalActionString, "Text")), e.WFNumberValue && t.push(s(e.WFNumberValue ?? null, "Number")), t;
}
//#endregion
//#region src/actions/nothing.ts
var F = {
	title: "Nothing",
	icon: "viewfinder",
	color: "black",
	background: "transparent",
	render: (e) => (e.className += " sp-nothing-action", B(R.nothing))
}, ee = {
	icon: "link",
	render: (e, t) => {
		e.className += " sp-blue-action";
		let n = [];
		return Array.isArray(t.WFURLActionURL) ? t.WFURLActionURL && t.WFURLActionURL.length !== 0 && t.WFURLActionURL.forEach((e) => {
			n.push(s(e, "URL"));
		}) : n.push(s(t.WFURLActionURL)), n.length || n.push(s(null, "URL")), B(R.url, ...n);
	}
}, te = {
	icon: "calendar",
	render: (e, t) => (e.className += " sp-date-action", B(R.date, s(t.WFDateActionMode == "Specified Date" ? t.WFDateActionDate : "Current Date", "Date")))
}, I = {
	title: "Count",
	icon: "sum",
	background: x.Gray,
	render: (e, t) => B(R.count, s(t.WFCountType, "Type"), z("in"), s(t.Input ?? null, "Input"))
}, L = {
	icon: "square_list",
	background: x.LightBlue,
	render: (e, t) => {
		let n;
		if (t.WFControlFlowMode == 0) {
			n = B(R.choosefrommenu, z("Choose from menu with"), s(t.WFMenuPrompt ?? null, "Prompt"));
			let e = o("sp-action-list-content sp-unstyled-value"), i = r("ul");
			if (t.WFMenuItems.length !== 0) for (let e in t.WFMenuItems) {
				let n = r("li"), a = c(t.WFMenuItems[e].WFValue ?? t.WFMenuItems[e], "Menu Item");
				n.appendChild(a), i.appendChild(n);
			}
			let a = t.WFMenuItems.length, l = r("div", {
				className: "sp-action-list-footer",
				innerText: a + " item" + (a ? "s" : "")
			});
			e.appendChild(i), e.appendChild(l), n.appendChild(e), n.appendChild(r("br"));
		} else {
			let e = [];
			if (t.WFControlFlowMode == 2) e.push(z("End Menu"));
			else if (t.WFControlFlowMode == 1) {
				let n = c(t.WFMenuItemTitle ?? t.WFMenuItemAttributedTitle ?? null, "Item");
				n.setAttribute("style", "font-weight: bold"), e.push(n);
			}
			n = B(R.choosefrommenu, ...e);
		}
		return n;
	}
}, ne = {
	icon: "plus_slash_minus",
	background: x.Gray,
	render: (e, t) => B(R.math, s(t.WFInput, "Number"), s(t.WFMathOperation ?? "+", "Operation"), s(t.WFMathOperand, "Number"))
}, re = {
	title: "Stop this shortcut",
	icon: "stop_fill",
	background: x.Gray
}, ie = {
	title: "Wait",
	icon: "hourglass",
	background: x.Gray,
	render: (e, t) => {
		let n;
		return n = typeof t.WFDelayTime == "number" ? s(t.WFDelayTime + " second" + (t.WFDelayTime === 1 ? "" : "s"), "1 second") : s(t.WFDelayTime), B(R.delay, n);
	}
}, ae = {
	title: "Choose from",
	icon: "square_list_fill",
	background: x.LightBlue,
	render: (e, t) => {
		let n = B(R.choosefromlist, s(t.WFInput, "List"));
		return n.appendChild(Kt(R.choosefromlist, {
			Prompt: t.WFChooseFromListActionPrompt,
			"Select Multiple": t.WFChooseFromListActionSelectMultiple ?? !1,
			"Select All Initially": t.WFChooseFromListActionSelectMultiple ?? !1
		})), n;
	}
}, oe = {
	title: "Combine",
	background: x.Yellow,
	icon: "icon-text_alignleft",
	render: (e, t) => B(R["text.combine"], s(t.text, "Text List"), z("with"), s(t.WFTextSeparator ?? null, "Separator"), s(t.WFTextCustomSeparator ?? null, "CustomSeparator"))
}, se = {
	title: "Ask for",
	icon: "plus_bubble_fill",
	background: x.LightBlue,
	render: (e, t) => {
		let n = B(R.ask, s(t.WFInputType ?? "Text"), z("with"), s(t.WFAskActionPrompt, "Informational message"));
		return n.appendChild(Kt(R.ask, { "Default Answer": t.WFAskActionDefaultAnswer ?? t.WFAskActionDefaultAnswerNumber })), n;
	}
}, ce = {
	title: "Split",
	background: x.Yellow,
	icon: "icon-text_alignleft",
	render: (e, t) => {
		let n = [
			s(t.text, "Text List"),
			z("by"),
			s(t.WFTextSeparator ?? "New Lines", "Separator")
		];
		return t.WFTextSeparator === "Custom" && n.push(s(t.WFTextCustomSeparator, "Custom Separator")), B(R["text.split"], ...n);
	}
}, le = {
	title: "Get",
	background: x.Orange,
	icon: "list_bullet",
	render: (e, t) => {
		let n = [];
		switch (t.WFItemSpecifier) {
			case "Items in Range":
				n = [
					s(t.WFItemRangeStart ?? 0),
					a("to"),
					s(t.WFItemRangeEnd ?? 0)
				];
				break;
			case "Item At Index": n = [s(t.WFItemIndex ?? 0)];
		}
		return B(R.getitemfromlist, s(t.WFItemSpecifier, "Item Specifier"), ...n, z("from"), s(t.WFInput ?? null, "Input"));
	}
}, ue = {
	title: "Set name",
	icon: "text_cursor",
	background: x.Gray,
	render: (e, t) => {
		let n = B(R.setitemname, s(t.WFInput, "Input"), z("to"), s(t.WFName, "Name"));
		return n.appendChild(Kt(R.setitemname, { "Don't Include File Extension": t.WFDontIncludeFileExtension ?? !1 })), n;
	}
}, de = {
	title: "Stop and output",
	icon: "square_arrow_left",
	background: x.Blue,
	render: (e, t) => {
		e.classList.add("sp-output-action");
		let n = B(R.output, s(t.WFOutput, "Output"));
		return n.appendChild(_n(t.WFNoOutputSurfaceBehavior, t.WFResponse)), n;
	}
}, fe = {
	title: "Copy",
	icon: "doc_on_doc_fill",
	render: (e, t) => {
		e.className += " sp-blue-action";
		let n = B(R.setclipboard, s(t.WFInput, "Content"), z("to clipboard"));
		return n.appendChild(Kt(R.setclipboard, {
			"Local Only": t.WFLocalOnly ?? !1,
			"Expire At": t.WFExpirationDate
		})), n;
	}
}, pe = {
	title: "Run",
	icon: "",
	render: (e, t) => {
		let n = t.WFWorkflowName ?? t.WFWorkflow.workflowName;
		e.classList.add("sp-shortcut-action");
		let r = B(R.runworkflow, s(n, "Shortcut"));
		return r.appendChild(Kt(R.runworkflow, { Input: t.WFInput })), r;
	}
}, me = {
	title: "Calculate expression",
	icon: "f_cursive_circle",
	background: x.Gray,
	render: (e, t) => B(R.calculateexpression, s(t.Input, "7 + 7"))
}, he = {
	title: "Dictionary",
	background: x.Orange,
	icon: "book_fill",
	render: (e, t) => {
		let n = document.createElement("div"), i = B(R.dictionary);
		return n.append(i, o("table-container", dn(t.WFItems.Value.WFDictionaryFieldValueItems)), r("br")), n;
	}
}, ge = {
	title: "Get dictionary from",
	background: x.Orange,
	icon: "book_fill",
	render: (e, t) => B(R["detect.dictionary"], s(t.WFInput, "Input"))
}, _e = {
	title: "Get",
	background: x.Orange,
	icon: "book_fill",
	render: (e, t) => {
		let n = [s(t.WFGetDictionaryValueType ?? "Value")];
		return t.WFDictionaryKey && n.push(z("for"), s(t.WFDictionaryKey, "Key")), n.push(z("in"), s(t.WFInput, "Dictionary")), B(R.getvalueforkey, ...n);
	}
}, ve = {
	title: "Set",
	background: x.Orange,
	icon: "book_fill",
	render: (e, t) => B(R.setvalueforkey, s(t.WFDictionaryKey, "Key"), z("to"), s(t.WFDictionaryValue, "Value"), z("in"), s(t.WFDictionary, "Dictionary"))
}, ye = {
	title: "Get current IP address",
	background: x.Blue,
	icon: "globe",
	render: (e, t) => {
		let n = B(R.getipaddress);
		return n.appendChild(Kt(R.getipaddress, {
			Address: t.WFIPAddressSourceOption ?? "IPv4",
			Type: t.WFIPAddressTypeOption ?? "External"
		})), n;
	}
}, be = {
	title: "Get file from",
	icon: "folder_fill",
	render: (e, t) => {
		e.className += " sp-blue-action";
		let n = B(R["documentpicker.open"], s(t.WFFile ?? "Shortcuts"), z("at path"), s(t.WFGetFilePath, "example.txt"));
		return n.appendChild(Kt(R["documentpicker.open"], { "Error If Not Found": t.WFFileErrorIfNotFound })), n;
	}
}, xe = {
	title: "Get type of",
	icon: "question_diamond_fill",
	background: x.Gray,
	render: (e, t) => B(R.getitemtype, s(t.WFInput, "Input"))
}, Se = {
	title: "Get numbers from",
	icon: "number_circle_fill",
	background: x.Gray,
	render: (e, t) => B(R["detect.number"], s(t.WFInput ?? null, "Input"))
}, Ce = {
	title: "Email Address",
	icon: "envelope_fill",
	background: x.LightBlue,
	render: (e, t) => {
		let n = [];
		if (t.WFEmailAddress.Value.WFContactFieldValues !== void 0) for (let e of t.WFEmailAddress.Value.WFContactFieldValues) n.push(v(e.SerializedEntry, e.EntryType));
		else n.push(s(t.WFEmailAddress));
		return B(R.email, ...n);
	}
}, we = {
	title: "Phone Number",
	icon: "phone_fill",
	background: x.Green,
	render: (e, t) => {
		let n = [];
		if (t.WFPhoneNumber.Value.WFContactFieldValues !== void 0) for (let e of t.WFPhoneNumber.Value.WFContactFieldValues) n.push(v(e.SerializedEntry, e.EntryType));
		else n.push(s(t.WFPhoneNumber));
		return B(R.phonenumber, ...n);
	}
}, Te = {
	title: "URL",
	icon: "link",
	render: (e, t) => (e.className += " sp-blue-action", B(R.urlencode, s(t.WFEncodeMode ?? "Encode"), s(t.WFInput)))
}, Ee;
(function(e) {
	e.JSON = "JSON", e.Form = "Form", e.File = "File";
})(Ee ||= {});
var De = {
	title: "Get contents of",
	icon: "square_arrow_down",
	background: x.Green,
	render: (e, t) => {
		let n = document.createElement("div"), i = B(R.downloadurl, s(t.WFURL));
		if (n.appendChild(i), t.WFHTTPMethod && n.appendChild(mn("Method", s(t.WFHTTPMethod ?? "GET"))), t.WFHTTPHeaders) {
			let e = document.createElement("div");
			e.style.textAlign = "left", e.style.marginLeft = "2.5rem", e.innerText = "Headers:", n.append(e, r("br"), o("table-container", dn(t.WFHTTPHeaders.Value.WFDictionaryFieldValueItems)));
		}
		return t.WFHTTPMethod && t.WFHTTPMethod !== "GET" && t.WFHTTPBodyType && n.append(r("br"), mn("Request Body", s(t.WFHTTPBodyType ?? "JSON")), r("br")), t.WFFormValues && n.appendChild(o("table-container", dn(t.WFFormValues.Value.WFDictionaryFieldValueItems))), t.WFJSONValues && n.appendChild(o("table-container", dn(t.WFJSONValues.Value.WFDictionaryFieldValueItems))), t.WFRequestVariable && n.appendChild(mn("File", s(t.WFRequestVariable, "Variable"))), (t.WFHTTPMethod || t.WFHTTPBodyType || t.WFHTTPHeaders) && n.appendChild(r("br")), n;
	}
}, Oe = {
	title: "Save",
	icon: "",
	render: (e, t) => (e.classList.add("sp-photos-action"), B(R.savetocameraroll, s(t.WFInput), z("To"), s(t.WFCameraRollSelectedGroup ?? "Recents")))
}, ke = {
	title: "Open",
	icon: "arrow_up_right_square_fill",
	render: (e, t) => (e.classList.add("sp-blue-action"), B(R.openurl, s(t.WFInput)))
}, Ae = {
	title: "Show",
	icon: "eye_fill",
	background: x.Yellow,
	render: (e, t) => B(R.previewdocument, s(t.WFInput ?? null, "Input"), z("in Quick Look"))
}, je = {
	title: "Show webpage at",
	icon: "",
	render: (e, t) => (e.classList.add("sp-safari-action"), B(R.showwebpage, s(t.WFURL ?? null, "URL")))
};
//#endregion
//#region src/actions/file.ts
function Me(e) {
	return [
		s(e.fileLocation.WFFileLocationType),
		z("/"),
		s(e.fileLocation.relativeSubpath)
	];
}
var Ne = {
	icon: "doc_fill",
	render: (e, t) => (e.classList.add("sp-blue-action"), B(R.file, ...Me(t.WFFile)))
}, Pe = {
	title: "Save",
	icon: "arrow_down_doc_fill",
	render: (e, t) => {
		e.classList.add("sp-blue-action");
		let n = [s(t.WFInput)];
		t.WFFolder && t.WFFolder.displayName && n.push(z("to"), s(t.WFFolder.displayName));
		let r = B(R["documentpicker.save"], ...n);
		return r.appendChild(Kt(R["documentpicker.save"], {
			"Ask Where to Save": t.WFAskWhereToSave ?? !0,
			Subpath: t.WFFileDestinationPath,
			"Overwrite If File Exists": t.WFSaveFileOverwrite ?? !1
		})), r;
	}
}, Fe = {
	title: "Get shortcuts from",
	icon: "",
	render: (e, t) => (e.classList.add("sp-shortcut-action"), B(R.getmyworkflows, s("All Shortcuts")))
}, Ie = {
	title: "Create folder in",
	icon: "folder_fill_badge_plus",
	render: (e, t) => (e.className += " sp-blue-action", B(R["file.createfolder"], s("Shortcuts"), z("at"), s(t.WFFilePath)))
}, Le = {
	title: "Get",
	icon: "f_cursive",
	background: x.Orange,
	render: (e, t) => B(R.getvariable, s(t.WFVariable))
}, Re = {
	title: "Get the",
	background: x.Blue,
	icon: "desktopcomputer",
	render(e, t) {
		return B(R.getdevicedetails, s(t.WFDeviceDetail));
	}
}, ze = {
	title: "Set Volume to",
	icon: "speaker_3_fill",
	background: x.Red,
	render: function(e, t) {
		let n = t.WFVolume;
		return typeof n == "number" && (n = y(t.WFVolume)), B(R.setvolume, s(n));
	}
}, Be = {
	title: "Set Brightness to",
	background: x.Red,
	icon: "sun_max_fill",
	render(e, t) {
		let n = t.WFBrightness;
		return typeof n == "number" && (n = y(t.WFBrightness)), B(R.setbrightness, s(n));
	}
}, Ve = {
	icon: "airplane",
	background: x.Orange,
	render(e, t) {
		return Qe(R["airplanemode.set"], "Airplane Mode", t);
	}
}, He = {
	icon: "antenna_radiowaves_left_right",
	background: x.Green,
	render(e, t) {
		return Qe(R["cellulardata.set"], "Cellular Data", t);
	}
}, Ue = {
	icon: "wifi",
	background: x.Blue,
	render(e, t) {
		return Qe(R["wifi.set"], "Wi-Fi", t);
	}
}, We = {
	icon: "",
	background: x.Blue,
	render(e, t) {
		return e.classList.add("sp-bluetooth-action"), Qe(R["bluetooth.set"], "Bluetooth", t);
	}
}, Ge = {
	icon: "battery_25",
	background: x.Yellow,
	render(e, t) {
		return Qe(R["lowpowermode.set"], "Low Power Mode", t);
	}
}, Ke = {
	title: "Show notification",
	icon: "bell_fill",
	background: x.Red,
	render(e, t) {
		let n = B(R.notification, s(t.WFNotificationActionBody, "Content"));
		return n.appendChild(Kt(R.notification, {
			Title: t.WFNotificationActionTitle,
			"Play Sound": t.WFNotificationActionSound ?? !0,
			Attachment: t.WFInput
		})), n;
	}
}, qe = {
	icon: "circle_lefthalf_fill",
	background: x.Blue,
	render(e, t) {
		return B(R.appearance, s(b(String(t.operation ?? "turn"))), z("appearance"), s(b(String(t.style ?? "dark"))));
	}
}, Je = {
	title: "Open",
	icon: "arrow_up_right",
	background: x.Purple,
	render(e, t) {
		return B(R.openapp, s(t.WFAppIdentifier));
	}
}, Ye = {
	title: "Delete",
	icon: "trash_fill",
	render(e, t) {
		e.classList.add("sp-blue-action");
		let n = B(R["file.delete"], s(t.WFInput, "Files"));
		return n.appendChild(Kt(R["file.delete"], { "Delete Immediately": t.WFDeleteFileConfirmDeletion ?? !1 })), n;
	}
}, Xe = {
	ar_AE: "Arabic",
	zh_CN: "Mandarin Chinese (Mainland)",
	zh_TW: "Mandarin Chinese (Taiwan)",
	nl_NL: "Dutch",
	en_GB: "English (UK)",
	en_US: "English (US)",
	fr_FR: "French",
	de_DE: "German",
	id_ID: "Indonesian",
	it_IT: "Italian",
	jp_JP: "Japanese",
	ko_KR: "Korean",
	pl_PL: "Polish",
	pt_BR: "Portuguese (Brazil)",
	ru_RU: "Russian",
	es_ES: "Spanish (Spain)",
	th_TH: "Thai",
	tr_TR: "Turkish",
	vn_VN: "Vietnamese"
};
function Ze(e) {
	return typeof e == "object" ? e : Xe[e] ?? e;
}
//#endregion
//#region src/actions.ts
var R = {
	gettext: S,
	downloadurl: De,
	ask: se,
	"text.combine": oe,
	"text.split": ce,
	getitemfromlist: le,
	comment: C,
	setvariable: w,
	appendvariable: E,
	number: D,
	alert: T,
	showresult: O,
	list: k,
	nothing: F,
	url: ee,
	date: te,
	count: I,
	choosefrommenu: L,
	choosefromlist: ae,
	conditional: N,
	"repeat.count": j,
	"repeat.each": A,
	math: ne,
	delay: ie,
	exit: re,
	setitemname: ue,
	output: de,
	setclipboard: fe,
	runworkflow: pe,
	calculateexpression: me,
	dictionary: he,
	"detect.dictionary": ge,
	getvalueforkey: _e,
	setvalueforkey: ve,
	getipaddress: ye,
	"documentpicker.open": be,
	getitemtype: xe,
	"detect.number": Se,
	email: Ce,
	phonenumber: we,
	urlencode: Te,
	savetocameraroll: Oe,
	openurl: ke,
	previewdocument: Ae,
	showwebpage: je,
	file: Ne,
	"documentpicker.save": Pe,
	getmyworkflows: Fe,
	"file.createfolder": Ie,
	getvariable: Le,
	getdevicedetails: Re,
	setvolume: ze,
	setbrightness: Be,
	"airplanemode.set": Ve,
	"cellulardata.set": He,
	"wifi.set": Ue,
	"bluetooth.set": We,
	"lowpowermode.set": Ge,
	notification: Ke,
	appearance: qe,
	openapp: Je,
	"file.delete": Ye,
	"text.translate": {
		title: "Translate",
		icon: "",
		render(e, t) {
			return e.classList.add("sp-translate-action"), B(R["text.translate"], s(t.WFInputText ?? "Text"), z("from"), s(Ze(t.WFSelectedFromLanguage ?? "Detected Language")), z("to"), s(Ze(t.WFSelectedLanguage ?? "System Language")));
		}
	},
	detectlanguage: {
		title: "Detect language of",
		icon: "",
		render(e, t) {
			return e.classList.add("sp-translate-action"), B(R.detectlanguage, s(t.WFInput));
		}
	},
	"text.replace": {
		title: "Replace",
		background: x.Yellow,
		icon: "icon-text_alignleft",
		render(e, t) {
			let n = B(R["text.replace"], s(t.WFReplaceTextFind), z("with"), s(t.WFReplaceTextReplace), z("in"), s(t.WFInput));
			return n.appendChild(Kt(R["text.replace"], {
				"Case Sensitive": t.WFReplaceTextCaseSensitive ?? !0,
				"Regular Expression": t.WFReplaceTextRegularExpression ?? !1
			})), n;
		}
	},
	base64encode: {
		icon: "hexagon_fill",
		render(e, t) {
			let n = B(R.base64encode, s(t.WFEncodeMode), s(t.WFInput), z("with base64"));
			return n.appendChild(Kt(R.base64encode, { "Line Breaks": t.WFBase64LineBreakMode })), n;
		}
	},
	getwebpagecontents: {
		title: "Get contents of webpage at",
		icon: "",
		render: (e, t) => (e.classList.add("sp-safari-action"), B(R.getwebpagecontents, s(t.WFInput ?? null, "URL")))
	},
	location: {
		icon: "map_pin",
		color: x.Green,
		render: (e, t) => {
			e.classList.add("sp-location-action");
			let n;
			return n = t.WFLocation?.isCurrentLocation ? "Current Location" : t.WFLocation, B(R.location, s(n, "Location"));
		}
	},
	"detect.text": {
		title: "Get text from",
		background: x.Yellow,
		icon: "icon-text_alignleft",
		render: (e, t) => B(R["detect.text"], s(t.WFInput, "Input"))
	},
	getbatterylevel: {
		title: "Get",
		background: x.Green,
		icon: "battery_100",
		render: (e, t) => B(R.getbatterylevel, s(t.Subject ?? "Battery Level", "Subject"))
	},
	"dnd.set": {
		background: x.Purple,
		icon: "moon_fill",
		render: (e, t) => {
			let n = [];
			if (t.Operation !== "Toggle" && (s(t.Enabled ? "On" : "Off", "Enabled"), t.Enabled && (n.push(z("until"), s(t.AssertionType ?? "Turned Off")), t.AssertionType))) switch (t.AssertionType === "Time" && n.push(s(t.Time)), t.AssertionType) {
				case "Time":
					n.push(s(t.Time));
					break;
				case "Event Ends":
					n.push(s(t.Event));
					break;
			}
			return B(R["dnd.set"], s(t.Operation ?? "Turn"), s(t.FocusModes.DisplayString ?? "Do Not Disturb"), ...n);
		}
	},
	"file.select": {
		title: "Select",
		icon: "doc_fill",
		render: (e, t) => {
			e.classList.add("sp-blue-action");
			let n = B(R["file.select"], s(t.WFPickingMode ?? "Files"));
			return n.appendChild(Kt(R["file.select"], { "Select Multiple": t.SelectMultiple ?? !1 })), n;
		}
	},
	selectphoto: {
		title: "Select photos",
		icon: "",
		render: (e, t) => {
			e.classList.add("sp-photos-action");
			let n = B(R.selectphoto);
			return n.appendChild(Kt(R.selectphoto, { "Select Multiple": t.SelectMultiple ?? !1 })), n;
		}
	},
	askllm: {
		title: "Use",
		icon: "",
		render: (e, t) => {
			e.classList.add("sp-intelligence-action");
			let n = document.createElement("div"), r = t.WFLLMModel;
			r && typeof r == "string" && (r = r.includes("Device") ? "On-Device" : r.replace("Apple Intelligence", "Cloud"));
			let i = B(R.askllm, s(r ?? "Cloud"), z("model"));
			n.appendChild(i);
			let a = document.createElement("div");
			a.className = "sp-action-content";
			let o = document.createElement("div");
			return o.className = "sp-scrollable-action-content", o.appendChild(c(t.WFLLMPrompt, "Text")), a.appendChild(o), n.appendChild(a), n.appendChild(Kt(R.askllm, {
				"Use Broad World Knowledge": t.WFAllowWebSearch ?? !1,
				Output: t.WFGenerativeResultType ?? "Automatic",
				"Follow Up": t.FollowUp ?? !1
			})), n;
		}
	},
	setstoredcontent: {
		title: "Store",
		icon: "floppy_disk",
		background: x.LightBlue,
		render: (e, t) => {
			let n = B(R.setstoredcontent, s(t.WFInput, "Content"), z("as"), s(t.WFStoredContentKey, "Key"));
			return n.appendChild(Kt(R.setstoredcontent, { "Global Value": t.WFStoredContentGlobalValue ?? !1 })), n;
		}
	},
	getstoredcontent: {
		title: "Get",
		icon: "floppy_disk",
		background: x.LightBlue,
		render: (e, t) => {
			let n = B(R.getstoredcontent, s(t.WFStoredContentKey, "Key"));
			return n.appendChild(Kt(R.getstoredcontent, { "Global Value": t.WFStoredContentGlobalValue ?? !1 })), n;
		}
	},
	deletestoredcontent: {
		title: "Delete",
		icon: "floppy_disk",
		background: x.LightBlue,
		render: (e, t) => {
			let n = B(R.deletestoredcontent, s(t.WFStoredContentKey, "Key"));
			return n.appendChild(Kt(R.deletestoredcontent, { "Global Value": t.WFStoredContentGlobalValue ?? !1 })), n;
		}
	}
};
function Qe(e, t, n) {
	let r = [s(b(String(n.operation ?? "Turn"))), z(t)];
	if (n.OnValue || n.state || !n.operation) {
		let e = n.OnValue ?? n.state ?? 1, t;
		switch (typeof e) {
			case "number":
				t = e === 1 ? "On" : "Off";
				break;
			case "boolean":
				t = e ? "On" : "Off";
				break;
			default: t = e;
		}
		r.push(s(t));
	}
	return B(e, ...r);
}
function z(e) {
	let t = document.createElement("div");
	return t.innerText = e, t.className = "sp-action-text", t;
}
var $e = [];
function et(e) {
	$e.includes(e) || ($e.length || console.warn("Missing formal definitions for the following actions.", "\n\nAutomatic rendering should allow you to still read the value of the action's parameters.\n\n**However, values unique to the action will likely not render properly.**"), console.warn(`Missing formal definition of ${e}.`), $e.push(e));
}
//#endregion
//#region src/automations/wifi.ts
var tt = {
	joined: "Joined",
	disconnected: "Disconnected",
	both: "Joined or Disconnected"
}, nt = {
	title: "When",
	icon: "wifi",
	color: x.Blue,
	background: "transparent",
	params: {
		WFNetworks: "Network",
		WFRunAfterConnectionInterruption: "Run After Connection Interruption"
	},
	render: (e, t) => vt(nt, t, ["WFConnectionType", "WFNetworks"], bt(t.WFNetworks, "Any Network"), z("is"), yt(tt, t.WFConnectionType, "joined"))
}, rt = {
	connect: "Connected",
	disconnect: "Disconnected",
	both: "Connected or Disconnected"
}, it = {
	title: "When",
	icon: "",
	color: x.Blue,
	background: "transparent",
	render: (e, t) => (e.classList.add("sp-bluetooth-action"), vt(it, t, ["WFBluetoothConnectionType", "WFSelectedDevices"], bt(t.WFSelectedDevices, "Any Device"), z("is"), yt(rt, t.WFBluetoothConnectionType, "connect")))
}, at = {
	connect: "Is Connected",
	disconnect: "Is Disconnected",
	both: "Is Connected or Disconnected"
}, ot = {
	title: "When display",
	icon: "tv",
	color: x.Blue,
	background: "transparent",
	render: (e, t) => vt(ot, t, ["WFConnectionType"], yt(at, t.WFConnectionType, "connect"))
}, st = {
	photos: "Photos",
	files: "Files",
	clipboard: "Clipboard"
};
function ct(e) {
	return !e || !e.length ? s(void 0, "Location") : s(e.map((e) => st[e] ?? e).join(", "));
}
var lt = {
	title: "When I save a screenshot to",
	icon: "camera_viewfinder",
	color: x.Blue,
	background: "transparent",
	render: (e, t) => vt(lt, t, ["ScreenshotLocations"], ct(t.ScreenshotLocations))
}, ut = 50, dt = {
	equals: "Equals",
	falls_below: "Falls Below",
	rises_above: "Rises Above"
}, ft = {
	title: "When battery level",
	icon: "battery_25",
	color: x.Gray,
	background: "transparent",
	render: (e, t) => {
		let n = Math.round(t.WFBatteryLevel ?? ut);
		return vt(ft, t, ["WFBatteryLevel", "WFBatteryLevelComparison"], yt(dt, t.WFBatteryLevelComparison, "equals"), s(`${n}%`));
	}
}, pt = {
	connect: "Connects",
	disconnect: "Disconnects",
	both: "Connects or Disconnects"
}, mt = {
	title: "When power",
	icon: "bolt_fill",
	color: x.Green,
	background: "transparent",
	render: (e, t) => vt(mt, t, ["WFConnectionType"], yt(pt, t.WFConnectionType, "connect"))
}, ht = {
	on: "Is Turned On",
	off: "Is Turned Off",
	both: "Is Turned On or Off"
}, gt = {
	title: "When Stage Manager",
	icon: "rectangle_3_offgrid_fill",
	color: x.Blue,
	background: "transparent",
	render: (e, t) => vt(gt, t, ["WFStageManagerType"], yt(ht, t.WFStageManagerType, "on"))
}, _t = {
	WFWifiTrigger: nt,
	WFBluetoothTrigger: it,
	WFExternalDisplayTrigger: ot,
	WFScreenshotTrigger: lt,
	WFBatteryLevelTrigger: ft,
	WFPlugInTrigger: mt,
	WFStageManagerTrigger: gt
};
function vt(e, t, n, ...r) {
	let i = B(e, ...r), a = {};
	for (let e of Object.keys(t)) n.includes(e) || (a[e] = t[e]);
	if (!Object.keys(a).length) return i;
	let o = document.createElement("div");
	return o.appendChild(i), o.appendChild(Kt(e, a)), o;
}
function yt(e, t, n) {
	let r = t ?? n;
	return s(e[r] ?? r);
}
function bt(e, t) {
	let n = (Array.isArray(e) ? e : [e]).filter((e) => e).map((e) => f(String(e)));
	return n.length ? s(n.join(", ")) : s(void 0, t);
}
function xt(e) {
	return e.replace(/^WF/, "").replace(/Trigger$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
}
var St = [];
function Ct(e) {
	St.includes(e) || (St.length || console.warn("Missing formal definitions for the following automations.", "\n\nAutomatic rendering should allow you to still read the value of the automation's parameters.\n\n**However, values unique to the automation will likely not render properly.**"), console.warn(`Missing formal definition of ${e}.`), St.push(e));
}
//#endregion
//#region src/render.ts
var wt, Tt = [], Et = 0, Dt, Ot = 0;
function kt(e) {
	Dt = e, Ot = 0, Dt.length;
	for (let e of Dt) {
		Ot++;
		let t = e.WFWorkflowActionIdentifier.replace("is.workflow.actions.", ""), n = e.WFWorkflowActionParameters?.WFControlFlowMode;
		(n === 2 || n == 1) && Mt(), Et === 0 && At(), wt.appendChild(It(t, e)), (n === 0 || n === 1) && jt();
	}
}
function At() {
	Tt = [], Tt.push(wt);
}
function jt() {
	let e = o("sp-sub-container");
	wt.appendChild(e), Tt[++Et] = e, wt = e;
}
function Mt() {
	Tt.length !== 1 && (wt = Tt[--Et]);
}
function Nt(e) {
	wt = e;
}
function Pt(e) {
	return o("card-content", Ut(e));
}
function Ft(e) {
	for (let t of Dt) {
		let n = t.WFWorkflowActionIdentifier.replace("is.workflow.actions.", "");
		if (!(!t.WFWorkflowActionParameters?.hasOwnProperty("UUID") || t.WFWorkflowActionParameters.UUID !== e || !R[n])) return R[n];
	}
	return null;
}
function It(e, t) {
	let n = document.createElement("div");
	n.className = "card", t.WFWorkflowActionParameters?.UUID && (n.id = `action-${t.WFWorkflowActionParameters.UUID}`), Rt(n, t);
	let r = null;
	if (R[e] && (r = R[e], r.title && (e = r.title)), r && r.render) return n.innerHTML = Pt(r.render(n, t.WFWorkflowActionParameters ?? [])).outerHTML, n;
	!r && t.WFWorkflowActionIdentifier && et(t.WFWorkflowActionIdentifier);
	let i = document.createElement("div"), a = r ? B(r) : Vt(zt("gear", "white", "darkgray"), e);
	return i.appendChild(a), t.WFWorkflowActionParameters && i.appendChild(Kt(r, t.WFWorkflowActionParameters)), n.appendChild(Pt(i)), n;
}
var Lt;
function Rt(e, t) {
	if (Lt && Lt.WFWorkflowActionParameters) {
		let n = [];
		for (let e in t.WFWorkflowActionParameters) {
			let r = t.WFWorkflowActionParameters[e];
			if (r.Value && r.Value.OutputUUID && n.push(r.Value.OutputUUID), r.Value && r.Value.attachmentsByRange) for (let e in r.Value.attachmentsByRange) n.push(r.Value.attachmentsByRange[e].OutputUUID);
		}
		if (n.length !== 0) for (let t in Lt.WFWorkflowActionParameters) {
			if (t !== "UUID") continue;
			let r = Lt.WFWorkflowActionParameters[t];
			n.includes(r) && e.classList.add("sp-linked-action");
		}
	}
	Lt = t;
}
function zt(e = "gear", t, n) {
	let r = document.createElement("div");
	r.className = "sp-action-icon", n && (r.style.backgroundColor = n), t && (r.style.color = t);
	let i = document.createElement("i");
	return i.className = "icon f7-icons", i.innerText = e, r.appendChild(i), r.outerHTML;
}
function B(e, ...t) {
	let n = zt(e.icon ?? "gear", e.color ?? "white", e.background ?? "darkgray"), r = document.createElement("div"), i = document.createElement("div");
	if (e.title && (i.className = "sp-action-title", i.innerHTML = e.title ?? ""), t) {
		let n = document.createElement("div");
		n.style.display = "flex", n.style.gap = "0.3rem 0.5rem", n.style.flexWrap = "wrap", e.title && n.appendChild(i), n.append(...t), r.appendChild(n);
	} else e.title && r.appendChild(i);
	let a = Gt(n, r.innerHTML);
	return a.classList.add("action-header"), a;
}
function Bt(...e) {
	let t = document.createElement("div");
	if (e) {
		let n = document.createElement("div");
		n.style.display = "flex", n.style.gap = "0.3rem 0.5rem", n.style.flexWrap = "wrap", n.append(...e), t.appendChild(n);
	}
	return r("div", {}, t);
}
function Vt(e, t) {
	let n = document.createElement("div");
	return n.className = "sp-action-title", n.innerHTML = t, Gt(e, t ? n.outerHTML : "");
}
function Ht(...e) {
	return o("sp-action-content", ...e);
}
function Ut(...e) {
	return o("list", r("ul", {}, ...e));
}
function Wt(...e) {
	return o("list list-strong inset list-dividers", r("ul", {}, ...e));
}
function Gt(e, t, n) {
	let r = document.createElement("li"), i = document.createElement("div");
	if (i.className = "item-content", i.style.alignItems = "baseline", e) {
		let t = document.createElement("div");
		t.className = "item-media", e.innerHTML ? t.innerHTML = e.innerHTML : t.innerHTML = String(e), i.appendChild(t);
	}
	if (t || n) {
		let e = document.createElement("div");
		if (e.className = "item-inner", t) if (t instanceof HTMLElement) e.appendChild(t);
		else {
			let n = document.createElement("div");
			n.className = "item-title", n.innerHTML = t, e.appendChild(n);
		}
		if (n) {
			let t = document.createElement("div");
			t.className = "item-after", t.appendChild(n), e.appendChild(t);
		}
		i.appendChild(e);
	}
	return r.appendChild(i), r;
}
function Kt(e, t) {
	let n = document.createElement("li"), r = document.createElement("ul");
	for (let n in t) {
		if (n === "CustomOutputName" || n === "UUID") continue;
		let i = t[n];
		e && e.params && e.params[n] && (n = e.params[n]), r.appendChild(Gt(null, n, s(i, n)));
	}
	return n.appendChild(r), n;
}
var qt = {
	WFAppStoreAppContentItem: "App store app",
	WFAppContentItem: "Installed app",
	WFArticleContentItem: "Article",
	WFContactContentItem: "Contact",
	WFDateContentItem: "Date",
	WFEmailAddressContentItem: "Email address",
	WFDictionaryContentItem: "Dictionary",
	WFFolderContentItem: "Folder",
	WFGenericFileContentItem: "File",
	WFImageContentItem: "Image",
	WFiTunesProductContentItem: "iTunes Product",
	WFLocationContentItem: "Location",
	WFDCMapsLinkContentItem: "Map link",
	WFAVAssetContentItem: "Media",
	WFPDFContentItem: "PDF",
	WFPhoneNumberContentItem: "Phone number",
	WFRichTextContentItem: "Rich Text",
	WFSafariWebPageContentItem: "Safari web page",
	WFStringContentItem: "Text",
	WFNumberContentItem: "Number",
	WFURLContentItem: "URL"
}, Jt = {
	MenuBar: "Menubar",
	QuickActions: "Quick Actions",
	ActionExtension: "Share Sheet",
	NCWidget: "Notifications Center",
	Sleep: "Sleep Mode",
	Watch: "Apple Watch",
	ReceivesOnScreenContent: "What's On Screen",
	WFWorkflowTypeShowInSearch: "Search",
	WFWorkflowTypeReceivesInputFromSearch: "Search Result"
}, Yt = {
	MenuBar: "MenuBar",
	QuickActions: "QuickActions",
	ActionExtension: "ActionExtension",
	NCWidget: "NCWidget",
	Sleep: "Sleep",
	Watch: "Watch",
	ReceivesOnScreenContent: "ReceivesOnScreenContent",
	ShowInSearch: "WFWorkflowTypeShowInSearch",
	ReceivesInputFromSearch: "WFWorkflowTypeReceivesInputFromSearch"
}, Xt = {
	Finder: "Finder",
	Services: "Services"
};
function Zt(e) {
	if (!e.WFWorkflowHasShortcutInputVariables) return;
	let t = document.createElement("div");
	t.className = "card sp-linked-action", t.id = "shortcut-input";
	let n = [];
	if (e.WFWorkflowInputContentItemClasses) {
		if (e.WFWorkflowInputContentItemClasses.length === Object.keys(qt).length) n = ["Any"];
		else if (e.WFWorkflowInputContentItemClasses) for (let t of e.WFWorkflowInputContentItemClasses) n.push(qt[t]);
	}
	let r = [];
	if (e.WFWorkflowTypes) for (let t of e.WFWorkflowTypes.filter((e) => e !== "Watch" && e !== "WFWorkflowTypeShowInSearch")) r.push(Jt[t]);
	let i = B({
		title: "Receives",
		icon: "layers_fill",
		color: x.Blue,
		background: "transparent"
	}, s(n.length === 0 ? null : n.filter((e) => e).join(", "), "No"), z("input from"), s(r.length === 0 ? null : r.filter((e) => e).join(", "), "Nowhere"));
	i.appendChild(vn(e)), t.innerHTML = Pt(i).outerHTML, wt.appendChild(t);
}
function Qt() {
	let e = document.querySelector(".sp-modal");
	e && (e.style.display = e.style.display === "none" ? "flex" : "none");
}
function $t() {
	let e = document.querySelector(".sp-variables-container");
	e && (e.style.display = e.style.display === "none" ? "flex" : "none");
}
function en(e) {
	let t = [], n = [];
	for (let i of e) if (i.WFWorkflowActionIdentifier === "is.workflow.actions.setvariable") {
		let e = i.WFWorkflowActionParameters?.WFVariableName;
		n.includes(e) || (n.push(e), t.push(r("div", {}, h(null, e))));
	}
	wt.prepend(r("div", {}, r("div", {
		className: "link text-color-blue sp-show-variables",
		onclick: $t,
		ariaLabel: "View Shortcut Variables",
		title: "Variables"
	}, hn("f_cursive")), r("div", { className: "sp-variables-container" }, ...t)));
}
function tn(e) {
	wt.appendChild(o("sp-modal", o("sp-modal-content", r("div", { style: "margin:1rem" }, r("div", { style: "text-align:right" }, r("div", {
		className: "link text-color-blue",
		onclick: Qt
	}, hn("xmark"))), ln([{ text: "Details" }, { text: "Setup" }])), o("tabs", r("div", {
		className: "tab tab-active",
		id: "tab-details"
	}, ...nn(e)), r("div", {
		className: "tab",
		id: "tab-setup"
	}, ...an(e)))))), wt.appendChild(r("div", {
		className: "link text-color-blue sp-open-details",
		onclick: Qt,
		ariaLabel: "View Shortcut Details",
		title: "Shortcut Details"
	}, hn("info_circle")));
}
function nn(e) {
	return [
		Wt(Gt(zt("square_arrow_up", "white", x.Blue), "Show in Share Sheet", s(e.WFWorkflowTypes ? e.WFWorkflowTypes.includes(Yt.ActionExtension) : !1)), Gt(zt("search", "white", x.Gray), "Show in Search/Spotlight", s(e.WFWorkflowTypes ? e.WFWorkflowTypes.includes(Yt.ShowInSearch) : !1))),
		rn("Mac"),
		Wt(Gt(zt("macwindow", "white", x.Gray), "Pin in Menu Bar", s(e.WFWorkflowTypes ? e.WFWorkflowTypes.includes(Yt.MenuBar) : !1)), Gt(zt("doc_text_viewfinder", "white", x.Red), "Receive What's On Screen", s(e.WFWorkflowTypes ? e.WFWorkflowTypes.includes(Yt.ReceivesOnScreenContent) : !1)), Gt(zt("doc_fill", "white", x.Gray), "Show as Quick Action", s(e.WFWorkflowTypes ? e.WFWorkflowTypes.includes(Yt.QuickActions) : !1)), Ht(Gt(zt("folder_fill", "white", x.Blue), "Finder", s(e.WFQuickActionSurfaces ? e.WFQuickActionSurfaces.includes(Xt.Finder) : !1)), Gt(zt("gear_alt_fill", "white", x.Gray), "Services Menu", s(e.WFQuickActionSurfaces ? e.WFQuickActionSurfaces.includes(Xt.Services) : !1))), Gt(zt("doc_text_search", "white", x.Gray), "Receive Input from Spotlight", s(e.WFWorkflowTypes ? e.WFWorkflowTypes.includes(Yt.ReceivesInputFromSearch) : !1))),
		rn("Apple Watch"),
		Wt(Gt(null, "Show on Apple Watch", s(e.WFWorkflowTypes ? e.WFWorkflowTypes.includes(Yt.Watch) : !1)))
	];
}
function rn(e) {
	return r("div", {
		className: "block-header",
		innerText: e.toUpperCase(),
		style: "text-align:left"
	});
}
function an(e) {
	let t = [];
	if (e.WFWorkflowActions && e.WFWorkflowImportQuestions) {
		for (let n of e.WFWorkflowImportQuestions) {
			let i = e.WFWorkflowActions[n.ActionIndex];
			if (i) {
				let e = R[i.WFWorkflowActionIdentifier.replace("is.workflow.actions.", "")];
				t.push(Gt(zt(e.icon ?? "gear", e.color ?? "white", e.background ?? x.Gray), r("div", { style: "text-align: left" }, r("div", { className: "item-title-row" }, r("div", {
					className: "item-title",
					innerHTML: `<strong>${e.title}</strong>`
				})), z("Question:"), cn(c(n.Text, "Question")), z("Default Answer:"), cn(c(n.DefaultValue, "Default Value")))));
			}
		}
		e.WFWorkflowImportQuestions.length || t.push(Gt(null, r("div", {}, a("No import questions"))));
	}
	return [r("div", {
		className: "block",
		style: "text-align:left;min-width:20rem"
	}, r("h3", { innerText: "Import Questions" })), Wt(...t)];
}
function on(e) {
	if (!e.WFWorkflowTriggers || !e.WFWorkflowTriggers.length) return;
	let t = 0;
	for (let n of e.WFWorkflowTriggers) {
		let i = document.createElement("div");
		i.className = "card", t === 0 && !e.WFWorkflowHasShortcutInputVariables && i.classList.add("sp-linked-action"), i.innerHTML = Pt(sn(i, n)).outerHTML, wt.appendChild(i), t++, t >= 1 && t !== e.WFWorkflowTriggers.length && wt.appendChild(r("div", { className: "sp-automation-or" }, a("or")));
	}
}
function sn(e, t) {
	let n = t.WFTriggerSerializedParameters ?? {}, r = _t[t.WFTriggerIdentifier];
	if (r && r.render) return r.render(e, n);
	Ct(t.WFTriggerIdentifier);
	let i = document.createElement("div");
	return i.appendChild(Vt(zt("gear", "white", "darkgray"), xt(t.WFTriggerIdentifier))), Object.keys(n).length && i.appendChild(Kt(null, n)), i;
}
function cn(...e) {
	return o("sp-scrollable-action-content", ...e);
}
function ln(e) {
	let t = r("p", { className: "segmented segmented-strong" });
	for (let n in e) {
		let i = e[n], a = r("a", {
			href: "#tab-" + i.text.toLowerCase(),
			className: "button tab-link",
			innerText: i.text
		});
		n === "0" && a.classList.add("button-active"), a.onclick = () => {
			t.querySelectorAll("a")?.forEach((e) => e.classList.remove("button-active")), a.classList.add("button-active");
		}, t.appendChild(a);
	}
	return t.appendChild(r("span", { className: "segmented-highlight" })), t;
}
var un;
(function(e) {
	e[e.Text = 0] = "Text", e[e.Number = 3] = "Number", e[e.Array = 2] = "Array", e[e.Dictionary = 1] = "Dictionary", e[e.Boolean = 4] = "Boolean";
})(un ||= {});
function dn(e) {
	let t = document.createElement("table"), n = document.createElement("thead");
	n.innerHTML = "<tr><th>Key</th><th>Type</th><th>Value</th></tr>", t.appendChild(n);
	let i = document.createElement("div");
	i.className = "sp-action-list-footer";
	let a = e ? e.length : 0;
	return i.innerText = a + " item" + (a == 1 ? "" : "s"), r("div", {}, t, o("treeview", ...fn(e)), i);
}
function fn(e) {
	if (!e) return [
		pn([]),
		pn([]),
		pn([])
	];
	let t = [], n = 0;
	for (let i of e) {
		n++;
		let e = [], o = null;
		o = i.WFKey ? c(i.WFKey, "Key") : r("div", { className: "fade" }, a(`Item ${n}`));
		let s = c(i.WFValue, "Value");
		if (i.WFValue && typeof i.WFValue.Value != "object" && (s = c(i.WFValue.Value, "Value")), i.WFItemType === un.Dictionary || i.WFItemType === un.Array) {
			let t = [];
			i.WFItemType === un.Dictionary && (t = i.WFValue.Value.Value.WFDictionaryFieldValueItems), i.WFItemType === un.Array && (t = i.WFValue.Value), e.push(...fn(t)), s = r("div", { className: "fade" }, a(`${t.length} items`));
		}
		let l;
		switch (i.WFItemType) {
			case un.Number:
				l = "Number";
				break;
			case un.Dictionary:
				l = "Dictionary";
				break;
			case un.Boolean:
				l = "Boolean";
				break;
			case un.Array:
				l = "Array";
				break;
			case un.Text:
				l = "Text";
				break;
		}
		l || (l = typeof i, s = c(i)), t.push(pn([r("div", { className: "tree-row" }, o, r("div", {}, a(l)), s)], ...e));
	}
	return t;
}
function pn(e, ...t) {
	let n = [];
	return t.length !== 0 && n.push(o("treeview-toggle")), n.push(o("treeview-item-content", o("treeview-item-label", ...e))), o("treeview-item", o("treeview-item-root", ...n), o("treeview-item-children", ...t));
}
function mn(e, ...t) {
	return r("div", { className: "sp-label" }, a(e + ":"), ...t);
}
function hn(e) {
	return r("i", { className: "icon f7-icons" }, a(e));
}
var gn;
(function(e) {
	e.ShowError = "WFWorkflowNoInputBehaviorShowError", e.GetClipboard = "WFWorkflowNoInputBehaviorGetClipboard", e.AskForInput = "WFWorkflowNoInputBehaviorAskForInput";
})(gn ||= {});
function _n(e, t = null) {
	let n = r("div");
	return i(n, {
		display: "flex",
		gap: "10px",
		alignItems: "center",
		margin: "0 16px",
		height: "3rem"
	}), n.appendChild(s(e ?? "Continue", "Behavior")), t && n.appendChild(s(t, "Result")), r("div", {}, r("div", {
		innerText: "If there's nowhere to output:",
		className: "sp-output-surface-behavior"
	}), n);
}
function vn(e) {
	let t = "Continue", n = "";
	if (e.WFWorkflowNoInputBehavior?.Parameters) switch (e.WFWorkflowNoInputBehavior.Name) {
		case gn.ShowError:
			t = "Stop and Respond", e.WFWorkflowNoInputBehavior.Parameters?.Error && (n = e.WFWorkflowNoInputBehavior.Parameters.Error);
			break;
		case gn.AskForInput:
			t = "Ask For", e.WFWorkflowNoInputBehavior.Parameters?.ItemClass && (n = qt[e.WFWorkflowNoInputBehavior.Parameters.ItemClass]);
			break;
		case gn.GetClipboard: t = "Get Clipboard";
	}
	return _n(t, n);
}
//#endregion
//#region node_modules/@plist/common/lib/cjs/types.js
var yn = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 });
})), bn = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.PlistFormat = e.HEADER_OPENSTEP_UTF8 = e.HEADER_BINARY = e.EPOCH = void 0, e.EPOCH = 9783072e5, e.HEADER_BINARY = "bplist00", e.HEADER_OPENSTEP_UTF8 = "// !$*UTF8*$!", (function(e) {
		e[e.BINARY = 0] = "BINARY", e[e.XML = 1] = "XML", e[e.OPENSTEP = 2] = "OPENSTEP";
	})(e.PlistFormat ||= {});
})), xn = /* @__PURE__ */ t(((e) => {
	var t = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), n = e && e.__exportStar || function(e, n) {
		for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(n, r) && t(n, e, r);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), n(yn(), e), n(bn(), e);
})), Sn = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.parse = void 0;
	var t = xn(), n = 100 * 1e3 * 1e3, r = 32768, i = new TextDecoder("utf-8"), a = new TextDecoder("utf-16");
	function o(e, t = 0) {
		return new DataView(e).getFloat64(t, !1);
	}
	function s(e, t = 0) {
		return new DataView(e).getFloat32(t, !1);
	}
	function c(e, t = 0) {
		return new DataView(e).getUint8(t);
	}
	function l(e, t = 0) {
		return new DataView(e).getUint16(t, !1);
	}
	function u(e, t = 0) {
		return new DataView(e).getUint32(t, !1);
	}
	function d(e, t = 0) {
		return new DataView(e).getBigUint64(t, !1);
	}
	function f(e) {
		switch (e.byteLength) {
			case 1: return c(e);
			case 2: return l(e);
			case 4: return u(e);
			case 8: return d(e);
			case 16: return d(e, 8);
		}
		throw Error(`Invalid unsigned int length: ${e.byteLength}`);
	}
	function p(e, t = 0) {
		return new DataView(e).getInt8(t);
	}
	function m(e, t = 0) {
		return new DataView(e).getInt16(t, !1);
	}
	function h(e, t = 0) {
		return new DataView(e).getInt32(t, !1);
	}
	function g(e, t = 0) {
		return new DataView(e).getBigInt64(t, !1);
	}
	function _(e) {
		switch (e.byteLength) {
			case 1: return p(e);
			case 2: return m(e);
			case 4: return h(e);
			case 8: return g(e);
			case 16: return d(e, 8);
		}
		throw Error(`Invalid int length: ${e.byteLength}`);
	}
	function v(e) {
		let t = new Uint8Array(e);
		for (let e = 0; e < t.length; e += 2) {
			let n = t[e];
			t[e] = t[e + 1], t[e + 1] = n;
		}
		return t.buffer;
	}
	e.parse = (e) => {
		let l = e.slice(0, t.HEADER_BINARY.length);
		if (i.decode(l) !== t.HEADER_BINARY) throw Error(`Invalid binary plist. Expected '${t.HEADER_BINARY}' at offset 0.`);
		let u = e.slice(e.byteLength - 32, e.byteLength), m = c(u, 6), h = c(u, 7), g = Number(d(u, 8)), y = Number(d(u, 16)), b = Number(d(u, 24));
		if (g > r) throw Error("maxObjectCount exceeded");
		let x = [];
		for (let t = 0; t < g; t++) {
			let n = e.slice(b + t * m, b + (t + 1) * m);
			x[t] = Number(f(n));
		}
		function S(r) {
			let l = x[r], u = c(e, l), d = (u & 240) >> 4, m = u & 15;
			switch (d) {
				case 0: return g();
				case 1: return y();
				case 8: return b();
				case 2: return C();
				case 3: return w();
				case 4: return T();
				case 5: return E();
				case 6: return E(!0);
				case 10: return D();
				case 13: return O();
				default: throw Error("Unhandled type 0x" + d.toString(16));
			}
			function g() {
				switch (m) {
					case 0: return null;
					case 8: return !1;
					case 9: return !0;
					case 15: return null;
					default: throw Error("Unhandled simple type 0x" + d.toString(16));
				}
			}
			function y() {
				let t = 2 ** m;
				if (t < n) return _(e.slice(l + 1, l + 1 + t));
				throw Error("Too little heap space available! Wanted to read " + t + " bytes, but only 100000000 are available.");
			}
			function b() {
				let t = m + 1;
				if (t < n) return { CF$UID: f(e.slice(l + 1, l + 1 + t)) };
				throw Error("Too little heap space available! Wanted to read " + t + " bytes, but only 100000000 are available.");
			}
			function C() {
				let t = 2 ** m;
				if (t < n) {
					let n = e.slice(l + 1, l + 1 + t);
					if (t === 4) return s(n);
					if (t === 8) return o(n);
					throw Error(`Invalid real length: ${t}`);
				} else throw Error("Too little heap space available! Wanted to read " + t + " bytes, but only 100000000 are available.");
			}
			function w() {
				m != 3 && console.error("Unknown date type :" + m + ". Parsing anyway...");
				let n = e.slice(l + 1, l + 9);
				return new Date(t.EPOCH + 1e3 * o(n));
			}
			function T() {
				let t = 1, r = m;
				if (m == 15) {
					let n = p(e, l + 1), i = (n & 240) / 16;
					i != 1 && console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + i);
					let a = 2 ** (n & 15);
					t = 2 + a, r = Number(f(e.slice(l + 2, l + 2 + a)));
				}
				if (r < n) return e.slice(l + t, l + t + Number(r));
				throw Error("Too little heap space available! Wanted to read " + r + " bytes, but only 100000000 are available.");
			}
			function E(t = !1) {
				let r = m, o = 1;
				if (m == 15) {
					let t = c(e, l + 1), n = (t & 240) / 16;
					n != 1 && console.error("UNEXPECTED LENGTH-INT TYPE! " + n);
					let i = 2 ** (t & 15);
					o = 2 + i, r = Number(f(e.slice(l + 2, l + 2 + i)));
				}
				if (r *= t ? 2 : 1, r < n) {
					let n = e.slice(l + o, l + o + r);
					return t ? (n = v(n), a.decode(n)) : i.decode(n);
				}
				throw Error("Too little heap space available! Wanted to read " + r + " bytes, but only 100000000 are available.");
			}
			function D() {
				let t = m, r = 1;
				if (m == 15) {
					let n = c(e, l + 1), i = (n & 240) / 16;
					i != 1 && console.error("0xa: UNEXPECTED LENGTH-INT TYPE! " + i);
					let a = 2 ** (n & 15);
					r = 2 + a, t = Number(f(e.slice(l + 2, l + 2 + a)));
				}
				if (t * h > n) throw Error("Too little heap space available!");
				let i = [];
				for (let n = 0; n < t; n++) i[n] = S(Number(f(e.slice(l + r + n * h, l + r + (n + 1) * h))));
				return i;
			}
			function O() {
				let t = m, r = 1;
				if (m == 15) {
					let n = c(e, l + 1), i = (n & 240) / 16;
					i != 1 && console.error("0xD: UNEXPECTED LENGTH-INT TYPE! " + i);
					let a = 2 ** (n & 15);
					r = 2 + a, t = Number(f(e.slice(l + 2, l + 2 + a)));
				}
				if (t * 2 * h > n) throw Error("Too little heap space available!");
				let i = {};
				for (let n = 0; n < t; n++) {
					let a = Number(f(e.slice(l + r + n * h, l + r + (n + 1) * h))), o = Number(f(e.slice(l + r + t * h + n * h, l + r + t * h + (n + 1) * h))), s = S(a);
					if (typeof s != "string") throw Error("Invalid key type.");
					if (s === "__proto__") throw Error("Attempted prototype pollution");
					i[s] = S(o);
				}
				return i;
			}
		}
		return S(y);
	};
})), Cn = /* @__PURE__ */ t(((e) => {
	var t = "[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*", n = /* @__PURE__ */ RegExp("^[:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$");
	e.isExist = function(e) {
		return e !== void 0;
	}, e.isEmptyObject = function(e) {
		return Object.keys(e).length === 0;
	}, e.merge = function(e, t, n) {
		if (t) {
			let r = Object.keys(t), i = r.length;
			for (let a = 0; a < i; a++) n === "strict" ? e[r[a]] = [t[r[a]]] : e[r[a]] = t[r[a]];
		}
	}, e.getValue = function(t) {
		return e.isExist(t) ? t : "";
	}, e.isName = function(e) {
		return n.exec(e) != null;
	}, e.getAllMatches = function(e, t) {
		let n = [], r = t.exec(e);
		for (; r;) {
			let i = [];
			i.startIndex = t.lastIndex - r[0].length;
			let a = r.length;
			for (let e = 0; e < a; e++) i.push(r[e]);
			n.push(i), r = t.exec(e);
		}
		return n;
	}, e.nameRegexp = t, e.DANGEROUS_PROPERTY_NAMES = [
		"hasOwnProperty",
		"toString",
		"valueOf",
		"__defineGetter__",
		"__defineSetter__",
		"__lookupGetter__",
		"__lookupSetter__"
	], e.criticalProperties = [
		"__proto__",
		"constructor",
		"prototype"
	];
})), wn = /* @__PURE__ */ t(((e) => {
	var t = Cn(), n = {
		allowBooleanAttributes: !1,
		unpairedTags: []
	};
	e.validate = function(e, t) {
		t = Object.assign({}, n, t);
		let o = [], s = !1, l = !1;
		e[0] === "﻿" && (e = e.substr(1));
		for (let n = 0; n < e.length; n++) if (e[n] === "<" && e[n + 1] === "?") {
			if (n += 2, n = i(e, n), n.err) return n;
		} else if (e[n] === "<") {
			let d = n;
			if (n++, e[n] === "!") {
				n = a(e, n);
				continue;
			} else {
				let m = !1;
				e[n] === "/" && (m = !0, n++);
				let _ = "";
				for (; n < e.length && e[n] !== ">" && e[n] !== " " && e[n] !== "	" && e[n] !== "\n" && e[n] !== "\r"; n++) _ += e[n];
				if (_ = _.trim(), _[_.length - 1] === "/" && (_ = _.substring(0, _.length - 1), n--), !h(_)) {
					let t;
					return t = _.trim().length === 0 ? "Invalid space after '<'." : "Tag '" + _ + "' is an invalid name.", p("InvalidTag", t, g(e, n));
				}
				let v = c(e, n);
				if (v === !1) return p("InvalidAttr", "Attributes for '" + _ + "' have open quote.", g(e, n));
				let y = v.value;
				if (n = v.index, y[y.length - 1] === "/") {
					let r = n - y.length;
					y = y.substring(0, y.length - 1);
					let i = u(y, t);
					if (i === !0) s = !0;
					else return p(i.err.code, i.err.msg, g(e, r + i.err.line));
				} else if (m) {
					if (!v.tagClosed) return p("InvalidTag", "Closing tag '" + _ + "' doesn't have proper closing.", g(e, n));
					if (y.trim().length > 0) return p("InvalidTag", "Closing tag '" + _ + "' can't have attributes or invalid starting.", g(e, d));
					if (o.length === 0) return p("InvalidTag", "Closing tag '" + _ + "' has not been opened.", g(e, d));
					{
						let t = o.pop();
						if (_ !== t.tagName) {
							let n = g(e, t.tagStartPos);
							return p("InvalidTag", "Expected closing tag '" + t.tagName + "' (opened in line " + n.line + ", col " + n.col + ") instead of closing tag '" + _ + "'.", g(e, d));
						}
						o.length == 0 && (l = !0);
					}
				} else {
					let r = u(y, t);
					if (r !== !0) return p(r.err.code, r.err.msg, g(e, n - y.length + r.err.line));
					if (l === !0) return p("InvalidXml", "Multiple possible root nodes found.", g(e, n));
					t.unpairedTags.indexOf(_) !== -1 || o.push({
						tagName: _,
						tagStartPos: d
					}), s = !0;
				}
				for (n++; n < e.length; n++) if (e[n] === "<") if (e[n + 1] === "!") {
					n++, n = a(e, n);
					continue;
				} else if (e[n + 1] === "?") {
					if (n = i(e, ++n), n.err) return n;
				} else break;
				else if (e[n] === "&") {
					let t = f(e, n);
					if (t == -1) return p("InvalidChar", "char '&' is not expected.", g(e, n));
					n = t;
				} else if (l === !0 && !r(e[n])) return p("InvalidXml", "Extra text at the end", g(e, n));
				e[n] === "<" && n--;
			}
		} else {
			if (r(e[n])) continue;
			return p("InvalidChar", "char '" + e[n] + "' is not expected.", g(e, n));
		}
		return s ? o.length == 1 ? p("InvalidTag", "Unclosed tag '" + o[0].tagName + "'.", g(e, o[0].tagStartPos)) : o.length > 0 ? p("InvalidXml", "Invalid '" + JSON.stringify(o.map((e) => e.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", {
			line: 1,
			col: 1
		}) : !0 : p("InvalidXml", "Start tag expected.", 1);
	};
	function r(e) {
		return e === " " || e === "	" || e === "\n" || e === "\r";
	}
	function i(e, t) {
		let n = t;
		for (; t < e.length; t++) if (e[t] == "?" || e[t] == " ") {
			let r = e.substr(n, t - n);
			if (t > 5 && r === "xml") return p("InvalidXml", "XML declaration allowed only at the start of the document.", g(e, t));
			if (e[t] == "?" && e[t + 1] == ">") {
				t++;
				break;
			} else continue;
		}
		return t;
	}
	function a(e, t) {
		if (e.length > t + 5 && e[t + 1] === "-" && e[t + 2] === "-") {
			for (t += 3; t < e.length; t++) if (e[t] === "-" && e[t + 1] === "-" && e[t + 2] === ">") {
				t += 2;
				break;
			}
		} else if (e.length > t + 8 && e[t + 1] === "D" && e[t + 2] === "O" && e[t + 3] === "C" && e[t + 4] === "T" && e[t + 5] === "Y" && e[t + 6] === "P" && e[t + 7] === "E") {
			let n = 1;
			for (t += 8; t < e.length; t++) if (e[t] === "<") n++;
			else if (e[t] === ">" && (n--, n === 0)) break;
		} else if (e.length > t + 9 && e[t + 1] === "[" && e[t + 2] === "C" && e[t + 3] === "D" && e[t + 4] === "A" && e[t + 5] === "T" && e[t + 6] === "A" && e[t + 7] === "[") {
			for (t += 8; t < e.length; t++) if (e[t] === "]" && e[t + 1] === "]" && e[t + 2] === ">") {
				t += 2;
				break;
			}
		}
		return t;
	}
	var o = "\"", s = "'";
	function c(e, t) {
		let n = "", r = "", i = !1;
		for (; t < e.length; t++) {
			if (e[t] === o || e[t] === s) r === "" ? r = e[t] : r !== e[t] || (r = "");
			else if (e[t] === ">" && r === "") {
				i = !0;
				break;
			}
			n += e[t];
		}
		return r === "" ? {
			value: n,
			index: t,
			tagClosed: i
		} : !1;
	}
	var l = /* @__PURE__ */ RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g");
	function u(e, n) {
		let r = t.getAllMatches(e, l), i = {};
		for (let e = 0; e < r.length; e++) {
			if (r[e][1].length === 0) return p("InvalidAttr", "Attribute '" + r[e][2] + "' has no space in starting.", _(r[e]));
			if (r[e][3] !== void 0 && r[e][4] === void 0) return p("InvalidAttr", "Attribute '" + r[e][2] + "' is without value.", _(r[e]));
			if (r[e][3] === void 0 && !n.allowBooleanAttributes) return p("InvalidAttr", "boolean attribute '" + r[e][2] + "' is not allowed.", _(r[e]));
			let t = r[e][2];
			if (!m(t)) return p("InvalidAttr", "Attribute '" + t + "' is an invalid name.", _(r[e]));
			if (!i.hasOwnProperty(t)) i[t] = 1;
			else return p("InvalidAttr", "Attribute '" + t + "' is repeated.", _(r[e]));
		}
		return !0;
	}
	function d(e, t) {
		let n = /\d/;
		for (e[t] === "x" && (t++, n = /[\da-fA-F]/); t < e.length; t++) {
			if (e[t] === ";") return t;
			if (!e[t].match(n)) break;
		}
		return -1;
	}
	function f(e, t) {
		if (t++, e[t] === ";") return -1;
		if (e[t] === "#") return t++, d(e, t);
		let n = 0;
		for (; t < e.length; t++, n++) if (!(e[t].match(/\w/) && n < 20)) {
			if (e[t] === ";") break;
			return -1;
		}
		return t;
	}
	function p(e, t, n) {
		return { err: {
			code: e,
			msg: t,
			line: n.line || n,
			col: n.col
		} };
	}
	function m(e) {
		return t.isName(e);
	}
	function h(e) {
		return t.isName(e);
	}
	function g(e, t) {
		let n = e.substring(0, t).split(/\r?\n/);
		return {
			line: n.length,
			col: n[n.length - 1].length + 1
		};
	}
	function _(e) {
		return e.startIndex + e[1].length;
	}
})), Tn = /* @__PURE__ */ t(((e) => {
	var { DANGEROUS_PROPERTY_NAMES: t, criticalProperties: n } = Cn(), r = (e) => t.includes(e) ? "__" + e : e, i = {
		preserveOrder: !1,
		attributeNamePrefix: "@_",
		attributesGroupName: !1,
		textNodeName: "#text",
		ignoreAttributes: !0,
		removeNSPrefix: !1,
		allowBooleanAttributes: !1,
		parseTagValue: !0,
		parseAttributeValue: !1,
		trimValues: !0,
		cdataPropName: !1,
		numberParseOptions: {
			hex: !0,
			leadingZeros: !0,
			eNotation: !0
		},
		tagValueProcessor: function(e, t) {
			return t;
		},
		attributeValueProcessor: function(e, t) {
			return t;
		},
		stopNodes: [],
		alwaysCreateTextNode: !1,
		isArray: () => !1,
		commentPropName: !1,
		unpairedTags: [],
		processEntities: !0,
		htmlEntities: !1,
		ignoreDeclaration: !1,
		ignorePiTags: !1,
		transformTagName: !1,
		transformAttributeName: !1,
		updateTag: function(e, t, n) {
			return e;
		},
		captureMetaData: !1,
		maxNestedTags: 100,
		strictReservedNames: !0,
		onDangerousProperty: r
	};
	function a(e, r) {
		if (typeof e != "string") return;
		let i = e.toLowerCase();
		if (t.some((e) => i === e.toLowerCase()) || n.some((e) => i === e.toLowerCase())) throw Error(`[SECURITY] Invalid ${r}: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`);
	}
	function o(e) {
		return typeof e == "boolean" ? {
			enabled: e,
			maxEntitySize: 1e4,
			maxExpansionDepth: 10,
			maxTotalExpansions: 1e3,
			maxExpandedLength: 1e5,
			allowedTags: null,
			tagFilter: null
		} : typeof e == "object" && e ? {
			enabled: e.enabled !== !1,
			maxEntitySize: Math.max(1, e.maxEntitySize ?? 1e4),
			maxExpansionDepth: Math.max(1, e.maxExpansionDepth ?? 1e4),
			maxTotalExpansions: Math.max(1, e.maxTotalExpansions ?? Infinity),
			maxExpandedLength: Math.max(1, e.maxExpandedLength ?? 1e5),
			maxEntityCount: Math.max(1, e.maxEntityCount ?? 1e3),
			allowedTags: e.allowedTags ?? null,
			tagFilter: e.tagFilter ?? null
		} : o(!0);
	}
	e.buildOptions = function(e) {
		let t = Object.assign({}, i, e), n = [
			{
				value: t.attributeNamePrefix,
				name: "attributeNamePrefix"
			},
			{
				value: t.attributesGroupName,
				name: "attributesGroupName"
			},
			{
				value: t.textNodeName,
				name: "textNodeName"
			},
			{
				value: t.cdataPropName,
				name: "cdataPropName"
			},
			{
				value: t.commentPropName,
				name: "commentPropName"
			}
		];
		for (let { value: e, name: t } of n) e && a(e, t);
		return t.onDangerousProperty === null && (t.onDangerousProperty = r), t.processEntities = o(t.processEntities), t;
	}, e.defaultOptions = i;
})), En = /* @__PURE__ */ t(((e, t) => {
	t.exports = class {
		constructor(e) {
			this.tagname = e, this.child = [], this[":@"] = {};
		}
		add(e, t) {
			e === "__proto__" && (e = "#__proto__"), this.child.push({ [e]: t });
		}
		addChild(e) {
			e.tagname === "__proto__" && (e.tagname = "#__proto__"), e[":@"] && Object.keys(e[":@"]).length > 0 ? this.child.push({
				[e.tagname]: e.child,
				":@": e[":@"]
			}) : this.child.push({ [e.tagname]: e.child });
		}
	};
})), Dn = /* @__PURE__ */ t(((e, t) => {
	var n = Cn(), r = class {
		constructor(e) {
			this.suppressValidationErr = !e, this.options = e || {};
		}
		readDocType(e, t) {
			let n = Object.create(null), r = 0;
			if (e[t + 3] === "O" && e[t + 4] === "C" && e[t + 5] === "T" && e[t + 6] === "Y" && e[t + 7] === "P" && e[t + 8] === "E") {
				t += 9;
				let i = 1, o = !1, s = !1, c = "";
				for (; t < e.length; t++) if (e[t] === "<" && !s) {
					if (o && a(e, "!ENTITY", t)) {
						t += 7;
						let i, a;
						if ([i, a, t] = this.readEntityExp(e, t + 1, this.suppressValidationErr), a.indexOf("&") === -1) {
							if (this.options.enabled !== !1 && this.options.maxEntityCount != null && r >= this.options.maxEntityCount) throw Error(`Entity count (${r + 1}) exceeds maximum allowed (${this.options.maxEntityCount})`);
							let e = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
							n[i] = {
								regx: RegExp(`&${e};`, "g"),
								val: a
							}, r++;
						}
					} else if (o && a(e, "!ELEMENT", t)) {
						t += 8;
						let { index: n } = this.readElementExp(e, t + 1);
						t = n;
					} else if (o && a(e, "!ATTLIST", t)) t += 8;
					else if (o && a(e, "!NOTATION", t)) {
						t += 9;
						let { index: n } = this.readNotationExp(e, t + 1, this.suppressValidationErr);
						t = n;
					} else if (a(e, "!--", t)) s = !0;
					else throw Error("Invalid DOCTYPE");
					i++, c = "";
				} else if (e[t] === ">") {
					if (s ? e[t - 1] === "-" && e[t - 2] === "-" && (s = !1, i--) : i--, i === 0) break;
				} else e[t] === "[" ? o = !0 : c += e[t];
				if (i !== 0) throw Error("Unclosed DOCTYPE");
			} else throw Error("Invalid Tag instead of DOCTYPE");
			return {
				entities: n,
				i: t
			};
		}
		readEntityExp(e, t) {
			t = i(e, t);
			let n = "";
			for (; t < e.length && !/\s/.test(e[t]) && e[t] !== "\"" && e[t] !== "'";) n += e[t], t++;
			if (o(n), t = i(e, t), !this.suppressValidationErr) {
				if (e.substring(t, t + 6).toUpperCase() === "SYSTEM") throw Error("External entities are not supported");
				if (e[t] === "%") throw Error("Parameter entities are not supported");
			}
			let r = "";
			if ([t, r] = this.readIdentifierVal(e, t, "entity"), this.options.enabled !== !1 && this.options.maxEntitySize != null && r.length > this.options.maxEntitySize) throw Error(`Entity "${n}" size (${r.length}) exceeds maximum allowed size (${this.options.maxEntitySize})`);
			return t--, [
				n,
				r,
				t
			];
		}
		readNotationExp(e, t) {
			t = i(e, t);
			let n = "";
			for (; t < e.length && !/\s/.test(e[t]);) n += e[t], t++;
			!this.suppressValidationErr && o(n), t = i(e, t);
			let r = e.substring(t, t + 6).toUpperCase();
			if (!this.suppressValidationErr && r !== "SYSTEM" && r !== "PUBLIC") throw Error(`Expected SYSTEM or PUBLIC, found "${r}"`);
			t += r.length, t = i(e, t);
			let a = null, s = null;
			if (r === "PUBLIC") [t, a] = this.readIdentifierVal(e, t, "publicIdentifier"), t = i(e, t), (e[t] === "\"" || e[t] === "'") && ([t, s] = this.readIdentifierVal(e, t, "systemIdentifier"));
			else if (r === "SYSTEM" && ([t, s] = this.readIdentifierVal(e, t, "systemIdentifier"), !this.suppressValidationErr && !s)) throw Error("Missing mandatory system identifier for SYSTEM notation");
			return {
				notationName: n,
				publicIdentifier: a,
				systemIdentifier: s,
				index: --t
			};
		}
		readIdentifierVal(e, t, n) {
			let r = "", i = e[t];
			if (i !== "\"" && i !== "'") throw Error(`Expected quoted string, found "${i}"`);
			for (t++; t < e.length && e[t] !== i;) r += e[t], t++;
			if (e[t] !== i) throw Error(`Unterminated ${n} value`);
			return t++, [t, r];
		}
		readElementExp(e, t) {
			t = i(e, t);
			let r = "";
			for (; t < e.length && !/\s/.test(e[t]);) r += e[t], t++;
			if (!this.suppressValidationErr && !n.isName(r)) throw Error(`Invalid element name: "${r}"`);
			t = i(e, t);
			let o = "";
			if (e[t] === "E" && a(e, "MPTY", t)) t += 4;
			else if (e[t] === "A" && a(e, "NY", t)) t += 2;
			else if (e[t] === "(") {
				for (t++; t < e.length && e[t] !== ")";) o += e[t], t++;
				if (e[t] !== ")") throw Error("Unterminated content model");
			} else if (!this.suppressValidationErr) throw Error(`Invalid Element Expression, found "${e[t]}"`);
			return {
				elementName: r,
				contentModel: o.trim(),
				index: t
			};
		}
		readAttlistExp(e, t) {
			t = i(e, t);
			let n = "";
			for (; t < e.length && !/\s/.test(e[t]);) n += e[t], t++;
			o(n), t = i(e, t);
			let r = "";
			for (; t < e.length && !/\s/.test(e[t]);) r += e[t], t++;
			if (!o(r)) throw Error(`Invalid attribute name: "${r}"`);
			t = i(e, t);
			let a = "";
			if (e.substring(t, t + 8).toUpperCase() === "NOTATION") {
				if (a = "NOTATION", t += 8, t = i(e, t), e[t] !== "(") throw Error(`Expected '(', found "${e[t]}"`);
				t++;
				let n = [];
				for (; t < e.length && e[t] !== ")";) {
					let r = "";
					for (; t < e.length && e[t] !== "|" && e[t] !== ")";) r += e[t], t++;
					if (r = r.trim(), !o(r)) throw Error(`Invalid notation name: "${r}"`);
					n.push(r), e[t] === "|" && (t++, t = i(e, t));
				}
				if (e[t] !== ")") throw Error("Unterminated list of notations");
				t++, a += " (" + n.join("|") + ")";
			} else {
				for (; t < e.length && !/\s/.test(e[t]);) a += e[t], t++;
				if (!this.suppressValidationErr && ![
					"CDATA",
					"ID",
					"IDREF",
					"IDREFS",
					"ENTITY",
					"ENTITIES",
					"NMTOKEN",
					"NMTOKENS"
				].includes(a.toUpperCase())) throw Error(`Invalid attribute type: "${a}"`);
			}
			t = i(e, t);
			let s = "";
			return e.substring(t, t + 8).toUpperCase() === "#REQUIRED" ? (s = "#REQUIRED", t += 8) : e.substring(t, t + 7).toUpperCase() === "#IMPLIED" ? (s = "#IMPLIED", t += 7) : [t, s] = this.readIdentifierVal(e, t, "ATTLIST"), {
				elementName: n,
				attributeName: r,
				attributeType: a,
				defaultValue: s,
				index: t
			};
		}
	}, i = (e, t) => {
		for (; t < e.length && /\s/.test(e[t]);) t++;
		return t;
	};
	function a(e, t, n) {
		for (let r = 0; r < t.length; r++) if (t[r] !== e[n + r + 1]) return !1;
		return !0;
	}
	function o(e) {
		if (n.isName(e)) return e;
		throw Error(`Invalid entity name ${e}`);
	}
	t.exports = r;
})), On = /* @__PURE__ */ t(((e, t) => {
	var n = /^[-+]?0x[a-fA-F0-9]+$/, r = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/, i = {
		hex: !0,
		leadingZeros: !0,
		decimalPoint: ".",
		eNotation: !0
	};
	function a(e, t = {}) {
		if (t = Object.assign({}, i, t), !e || typeof e != "string") return e;
		let a = e.trim();
		if (t.skipLike !== void 0 && t.skipLike.test(a)) return e;
		if (e === "0") return 0;
		if (t.hex && n.test(a)) return s(a, 16);
		if (a.search(/[eE]/) !== -1) {
			let n = a.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
			if (n) {
				if (t.leadingZeros) a = (n[1] || "") + n[3];
				else if (!(n[2] === "0" && n[3][0] === ".")) return e;
				return t.eNotation ? Number(a) : e;
			} else return e;
		} else {
			let n = r.exec(a);
			if (n) {
				let r = n[1], i = n[2], s = o(n[3]);
				if (!t.leadingZeros && i.length > 0 && r && a[2] !== "." || !t.leadingZeros && i.length > 0 && !r && a[1] !== ".") return e;
				if (t.leadingZeros && i === e) return 0;
				{
					let n = Number(a), o = "" + n;
					return o.search(/[eE]/) === -1 ? a.indexOf(".") === -1 ? i ? s === o || r + s === o ? n : e : a === o || a === r + o ? n : e : o === "0" && s === "" || o === s || r && o === "-" + s ? n : e : t.eNotation ? n : e;
				}
			} else return e;
		}
	}
	function o(e) {
		return e && e.indexOf(".") !== -1 ? (e = e.replace(/0+$/, ""), e === "." ? e = "0" : e[0] === "." ? e = "0" + e : e[e.length - 1] === "." && (e = e.substr(0, e.length - 1)), e) : e;
	}
	function s(e, t) {
		if (parseInt) return parseInt(e, t);
		if (Number.parseInt) return Number.parseInt(e, t);
		if (window && window.parseInt) return window.parseInt(e, t);
		throw Error("parseInt, Number.parseInt, window.parseInt are not supported");
	}
	t.exports = a;
})), kn = /* @__PURE__ */ t(((e, t) => {
	function n(e) {
		return typeof e == "function" ? e : Array.isArray(e) ? (t) => {
			for (let n of e) if (typeof n == "string" && t === n || n instanceof RegExp && n.test(t)) return !0;
		} : () => !1;
	}
	t.exports = n;
})), An = /* @__PURE__ */ t(((e, t) => {
	var n = Cn(), r = En(), i = Dn(), a = On(), o = kn(), s = class {
		constructor(e) {
			if (this.options = e, this.currentNode = null, this.tagsNodeStack = [], this.docTypeEntities = {}, this.lastEntities = {
				apos: {
					regex: /&(apos|#39|#x27);/g,
					val: "'"
				},
				gt: {
					regex: /&(gt|#62|#x3E);/g,
					val: ">"
				},
				lt: {
					regex: /&(lt|#60|#x3C);/g,
					val: "<"
				},
				quot: {
					regex: /&(quot|#34|#x22);/g,
					val: "\""
				}
			}, this.ampEntity = {
				regex: /&(amp|#38|#x26);/g,
				val: "&"
			}, this.htmlEntities = {
				space: {
					regex: /&(nbsp|#160);/g,
					val: " "
				},
				cent: {
					regex: /&(cent|#162);/g,
					val: "¢"
				},
				pound: {
					regex: /&(pound|#163);/g,
					val: "£"
				},
				yen: {
					regex: /&(yen|#165);/g,
					val: "¥"
				},
				euro: {
					regex: /&(euro|#8364);/g,
					val: "€"
				},
				copyright: {
					regex: /&(copy|#169);/g,
					val: "©"
				},
				reg: {
					regex: /&(reg|#174);/g,
					val: "®"
				},
				inr: {
					regex: /&(inr|#8377);/g,
					val: "₹"
				},
				num_dec: {
					regex: /&#([0-9]{1,7});/g,
					val: (e, t) => C(t, 10, "&#")
				},
				num_hex: {
					regex: /&#x([0-9a-fA-F]{1,6});/g,
					val: (e, t) => C(t, 16, "&#x")
				}
			}, this.addExternalEntities = c, this.parseXml = p, this.parseTextData = l, this.resolveNameSpace = u, this.buildAttributesMap = f, this.isItStopNode = _, this.replaceEntitiesValue = h, this.readStopNodeData = x, this.saveTextToParentTag = g, this.addChild = m, this.ignoreAttributesFn = o(this.options.ignoreAttributes), this.entityExpansionCount = 0, this.currentExpandedLength = 0, this.options.stopNodes && this.options.stopNodes.length > 0) {
				this.stopNodesExact = /* @__PURE__ */ new Set(), this.stopNodesWildcard = /* @__PURE__ */ new Set();
				for (let e = 0; e < this.options.stopNodes.length; e++) {
					let t = this.options.stopNodes[e];
					typeof t == "string" && (t.startsWith("*.") ? this.stopNodesWildcard.add(t.substring(2)) : this.stopNodesExact.add(t));
				}
			}
		}
	};
	function c(e) {
		let t = Object.keys(e);
		for (let n = 0; n < t.length; n++) {
			let r = t[n], i = r.replace(/[.\-+*:]/g, "\\.");
			this.lastEntities[r] = {
				regex: RegExp("&" + i + ";", "g"),
				val: e[r]
			};
		}
	}
	function l(e, t, n, r, i, a, o) {
		if (e !== void 0 && (this.options.trimValues && !r && (e = e.trim()), e.length > 0)) {
			o || (e = this.replaceEntitiesValue(e, t, n));
			let r = this.options.tagValueProcessor(t, e, n, i, a);
			return r == null ? e : typeof r != typeof e || r !== e ? r : this.options.trimValues || e.trim() === e ? S(e, this.options.parseTagValue, this.options.numberParseOptions) : e;
		}
	}
	function u(e) {
		if (this.options.removeNSPrefix) {
			let t = e.split(":"), n = e.charAt(0) === "/" ? "/" : "";
			if (t[0] === "xmlns") return "";
			t.length === 2 && (e = n + t[1]);
		}
		return e;
	}
	var d = /* @__PURE__ */ RegExp("([^\\s=]+)\\s*(=\\s*(['\"])([\\s\\S]*?)\\3)?", "gm");
	function f(e, t, r) {
		if (this.options.ignoreAttributes !== !0 && typeof e == "string") {
			let i = n.getAllMatches(e, d), a = i.length, o = {};
			for (let e = 0; e < a; e++) {
				let n = this.resolveNameSpace(i[e][1]);
				if (this.ignoreAttributesFn(n, t)) continue;
				let a = i[e][4], s = this.options.attributeNamePrefix + n;
				if (n.length) if (this.options.transformAttributeName && (s = this.options.transformAttributeName(s)), s = w(s, this.options), a !== void 0) {
					this.options.trimValues && (a = a.trim()), a = this.replaceEntitiesValue(a, r, t);
					let e = this.options.attributeValueProcessor(n, a, t);
					e == null ? o[s] = a : typeof e != typeof a || e !== a ? o[s] = e : o[s] = S(a, this.options.parseAttributeValue, this.options.numberParseOptions);
				} else this.options.allowBooleanAttributes && (o[s] = !0);
			}
			if (!Object.keys(o).length) return;
			if (this.options.attributesGroupName) {
				let e = {};
				return e[this.options.attributesGroupName] = o, e;
			}
			return o;
		}
	}
	var p = function(e) {
		e = e.replace(/\r\n?/g, "\n");
		let t = new r("!xml"), n = t, a = "", o = "";
		this.entityExpansionCount = 0, this.currentExpandedLength = 0;
		let s = new i(this.options.processEntities);
		for (let i = 0; i < e.length; i++) if (e[i] === "<") if (e[i + 1] === "/") {
			let t = y(e, ">", i, "Closing Tag is not closed."), r = e.substring(i + 2, t).trim();
			if (this.options.removeNSPrefix) {
				let e = r.indexOf(":");
				e !== -1 && (r = r.substr(e + 1));
			}
			this.options.transformTagName && (r = this.options.transformTagName(r)), n && (a = this.saveTextToParentTag(a, n, o));
			let s = o.substring(o.lastIndexOf(".") + 1);
			if (r && this.options.unpairedTags.indexOf(r) !== -1) throw Error(`Unpaired tag can not be used as closing tag: </${r}>`);
			let c = 0;
			s && this.options.unpairedTags.indexOf(s) !== -1 ? (c = o.lastIndexOf(".", o.lastIndexOf(".") - 1), this.tagsNodeStack.pop()) : c = o.lastIndexOf("."), o = o.substring(0, c), n = this.tagsNodeStack.pop(), a = "", i = t;
		} else if (e[i + 1] === "?") {
			let t = b(e, i, !1, "?>");
			if (!t) throw Error("Pi Tag is not closed.");
			if (a = this.saveTextToParentTag(a, n, o), !(this.options.ignoreDeclaration && t.tagName === "?xml" || this.options.ignorePiTags)) {
				let e = new r(t.tagName);
				e.add(this.options.textNodeName, ""), t.tagName !== t.tagExp && t.attrExpPresent && (e[":@"] = this.buildAttributesMap(t.tagExp, o, t.tagName)), this.addChild(n, e, o, i);
			}
			i = t.closeIndex + 1;
		} else if (e.substr(i + 1, 3) === "!--") {
			let t = y(e, "-->", i + 4, "Comment is not closed.");
			if (this.options.commentPropName) {
				let r = e.substring(i + 4, t - 2);
				a = this.saveTextToParentTag(a, n, o), n.add(this.options.commentPropName, [{ [this.options.textNodeName]: r }]);
			}
			i = t;
		} else if (e.substr(i + 1, 2) === "!D") {
			let t = s.readDocType(e, i);
			this.docTypeEntities = t.entities, i = t.i;
		} else if (e.substr(i + 1, 2) === "![") {
			let t = y(e, "]]>", i, "CDATA is not closed.") - 2, r = e.substring(i + 9, t);
			a = this.saveTextToParentTag(a, n, o);
			let s = this.parseTextData(r, n.tagname, o, !0, !1, !0, !0);
			s ??= "", this.options.cdataPropName ? n.add(this.options.cdataPropName, [{ [this.options.textNodeName]: r }]) : n.add(this.options.textNodeName, s), i = t + 2;
		} else {
			let s = b(e, i, this.options.removeNSPrefix), c = s.tagName, l = s.rawTagName, u = s.tagExp, d = s.attrExpPresent, f = s.closeIndex;
			if (this.options.transformTagName) {
				let e = this.options.transformTagName(c);
				u === c && (u = e), c = e;
			}
			if (this.options.strictReservedNames && (c === this.options.commentPropName || c === this.options.cdataPropName || c === this.options.textNodeName || c === this.options.attributesGroupName)) throw Error(`Invalid tag name: ${c}`);
			n && a && n.tagname !== "!xml" && (a = this.saveTextToParentTag(a, n, o, !1));
			let p = n;
			p && this.options.unpairedTags.indexOf(p.tagname) !== -1 && (n = this.tagsNodeStack.pop(), o = o.substring(0, o.lastIndexOf("."))), c !== t.tagname && (o += o ? "." + c : c);
			let m = i;
			if (this.isItStopNode(this.stopNodesExact, this.stopNodesWildcard, o, c)) {
				let t = "";
				if (u.length > 0 && u.lastIndexOf("/") === u.length - 1) c[c.length - 1] === "/" ? (c = c.substr(0, c.length - 1), o = o.substr(0, o.length - 1), u = c) : u = u.substr(0, u.length - 1), i = s.closeIndex;
				else if (this.options.unpairedTags.indexOf(c) !== -1) i = s.closeIndex;
				else {
					let n = this.readStopNodeData(e, l, f + 1);
					if (!n) throw Error(`Unexpected end of ${l}`);
					i = n.i, t = n.tagContent;
				}
				let a = new r(c);
				c !== u && d && (a[":@"] = this.buildAttributesMap(u, o, c)), t &&= this.parseTextData(t, c, o, !0, d, !0, !0), o = o.substr(0, o.lastIndexOf(".")), a.add(this.options.textNodeName, t), this.addChild(n, a, o, m);
			} else {
				if (u.length > 0 && u.lastIndexOf("/") === u.length - 1) {
					if (c[c.length - 1] === "/" ? (c = c.substr(0, c.length - 1), o = o.substr(0, o.length - 1), u = c) : u = u.substr(0, u.length - 1), this.options.transformTagName) {
						let e = this.options.transformTagName(c);
						u === c && (u = e), c = e;
					}
					let e = new r(c);
					c !== u && d && (e[":@"] = this.buildAttributesMap(u, o, c)), this.addChild(n, e, o, m), o = o.substr(0, o.lastIndexOf("."));
				} else if (this.options.unpairedTags.indexOf(c) !== -1) {
					let e = new r(c);
					c !== u && d && (e[":@"] = this.buildAttributesMap(u, o)), this.addChild(n, e, o, m), o = o.substr(0, o.lastIndexOf(".")), i = s.closeIndex;
					continue;
				} else {
					let e = new r(c);
					if (this.tagsNodeStack.length > this.options.maxNestedTags) throw Error("Maximum nested tags exceeded");
					this.tagsNodeStack.push(n), c !== u && d && (e[":@"] = this.buildAttributesMap(u, o, c)), this.addChild(n, e, o), n = e;
				}
				a = "", i = f;
			}
		}
		else a += e[i];
		return t.child;
	};
	function m(e, t, n, r) {
		this.options.captureMetaData || (r = void 0);
		let i = this.options.updateTag(t.tagname, n, t[":@"]);
		i === !1 || (typeof i == "string" && (t.tagname = i), e.addChild(t, r));
	}
	var h = function(e, t, n) {
		if (e.indexOf("&") === -1) return e;
		let r = this.options.processEntities;
		if (!r.enabled || r.allowedTags && !r.allowedTags.includes(t) || r.tagFilter && !r.tagFilter(t, n)) return e;
		for (let t in this.docTypeEntities) {
			let n = this.docTypeEntities[t], i = e.match(n.regx);
			if (i) {
				if (this.entityExpansionCount += i.length, r.maxTotalExpansions && this.entityExpansionCount > r.maxTotalExpansions) throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${r.maxTotalExpansions}`);
				let t = e.length;
				if (e = e.replace(n.regx, n.val), r.maxExpandedLength && (this.currentExpandedLength += e.length - t, this.currentExpandedLength > r.maxExpandedLength)) throw Error(`Total expanded content size exceeded: ${this.currentExpandedLength} > ${r.maxExpandedLength}`);
			}
		}
		if (e.indexOf("&") === -1) return e;
		for (let t of Object.keys(this.lastEntities)) {
			let n = this.lastEntities[t], i = e.match(n.regex);
			if (i && (this.entityExpansionCount += i.length, r.maxTotalExpansions && this.entityExpansionCount > r.maxTotalExpansions)) throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${r.maxTotalExpansions}`);
			e = e.replace(n.regex, n.val);
		}
		if (e.indexOf("&") === -1) return e;
		if (this.options.htmlEntities) for (let t of Object.keys(this.htmlEntities)) {
			let n = this.htmlEntities[t], i = e.match(n.regex);
			if (i && (this.entityExpansionCount += i.length, r.maxTotalExpansions && this.entityExpansionCount > r.maxTotalExpansions)) throw Error(`Entity expansion limit exceeded: ${this.entityExpansionCount} > ${r.maxTotalExpansions}`);
			e = e.replace(n.regex, n.val);
		}
		return e = e.replace(this.ampEntity.regex, this.ampEntity.val), e;
	};
	function g(e, t, n, r) {
		return e &&= (r === void 0 && (r = t.child.length === 0), e = this.parseTextData(e, t.tagname, n, !1, t[":@"] ? Object.keys(t[":@"]).length !== 0 : !1, r), e !== void 0 && e !== "" && t.add(this.options.textNodeName, e), ""), e;
	}
	function _(e, t, n, r) {
		return !!(t && t.has(r) || e && e.has(n));
	}
	function v(e, t, n = ">") {
		let r, i = "";
		for (let a = t; a < e.length; a++) {
			let t = e[a];
			if (r) t === r && (r = "");
			else if (t === "\"" || t === "'") r = t;
			else if (t === n[0]) if (n[1]) {
				if (e[a + 1] === n[1]) return {
					data: i,
					index: a
				};
			} else return {
				data: i,
				index: a
			};
			else t === "	" && (t = " ");
			i += t;
		}
	}
	function y(e, t, n, r) {
		let i = e.indexOf(t, n);
		if (i === -1) throw Error(r);
		return i + t.length - 1;
	}
	function b(e, t, n, r = ">") {
		let i = v(e, t + 1, r);
		if (!i) return;
		let a = i.data, o = i.index, s = a.search(/\s/), c = a, l = !0;
		s !== -1 && (c = a.substring(0, s), a = a.substring(s + 1).trimStart());
		let u = c;
		if (n) {
			let e = c.indexOf(":");
			e !== -1 && (c = c.substr(e + 1), l = c !== i.data.substr(e + 1));
		}
		return {
			tagName: c,
			tagExp: a,
			closeIndex: o,
			attrExpPresent: l,
			rawTagName: u
		};
	}
	function x(e, t, n) {
		let r = n, i = 1;
		for (; n < e.length; n++) if (e[n] === "<") if (e[n + 1] === "/") {
			let a = y(e, ">", n, `${t} is not closed`);
			if (e.substring(n + 2, a).trim() === t && (i--, i === 0)) return {
				tagContent: e.substring(r, n),
				i: a
			};
			n = a;
		} else if (e[n + 1] === "?") n = y(e, "?>", n + 1, "StopNode is not closed.");
		else if (e.substr(n + 1, 3) === "!--") n = y(e, "-->", n + 3, "StopNode is not closed.");
		else if (e.substr(n + 1, 2) === "![") n = y(e, "]]>", n, "StopNode is not closed.") - 2;
		else {
			let r = b(e, n, ">");
			r && ((r && r.tagName) === t && r.tagExp[r.tagExp.length - 1] !== "/" && i++, n = r.closeIndex);
		}
	}
	function S(e, t, r) {
		if (t && typeof e == "string") {
			let t = e.trim();
			return t === "true" ? !0 : t === "false" ? !1 : a(e, r);
		} else if (n.isExist(e)) return e;
		else return "";
	}
	function C(e, t, n) {
		let r = Number.parseInt(e, t);
		return r >= 0 && r <= 1114111 ? String.fromCodePoint(r) : n + e + ";";
	}
	function w(e, t) {
		if (n.criticalProperties.includes(e)) throw Error(`[SECURITY] Invalid name: "${e}" is a reserved JavaScript keyword that could cause prototype pollution`);
		return n.DANGEROUS_PROPERTY_NAMES.includes(e) ? t.onDangerousProperty(e) : e;
	}
	t.exports = s;
})), jn = /* @__PURE__ */ t(((e) => {
	function t(e, t) {
		return n(e, t);
	}
	function n(e, t, o) {
		let s, c = {};
		for (let l = 0; l < e.length; l++) {
			let u = e[l], d = r(u), f = "";
			if (f = o === void 0 ? d : o + "." + d, d === t.textNodeName) s === void 0 ? s = u[d] : s += "" + u[d];
			else if (d === void 0) continue;
			else if (u[d]) {
				let e = n(u[d], t, f), r = a(e, t);
				u[":@"] ? i(e, u[":@"], f, t) : Object.keys(e).length === 1 && e[t.textNodeName] !== void 0 && !t.alwaysCreateTextNode ? e = e[t.textNodeName] : Object.keys(e).length === 0 && (t.alwaysCreateTextNode ? e[t.textNodeName] = "" : e = ""), c[d] !== void 0 && c.hasOwnProperty(d) ? (Array.isArray(c[d]) || (c[d] = [c[d]]), c[d].push(e)) : t.isArray(d, f, r) ? c[d] = [e] : c[d] = e;
			}
		}
		return typeof s == "string" ? s.length > 0 && (c[t.textNodeName] = s) : s !== void 0 && (c[t.textNodeName] = s), c;
	}
	function r(e) {
		let t = Object.keys(e);
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			if (n !== ":@") return n;
		}
	}
	function i(e, t, n, r) {
		if (t) {
			let i = Object.keys(t), a = i.length;
			for (let o = 0; o < a; o++) {
				let a = i[o];
				r.isArray(a, n + "." + a, !0, !0) ? e[a] = [t[a]] : e[a] = t[a];
			}
		}
	}
	function a(e, t) {
		let { textNodeName: n } = t, r = Object.keys(e).length;
		return !!(r === 0 || r === 1 && (e[n] || typeof e[n] == "boolean" || e[n] === 0));
	}
	e.prettify = t;
})), Mn = /* @__PURE__ */ t(((e, t) => {
	var { buildOptions: n } = Tn(), r = An(), { prettify: i } = jn(), a = wn();
	t.exports = class {
		constructor(e) {
			this.externalEntities = {}, this.options = n(e);
		}
		parse(e, t) {
			if (typeof e != "string") if (e.toString) e = e.toString();
			else throw Error("XML data is accepted in String or Bytes[] form.");
			if (t) {
				t === !0 && (t = {});
				let n = a.validate(e, t);
				if (n !== !0) throw Error(`${n.err.msg}:${n.err.line}:${n.err.col}`);
			}
			let n = new r(this.options);
			n.addExternalEntities(this.externalEntities);
			let o = n.parseXml(e);
			return this.options.preserveOrder || o === void 0 ? o : i(o, this.options);
		}
		addEntity(e, t) {
			if (t.indexOf("&") !== -1) throw Error("Entity value can't have '&'");
			if (e.indexOf("&") !== -1 || e.indexOf(";") !== -1) throw Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
			if (t === "&") throw Error("An entity with value '&' is not permitted");
			this.externalEntities[e] = t;
		}
	};
})), Nn = /* @__PURE__ */ t(((e, t) => {
	var n = "\n";
	function r(e, t) {
		let r = "";
		return t.format && t.indentBy.length > 0 && (r = n), i(e, t, "", r);
	}
	function i(e, t, n, r) {
		let l = "", u = !1;
		if (!Array.isArray(e)) {
			if (e != null) {
				let n = e.toString();
				return n = c(n, t), n;
			}
			return "";
		}
		for (let d = 0; d < e.length; d++) {
			let f = e[d], p = a(f);
			if (p === void 0) continue;
			let m = "";
			if (m = n.length === 0 ? p : `${n}.${p}`, p === t.textNodeName) {
				let e = f[p];
				s(m, t) || (e = t.tagValueProcessor(p, e), e = c(e, t)), u && (l += r), l += e, u = !1;
				continue;
			} else if (p === t.cdataPropName) {
				u && (l += r), l += `<![CDATA[${f[p][0][t.textNodeName]}]]>`, u = !1;
				continue;
			} else if (p === t.commentPropName) {
				l += r + `<!--${f[p][0][t.textNodeName]}-->`, u = !0;
				continue;
			} else if (p[0] === "?") {
				let e = o(f[":@"], t), n = p === "?xml" ? "" : r, i = f[p][0][t.textNodeName];
				i = i.length === 0 ? "" : " " + i, l += n + `<${p}${i}${e}?>`, u = !0;
				continue;
			}
			let h = r;
			h !== "" && (h += t.indentBy);
			let g = r + `<${p}${o(f[":@"], t)}`, _ = i(f[p], t, m, h);
			t.unpairedTags.indexOf(p) === -1 ? (!_ || _.length === 0) && t.suppressEmptyNode ? l += g + "/>" : _ && _.endsWith(">") ? l += g + `>${_}${r}</${p}>` : (l += g + ">", _ && r !== "" && (_.includes("/>") || _.includes("</")) ? l += r + t.indentBy + _ + r : l += _, l += `</${p}>`) : t.suppressUnpairedNode ? l += g + ">" : l += g + "/>", u = !0;
		}
		return l;
	}
	function a(e) {
		let t = Object.keys(e);
		for (let n = 0; n < t.length; n++) {
			let r = t[n];
			if (Object.prototype.hasOwnProperty.call(e, r) && r !== ":@") return r;
		}
	}
	function o(e, t) {
		let n = "";
		if (e && !t.ignoreAttributes) for (let r in e) {
			if (!Object.prototype.hasOwnProperty.call(e, r)) continue;
			let i = t.attributeValueProcessor(r, e[r]);
			i = c(i, t), i === !0 && t.suppressBooleanAttributes ? n += ` ${r.substr(t.attributeNamePrefix.length)}` : n += ` ${r.substr(t.attributeNamePrefix.length)}="${i}"`;
		}
		return n;
	}
	function s(e, t) {
		e = e.substr(0, e.length - t.textNodeName.length - 1);
		let n = e.substr(e.lastIndexOf(".") + 1);
		for (let r in t.stopNodes) if (t.stopNodes[r] === e || t.stopNodes[r] === "*." + n) return !0;
		return !1;
	}
	function c(e, t) {
		if (e && e.length > 0 && t.processEntities) for (let n = 0; n < t.entities.length; n++) {
			let r = t.entities[n];
			e = e.replace(r.regex, r.val);
		}
		return e;
	}
	t.exports = r;
})), Pn = /* @__PURE__ */ t(((e, t) => {
	var n = Nn(), r = kn(), i = {
		attributeNamePrefix: "@_",
		attributesGroupName: !1,
		textNodeName: "#text",
		ignoreAttributes: !0,
		cdataPropName: !1,
		format: !1,
		indentBy: "  ",
		suppressEmptyNode: !1,
		suppressUnpairedNode: !0,
		suppressBooleanAttributes: !0,
		tagValueProcessor: function(e, t) {
			return t;
		},
		attributeValueProcessor: function(e, t) {
			return t;
		},
		preserveOrder: !1,
		commentPropName: !1,
		unpairedTags: [],
		entities: [
			{
				regex: /* @__PURE__ */ RegExp("&", "g"),
				val: "&amp;"
			},
			{
				regex: /* @__PURE__ */ RegExp(">", "g"),
				val: "&gt;"
			},
			{
				regex: /* @__PURE__ */ RegExp("<", "g"),
				val: "&lt;"
			},
			{
				regex: /* @__PURE__ */ RegExp("'", "g"),
				val: "&apos;"
			},
			{
				regex: /* @__PURE__ */ RegExp("\"", "g"),
				val: "&quot;"
			}
		],
		processEntities: !0,
		stopNodes: [],
		oneListGroup: !1
	};
	function a(e) {
		this.options = Object.assign({}, i, e), this.options.ignoreAttributes === !0 || this.options.attributesGroupName ? this.isAttribute = function() {
			return !1;
		} : (this.ignoreAttributesFn = r(this.options.ignoreAttributes), this.attrPrefixLen = this.options.attributeNamePrefix.length, this.isAttribute = c), this.processTextOrObjNode = o, this.options.format ? (this.indentate = s, this.tagEndChar = ">\n", this.newLine = "\n") : (this.indentate = function() {
			return "";
		}, this.tagEndChar = ">", this.newLine = "");
	}
	a.prototype.build = function(e) {
		return this.options.preserveOrder ? n(e, this.options) : (Array.isArray(e) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1 && (e = { [this.options.arrayNodeName]: e }), this.j2x(e, 0, []).val);
	}, a.prototype.j2x = function(e, t, n) {
		let r = "", i = "", a = n.join(".");
		for (let o in e) if (Object.prototype.hasOwnProperty.call(e, o)) if (e[o] === void 0) this.isAttribute(o) && (i += "");
		else if (e[o] === null) this.isAttribute(o) || o === this.options.cdataPropName ? i += "" : o[0] === "?" ? i += this.indentate(t) + "<" + o + "?" + this.tagEndChar : i += this.indentate(t) + "<" + o + "/" + this.tagEndChar;
		else if (e[o] instanceof Date) i += this.buildTextValNode(e[o], o, "", t);
		else if (typeof e[o] != "object") {
			let n = this.isAttribute(o);
			if (n && !this.ignoreAttributesFn(n, a)) r += this.buildAttrPairStr(n, "" + e[o]);
			else if (!n) if (o === this.options.textNodeName) {
				let t = this.options.tagValueProcessor(o, "" + e[o]);
				i += this.replaceEntitiesValue(t);
			} else i += this.buildTextValNode(e[o], o, "", t);
		} else if (Array.isArray(e[o])) {
			let r = e[o].length, a = "", s = "";
			for (let c = 0; c < r; c++) {
				let r = e[o][c];
				if (r !== void 0) if (r === null) o[0] === "?" ? i += this.indentate(t) + "<" + o + "?" + this.tagEndChar : i += this.indentate(t) + "<" + o + "/" + this.tagEndChar;
				else if (typeof r == "object") if (this.options.oneListGroup) {
					let e = this.j2x(r, t + 1, n.concat(o));
					a += e.val, this.options.attributesGroupName && r.hasOwnProperty(this.options.attributesGroupName) && (s += e.attrStr);
				} else a += this.processTextOrObjNode(r, o, t, n);
				else if (this.options.oneListGroup) {
					let e = this.options.tagValueProcessor(o, r);
					e = this.replaceEntitiesValue(e), a += e;
				} else a += this.buildTextValNode(r, o, "", t);
			}
			this.options.oneListGroup && (a = this.buildObjectNode(a, o, s, t)), i += a;
		} else if (this.options.attributesGroupName && o === this.options.attributesGroupName) {
			let t = Object.keys(e[o]), n = t.length;
			for (let i = 0; i < n; i++) r += this.buildAttrPairStr(t[i], "" + e[o][t[i]]);
		} else i += this.processTextOrObjNode(e[o], o, t, n);
		return {
			attrStr: r,
			val: i
		};
	}, a.prototype.buildAttrPairStr = function(e, t) {
		return t = this.options.attributeValueProcessor(e, "" + t), t = this.replaceEntitiesValue(t), this.options.suppressBooleanAttributes && t === "true" ? " " + e : " " + e + "=\"" + t + "\"";
	};
	function o(e, t, n, r) {
		let i = this.j2x(e, n + 1, r.concat(t));
		return e[this.options.textNodeName] !== void 0 && Object.keys(e).length === 1 ? this.buildTextValNode(e[this.options.textNodeName], t, i.attrStr, n) : this.buildObjectNode(i.val, t, i.attrStr, n);
	}
	a.prototype.buildObjectNode = function(e, t, n, r) {
		if (e === "") return t[0] === "?" ? this.indentate(r) + "<" + t + n + "?" + this.tagEndChar : this.indentate(r) + "<" + t + n + this.closeTag(t) + this.tagEndChar;
		{
			let i = "</" + t + this.tagEndChar, a = "";
			return t[0] === "?" && (a = "?", i = ""), (n || n === "") && e.indexOf("<") === -1 ? this.indentate(r) + "<" + t + n + a + ">" + e + i : this.options.commentPropName !== !1 && t === this.options.commentPropName && a.length === 0 ? this.indentate(r) + `<!--${e}-->` + this.newLine : this.indentate(r) + "<" + t + n + a + this.tagEndChar + e + this.indentate(r) + i;
		}
	}, a.prototype.closeTag = function(e) {
		let t = "";
		return this.options.unpairedTags.indexOf(e) === -1 ? t = this.options.suppressEmptyNode ? "/" : `></${e}` : this.options.suppressUnpairedNode || (t = "/"), t;
	}, a.prototype.buildTextValNode = function(e, t, n, r) {
		if (this.options.cdataPropName !== !1 && t === this.options.cdataPropName) return this.indentate(r) + `<![CDATA[${e}]]>` + this.newLine;
		if (this.options.commentPropName !== !1 && t === this.options.commentPropName) return this.indentate(r) + `<!--${e}-->` + this.newLine;
		if (t[0] === "?") return this.indentate(r) + "<" + t + n + "?" + this.tagEndChar;
		{
			let i = this.options.tagValueProcessor(t, e);
			return i = this.replaceEntitiesValue(i), i === "" ? this.indentate(r) + "<" + t + n + this.closeTag(t) + this.tagEndChar : this.indentate(r) + "<" + t + n + ">" + i + "</" + t + this.tagEndChar;
		}
	}, a.prototype.replaceEntitiesValue = function(e) {
		if (e && e.length > 0 && this.options.processEntities) for (let t = 0; t < this.options.entities.length; t++) {
			let n = this.options.entities[t];
			e = e.replace(n.regex, n.val);
		}
		return e;
	};
	function s(e) {
		return this.options.indentBy.repeat(e);
	}
	function c(e) {
		return e.startsWith(this.options.attributeNamePrefix) && e !== this.options.textNodeName ? e.substr(this.attrPrefixLen) : !1;
	}
	t.exports = a;
})), Fn = /* @__PURE__ */ t(((e, t) => {
	var n = wn();
	t.exports = {
		XMLParser: Mn(),
		XMLValidator: n,
		XMLBuilder: Pn()
	};
})), In = /* @__PURE__ */ t(((e) => {
	e.byteLength = c, e.toByteArray = u, e.fromByteArray = p;
	for (var t = [], n = [], r = typeof Uint8Array < "u" ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, o = i.length; a < o; ++a) t[a] = i[a], n[i.charCodeAt(a)] = a;
	n[45] = 62, n[95] = 63;
	function s(e) {
		var t = e.length;
		if (t % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
		var n = e.indexOf("=");
		n === -1 && (n = t);
		var r = n === t ? 0 : 4 - n % 4;
		return [n, r];
	}
	function c(e) {
		var t = s(e), n = t[0], r = t[1];
		return (n + r) * 3 / 4 - r;
	}
	function l(e, t, n) {
		return (t + n) * 3 / 4 - n;
	}
	function u(e) {
		var t, i = s(e), a = i[0], o = i[1], c = new r(l(e, a, o)), u = 0, d = o > 0 ? a - 4 : a, f;
		for (f = 0; f < d; f += 4) t = n[e.charCodeAt(f)] << 18 | n[e.charCodeAt(f + 1)] << 12 | n[e.charCodeAt(f + 2)] << 6 | n[e.charCodeAt(f + 3)], c[u++] = t >> 16 & 255, c[u++] = t >> 8 & 255, c[u++] = t & 255;
		return o === 2 && (t = n[e.charCodeAt(f)] << 2 | n[e.charCodeAt(f + 1)] >> 4, c[u++] = t & 255), o === 1 && (t = n[e.charCodeAt(f)] << 10 | n[e.charCodeAt(f + 1)] << 4 | n[e.charCodeAt(f + 2)] >> 2, c[u++] = t >> 8 & 255, c[u++] = t & 255), c;
	}
	function d(e) {
		return t[e >> 18 & 63] + t[e >> 12 & 63] + t[e >> 6 & 63] + t[e & 63];
	}
	function f(e, t, n) {
		for (var r, i = [], a = t; a < n; a += 3) r = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (e[a + 2] & 255), i.push(d(r));
		return i.join("");
	}
	function p(e) {
		for (var n, r = e.length, i = r % 3, a = [], o = 16383, s = 0, c = r - i; s < c; s += o) a.push(f(e, s, s + o > c ? c : s + o));
		return i === 1 ? (n = e[r - 1], a.push(t[n >> 2] + t[n << 4 & 63] + "==")) : i === 2 && (n = (e[r - 2] << 8) + e[r - 1], a.push(t[n >> 10] + t[n >> 4 & 63] + t[n << 2 & 63] + "=")), a.join("");
	}
})), Ln = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.parse = void 0;
	var t = Fn(), n = In(), r = new t.XMLParser({
		preserveOrder: !0,
		ignoreDeclaration: !0,
		ignorePiTags: !0,
		parseTagValue: !1,
		cdataPropName: "#cdata"
	}), i = (e) => e == null || e === "", a = (e) => {
		let t = Object.keys(e);
		if (t.length !== 1) throw Error("An object must only contain a tag name and no properties.");
		let r = t[0], o = e[r]?.[0]?.["#text"];
		switch (r) {
			case "dict":
				let t = e[r]?.length;
				if (t === 0) return {};
				if (t > 1 && t % 2 == 1) throw Error("Invalid dictionary.");
				let s = {};
				for (let n = 0; n < t; n += 2) {
					let t = e[r][n], i = e[r][n + 1];
					if (!t.hasOwnProperty("key")) throw Error("Expected <key>");
					if (!i) throw Error("Value missing for key inside <dict>");
					let o = t?.key?.[0]?.["#text"] || "";
					if (o === "__proto__") throw Error("Attempted prototype pollution.");
					s[o] = a(i);
				}
				return s;
			case "array": return e[r]?.map(a);
			case "string":
				let c = e[r];
				return c.length === 0 ? "" : c.reduce((e, t) => (t.hasOwnProperty("#cdata") && (e += t["#cdata"].reduce((e, t) => e + t["#text"], "")), t.hasOwnProperty("#text") && (e += t["#text"]), e), "");
			case "integer":
				if (i(o)) throw Error("Encountered empty <integer>");
				return o > 2 ** 53 - 1 ? BigInt(o) : parseInt(o);
			case "real":
				if (i(o)) throw Error("Encountered empty <real>");
				return parseFloat(o);
			case "data": return i(o) ? new Uint8Array([]).buffer : (0, n.toByteArray)(o.replace(/[\s\r\n\t]*/g, "")).buffer;
			case "date":
				if (i(o)) throw Error("Encountered empty <date>");
				return new Date(o);
			case "true": return !0;
			case "false": return !1;
		}
		throw Error("Invalid type.");
	};
	e.parse = (e) => {
		let t = r.parse(e);
		if (!Array.isArray(t)) throw Error("Invalid XML.");
		let n = t.filter((e) => e.hasOwnProperty("plist"));
		if (n.length !== 1) throw Error("The document must contain exactly one plist tag.");
		let i = n[0].plist;
		if (!Array.isArray(i)) throw Error("plist tag must contain objects.");
		if (i.length !== 1) throw Error("plist tag must contain exactly one object.");
		return a(i[0]);
	};
})), Rn = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.parse = void 0;
	var t = /[A-Za-z0-9_$+\/:.-]/, n = /[A-Fa-f0-9]/, r = [
		" ",
		"	",
		"\n",
		"\r"
	], i = (e) => JSON.parse(`"${e}"`), a = (e, t, n = !1) => {
		if ([, e] = o(e), !e.startsWith(t)) {
			if (n) return [null, e];
			throw Error(`Expected '${t}'`);
		}
		return e = e.substring(t.length), [, e] = o(e), [t, e];
	}, o = (e) => {
		let t;
		for (; e.length > 0;) {
			if (t) if (e.startsWith(t)) e = e.substring(t.length), t = void 0;
			else {
				e = e.substring(1);
				continue;
			}
			let n = e.substring(0, 1);
			if (e = e.substring(1), !r.includes(n)) switch (n) {
				case "/":
					switch (e.charAt(0)) {
						case "*":
							t = "*/";
							break;
						case "/":
							t = "\n";
							break;
						default: throw Error("Unexpected '/'");
					}
					break;
				default: return [null, n + e];
			}
		}
		return [null, e];
	}, s = (e) => {
		if ([, e] = o(e), e.length === 0) return [null, ""];
		let c = null, l = e.substring(0, 1);
		switch (e = e.substring(1), l) {
			case "{":
				if (c = {}, [, e] = o(e), e.charAt(0) === "}") {
					[, e] = a(e, "}");
					break;
				}
				for (; e.charAt(0) !== "}";) {
					let t, n;
					if ([t, e] = s(e), typeof t != "string") throw Error("Expected string key");
					if (t === "__proto__") throw Error("Attempted prototype pollution");
					if ([, e] = a(e, "="), [n, e] = s(e), c[t] = n, [, e] = a(e, ";"), e.length === 0) throw Error("No matching '}' found");
				}
				[, e] = a(e, "}");
				break;
			case "(":
				if (c = [], [, e] = o(e), e.charAt(0) === ")") {
					[, e] = a(e, ")");
					break;
				}
				for (; e.charAt(0) !== ")";) {
					let t, n;
					if ([t, e] = s(e), c.push(t), [n, e] = a(e, ",", !0), !n) break;
					if (e.length === 0) throw Error("No matching ')' found");
				}
				[, e] = a(e, ")");
				break;
			case "<":
				let u = "";
				if ([, e] = o(e), e.charAt(0) === ">") {
					[, e] = a(e, ">");
					break;
				}
				for (; e.charAt(0) !== ">";) {
					let t = e.charAt(0);
					if (e = e.substring(1), n.test(t)) u += t;
					else if (r.includes(t)) continue;
					else throw Error(`Unexpected '${t}'`);
					if (e.length === 0) throw Error("No matching '>' found");
				}
				if (u.length > 0) {
					if (u.length % 2 == 1) throw Error("Data must contain hex digits grouped in pairs");
					let e = u.match(/../g);
					e !== null && (c = new Uint8Array(e.map((e) => parseInt(e, 16))).buffer);
				}
				[, e] = a(e, ">");
				break;
			case "\"":
			case "'":
				for (c = ""; e.charAt(0) !== l;) if (c += e.charAt(0), e.charAt(0) === "\\" ? (c += e.charAt(1), e = e.substring(2)) : e = e.substring(1), e.length === 0) throw Error(`No matching ${l} found`);
				c = i(c), [, e] = a(e, l);
				break;
			default:
				if (!t.test(l)) throw Error(`Unexpected '${l}'`);
				for (c = l; t.test(e.charAt(0)) && (c += e.charAt(0), e = e.substring(1), e.length !== 0););
		}
		return [, e] = o(e), [c, e];
	};
	e.parse = (e) => {
		let [t, n] = s(e);
		if (n.length > 0) throw Error("Unexpected content at the end of file");
		if (t === void 0) throw Error("Parsing failed");
		return t;
	};
})), zn = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.parse = e.detectFormat = void 0;
	var t = xn(), n = Sn(), r = Ln(), i = Rn(), a = /^[\u0000-\u007f]*$/, o = new TextDecoder("utf-8");
	e.detectFormat = (n) => {
		if (typeof n == "string") {
			if (n.startsWith(t.HEADER_BINARY)) return t.PlistFormat.BINARY;
			let e = n.substring(0, 16).replace(/[\s\t\n\r]+/g, "");
			if (e.startsWith("<?xml") || e.startsWith("<plist")) return t.PlistFormat.XML;
			if (n.trimStart().startsWith(t.HEADER_OPENSTEP_UTF8) || a.test(e)) return t.PlistFormat.OPENSTEP;
			throw Error("Unknown format");
		} else {
			let r = n.slice(0, t.HEADER_BINARY.length);
			return o.decode(r) === t.HEADER_BINARY ? t.PlistFormat.BINARY : (0, e.detectFormat)(o.decode(n.slice(0, 16)));
		}
	}, e.parse = (a) => {
		switch ((0, e.detectFormat)(a)) {
			case t.PlistFormat.BINARY:
				if (typeof a == "string") throw Error("Binary plists must be passed as ArrayBuffer");
				return (0, n.parse)(a);
			case t.PlistFormat.XML: return a instanceof ArrayBuffer ? (0, r.parse)(o.decode(a)) : (0, r.parse)(a);
			case t.PlistFormat.OPENSTEP: return a instanceof ArrayBuffer ? (0, i.parse)(o.decode(a)) : (0, i.parse)(a);
		}
		throw Error("Unsupported format");
	};
})), Bn = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.serialize = void 0;
	var t = xn(), n = new TextEncoder(), r = new Uint8Array([
		0,
		0,
		0,
		0,
		0,
		0
	]), i = (e) => Uint8Array.from(e.match(/.{1,2}/g).map((e) => parseInt(e, 16))), a = (e) => !!e && typeof e == "object" && Object.keys(e).length == 1 && typeof e.CF$UID == "number", o = (e) => {
		let t = /* @__PURE__ */ new ArrayBuffer(e.length * 2), n = new Uint16Array(t);
		for (let t = 0, r = e.length; t < r; t++) n[t] = e.charCodeAt(t);
		return new Uint8Array(t);
	}, s = (e, t) => {
		let n = new Uint8Array(e.length + t.length);
		return n.set(e), n.set(t, e.length), n;
	}, c = (e, t, n) => {
		let r = new Uint8Array(e.length + n), i = new DataView(r.buffer);
		switch (r.set(e), n) {
			case 1:
				i.setUint8(e.length, Number(t));
				break;
			case 2:
				i.setUint16(e.length, Number(t), !1);
				break;
			case 4:
				i.setUint32(e.length, Number(t), !1);
				break;
			case 8:
				i.setBigUint64(e.length, BigInt(t), !1);
				break;
			default: throw Error("Unsupported int size");
		}
		return r;
	}, l = (e, t, n) => {
		let r = new Uint8Array(e.length + n), i = new DataView(r.buffer);
		switch (r.set(e), n) {
			case 1:
				i.setInt8(e.length, Number(t));
				break;
			case 2:
				i.setInt16(e.length, Number(t), !1);
				break;
			case 4:
				i.setInt32(e.length, Number(t), !1);
				break;
			case 8:
				i.setBigInt64(e.length, BigInt(t), !1);
				break;
			default: throw Error("Unsupported int size");
		}
		return r;
	}, u = (e, t) => {
		let n = new Uint8Array(e.length + 8), r = new DataView(n.buffer);
		return n.set(e), r.setFloat64(e.length, t), n;
	};
	e.serialize = (e) => {
		let d = n.encode(t.HEADER_BINARY);
		e instanceof Array && e.length === 1 && (e = e[0]);
		let p = f(e), m = g(p.length), _ = [], v, y;
		return b(), p.forEach((e, t) => {
			_[t] = d.byteLength, e == null ? d = c(d, 0, 1) : C(e);
		}), S(), x(), d.buffer;
		function b() {
			let e = {}, t = 0;
			p.forEach((n) => {
				n.id || (typeof n.value == "string" ? e.hasOwnProperty(n.value) ? (n.type = "stringref", n.id = e[n.value]) : e[n.value] = n.id = t++ : n.id = t++);
			}), p = p.filter((e) => e.type !== "stringref");
		}
		function x() {
			d = s(d, r), d = s(d, new Uint8Array([v, m])), d = c(d, BigInt(p.length), 8), d = c(d, BigInt("0"), 8), d = c(d, BigInt(y), 8);
		}
		function S() {
			y = d.byteLength, v = h(y), _.forEach((e) => {
				d = c(d, e, v);
			});
		}
		function C(e) {
			if (e.type === "primitive") {
				let t = e.value;
				switch (typeof t) {
					case "number":
					case "bigint":
						E(t);
						break;
					case "string":
						A(t);
						break;
					case "boolean":
						k(t);
						break;
				}
				t instanceof Date ? w(t) : t instanceof ArrayBuffer ? j(t) : a(t) && D(t.CF$UID);
				return;
			}
			switch (e.type) {
				case "dict":
					T(e);
					break;
				case "array":
					O(e);
					break;
				default: throw Error("unhandled entry type: " + e.type);
			}
		}
		function w(e) {
			d = c(d, 51, 1);
			let n = (e.getTime() - t.EPOCH) / 1e3;
			d = u(d, n);
		}
		function T(e) {
			M(13, e.entryKeys.length), e.entryKeys.forEach((e) => {
				N(e.id);
			}), e.entryValues.forEach((e) => {
				N(e.id);
			});
		}
		function E(e) {
			if (typeof e == "bigint") {
				let t = i(e.toString(16).padStart(32, "0").slice(0, 32));
				d = c(d, 20, 1), d = s(d, t);
			} else Number.isInteger(e) ? e < 0 ? (d = c(d, 19, 1), d = l(d, e, 8)) : e <= 255 ? (d = c(d, 16, 1), d = c(d, e, 1)) : e <= 65535 ? (d = c(d, 17, 1), d = c(d, e, 2)) : e <= 4294967295 ? (d = c(d, 18, 1), d = c(d, e, 4)) : (d = c(d, 19, 1), d = c(d, e, 8)) : (d = c(d, 35, 1), d = u(d, e));
		}
		function D(e) {
			M(8, 0), N(e);
		}
		function O(e) {
			M(10, e.entries.length), e.entries.forEach((e) => {
				N(e.id);
			});
		}
		function k(e) {
			d = c(d, e ? 9 : 8, 1);
		}
		function A(e) {
			if (P(e)) {
				let t = o(e);
				M(6, t.length / 2);
				for (let e = 0; e < t.length; e += 2) {
					let n = t[e + 0];
					t[e + 0] = t[e + 1], t[e + 1] = n;
				}
				d = s(d, t);
			} else {
				let t = n.encode(e);
				M(5, t.length), d = s(d, t);
			}
		}
		function j(e) {
			M(4, e.byteLength), d = s(d, new Uint8Array(e));
		}
		function M(e, t) {
			t < 15 ? d = c(d, (e << 4) + t, 1) : (d = c(d, (e << 4) + 15, 1), E(t));
		}
		function N(e) {
			d = c(d, e, m);
		}
		function P(e) {
			return n.encode(e).byteLength != e.length;
		}
	};
	var d = [
		"string",
		"number",
		"boolean",
		"bigint"
	];
	function f(e) {
		if (d.includes(typeof e) || e instanceof ArrayBuffer || e instanceof Date || a(e)) return [{
			type: "primitive",
			value: e
		}];
		if (typeof e == "object" && e) return Array.isArray(e) ? p(e) : m(e);
		throw Error("unhandled entry: " + e);
	}
	function p(e) {
		let t = e.map(f);
		return [{
			type: "array",
			value: void 0,
			entries: t.map((e) => e[0])
		}, ...t.flat()];
	}
	function m(e) {
		let t = Object.keys(e).map(f).flat(1), n = Object.values(e).map(f);
		return [
			{
				type: "dict",
				value: void 0,
				entryKeys: t,
				entryValues: n.map((e) => e[0])
			},
			...t,
			...n.flat()
		];
	}
	function h(e) {
		return e < 256 ? 1 : e < 65536 ? 2 : e < 4294967296 ? 4 : 8;
	}
	function g(e) {
		return e < 256 ? 1 : e < 65536 ? 2 : 4;
	}
})), Vn = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.serialize = void 0;
	var t = In(), n = new (Fn()).XMLBuilder({
		preserveOrder: !0,
		suppressEmptyNode: !0
	}), r = (e) => e < 10 ? "0" + e : e, i = (e) => e.getUTCFullYear() + "-" + r(e.getUTCMonth() + 1) + "-" + r(e.getUTCDate()) + "T" + r(e.getUTCHours()) + ":" + r(e.getUTCMinutes()) + ":" + r(e.getUTCSeconds()) + "Z", a = (e, t) => ({ [e]: [{ "#text": t }] }), o = (e) => {
		if (e === null) throw Error("Unsupported null value");
		switch (typeof e) {
			case "string": return a("string", e);
			case "bigint": return a("integer", e.toString());
			case "number": return a(Number.isInteger(e) ? "integer" : "real", e.toString());
			case "boolean": return { [e ? "true" : "false"]: [] };
			case "object":
				if (Array.isArray(e)) return { array: e.map(o) };
				if (e instanceof Date) return a("date", i(e));
				if (e instanceof Uint8Array) return a("data", (0, t.fromByteArray)(e));
				if (e instanceof ArrayBuffer) return a("data", (0, t.fromByteArray)(new Uint8Array(e)));
				{
					let t = [];
					for (let n of Object.keys(e)) e[n] === void 0 || e[n] === null || (t.push(a("key", n)), t.push(o(e[n])));
					return { dict: t };
				}
		}
		throw Error(`Unsupported type '${typeof e}'`);
	};
	e.serialize = (e) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
${n.build([o(e)])}
</plist>`;
})), Hn = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.serialize = void 0;
	var t = /^[A-Za-z0-9_.-]+$/, n = (e) => JSON.stringify(e).slice(1, -1).replace(/[^\x20-\x7F]/g, (e) => "\\u" + e.codePointAt(0).toString(16).padStart(4, "0")), r = (e) => e < 10 ? "0" + e : e, i = (e) => e.getUTCFullYear() + "-" + r(e.getUTCMonth() + 1) + "-" + r(e.getUTCDate()) + "T" + r(e.getUTCHours()) + ":" + r(e.getUTCMinutes()) + ":" + r(e.getUTCSeconds()) + "Z";
	e.serialize = (r) => {
		if (r === null) throw Error("Unsupported null value");
		switch (typeof r) {
			case "string": return t.test(r) ? r : `"${n(r)}"`;
			case "bigint":
			case "number": return r.toString();
			case "boolean": return r ? "1" : "0";
			case "object": return Array.isArray(r) ? `(${r.map(e.serialize).join(",")})` : r instanceof Date ? i(r) : r instanceof ArrayBuffer ? `<${new Uint8Array(r).reduce((e, t) => e + t.toString(16).padStart(2, "0"), "")}>` : Object.keys(r).length === 0 ? "{}" : `{${Object.keys(r).map((t) => `${(0, e.serialize)(t)}=${(0, e.serialize)(r[t])}`).join(";")};}`;
		}
		throw Error(`Unsupported value type ${typeof r}`);
	};
})), Un = /* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.serialize = void 0;
	var t = xn(), n = Bn(), r = Vn(), i = Hn();
	e.serialize = (e, a = t.PlistFormat.XML) => {
		switch (a) {
			case t.PlistFormat.XML: return (0, r.serialize)(e);
			case t.PlistFormat.BINARY: return (0, n.serialize)(e);
			case t.PlistFormat.OPENSTEP: return (0, i.serialize)(e);
		}
		throw Error("Unsupported format.");
	};
})), Wn = (/* @__PURE__ */ t(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.serialize = e.parse = e.detectFormat = void 0;
	var t = zn();
	Object.defineProperty(e, "detectFormat", {
		enumerable: !0,
		get: function() {
			return t.detectFormat;
		}
	}), Object.defineProperty(e, "parse", {
		enumerable: !0,
		get: function() {
			return t.parse;
		}
	});
	var n = Un();
	Object.defineProperty(e, "serialize", {
		enumerable: !0,
		get: function() {
			return n.serialize;
		}
	});
})))();
function Gn(e) {
	return typeof e == "object" && !!e && "constructor" in e && e.constructor === Object;
}
function Kn(e = {}, t = {}) {
	Object.keys(t).forEach((n) => {
		e[n] === void 0 ? e[n] = t[n] : Gn(t[n]) && Gn(e[n]) && Object.keys(t[n]).length > 0 && Kn(e[n], t[n]);
	});
}
var qn = {
	body: {},
	addEventListener() {},
	removeEventListener() {},
	activeElement: {
		blur() {},
		nodeName: ""
	},
	querySelector() {
		return null;
	},
	querySelectorAll() {
		return [];
	},
	getElementById() {
		return null;
	},
	createEvent() {
		return { initEvent() {} };
	},
	createElement() {
		return {
			children: [],
			childNodes: [],
			style: {},
			setAttribute() {},
			getElementsByTagName() {
				return [];
			}
		};
	},
	createElementNS() {
		return {};
	},
	importNode() {
		return null;
	},
	location: {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		protocol: "",
		search: ""
	}
};
function V() {
	let e = typeof document < "u" ? document : {};
	return Kn(e, qn), e;
}
var Jn = {
	document: qn,
	navigator: { userAgent: "" },
	location: {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		protocol: "",
		search: ""
	},
	history: {
		replaceState() {},
		pushState() {},
		go() {},
		back() {}
	},
	CustomEvent: function() {
		return this;
	},
	addEventListener() {},
	removeEventListener() {},
	getComputedStyle() {
		return { getPropertyValue() {
			return "";
		} };
	},
	Image() {},
	Date() {},
	screen: {},
	setTimeout() {},
	clearTimeout() {},
	matchMedia() {
		return {};
	},
	requestAnimationFrame(e) {
		return typeof setTimeout > "u" ? (e(), null) : setTimeout(e, 0);
	},
	cancelAnimationFrame(e) {
		typeof setTimeout > "u" || clearTimeout(e);
	}
};
function H() {
	let e = typeof window < "u" ? window : {};
	return Kn(e, Jn), e;
}
//#endregion
//#region node_modules/dom7/dom7.esm.js
var Yn = /* @__PURE__ */ n({
	$: () => U,
	add: () => ii,
	addClass: () => rr,
	animate: () => li,
	animationEnd: () => Cr,
	append: () => Br,
	appendTo: () => Vr,
	attr: () => sr,
	blur: () => mi,
	change: () => Si,
	children: () => ti,
	click: () => pi,
	closest: () => $r,
	css: () => Mr,
	data: () => ur,
	dataset: () => fr,
	default: () => U,
	detach: () => ri,
	each: () => Nr,
	empty: () => ai,
	eq: () => zr,
	filter: () => Pr,
	find: () => ei,
	focus: () => hi,
	focusin: () => gi,
	focusout: () => _i,
	hasClass: () => or,
	height: () => Er,
	hide: () => kr,
	html: () => Fr,
	index: () => Rr,
	insertAfter: () => Gr,
	insertBefore: () => Wr,
	is: () => Lr,
	keydown: () => yi,
	keypress: () => bi,
	keyup: () => vi,
	mousedown: () => Ci,
	mouseenter: () => Ei,
	mouseleave: () => Di,
	mousemove: () => wi,
	mouseout: () => Oi,
	mouseover: () => ki,
	mouseup: () => Ti,
	next: () => Kr,
	nextAll: () => qr,
	off: () => vr,
	offset: () => Or,
	on: () => _r,
	once: () => yr,
	outerHeight: () => Dr,
	outerWidth: () => Tr,
	parent: () => Zr,
	parents: () => Qr,
	prepend: () => Hr,
	prependTo: () => Ur,
	prev: () => Jr,
	prevAll: () => Yr,
	prop: () => lr,
	remove: () => ni,
	removeAttr: () => cr,
	removeClass: () => ir,
	removeData: () => dr,
	resize: () => Ni,
	scroll: () => Pi,
	scrollLeft: () => ci,
	scrollTo: () => oi,
	scrollTop: () => si,
	show: () => Ar,
	siblings: () => Xr,
	stop: () => ui,
	styles: () => jr,
	submit: () => xi,
	text: () => Ir,
	toggleClass: () => ar,
	touchend: () => ji,
	touchmove: () => Mi,
	touchstart: () => Ai,
	transform: () => hr,
	transition: () => gr,
	transitionEnd: () => Sr,
	transitionStart: () => xr,
	trigger: () => br,
	val: () => pr,
	value: () => mr,
	width: () => wr
});
function Xn(e) {
	let t = e.__proto__;
	Object.defineProperty(e, "__proto__", {
		get() {
			return t;
		},
		set(e) {
			t.__proto__ = e;
		}
	});
}
var Zn = class extends Array {
	constructor(e) {
		typeof e == "number" ? super(e) : (super(...e || []), Xn(this));
	}
};
function Qn(e = []) {
	let t = [];
	return e.forEach((e) => {
		Array.isArray(e) ? t.push(...Qn(e)) : t.push(e);
	}), t;
}
function $n(e, t) {
	return Array.prototype.filter.call(e, t);
}
function er(e) {
	let t = [];
	for (let n = 0; n < e.length; n += 1) t.indexOf(e[n]) === -1 && t.push(e[n]);
	return t;
}
function tr(e) {
	return e.toLowerCase().replace(/-(.)/g, (e, t) => t.toUpperCase());
}
function nr(e, t) {
	if (typeof e != "string") return [e];
	let n = [], r = t.querySelectorAll(e);
	for (let e = 0; e < r.length; e += 1) n.push(r[e]);
	return n;
}
function U(e, t) {
	let n = H(), r = V(), i = [];
	if (!t && e instanceof Zn) return e;
	if (!e) return new Zn(i);
	if (typeof e == "string") {
		let n = e.trim();
		if (n.indexOf("<") >= 0 && n.indexOf(">") >= 0) {
			let e = "div";
			n.indexOf("<li") === 0 && (e = "ul"), n.indexOf("<tr") === 0 && (e = "tbody"), (n.indexOf("<td") === 0 || n.indexOf("<th") === 0) && (e = "tr"), n.indexOf("<tbody") === 0 && (e = "table"), n.indexOf("<option") === 0 && (e = "select");
			let t = r.createElement(e);
			t.innerHTML = n;
			for (let e = 0; e < t.childNodes.length; e += 1) i.push(t.childNodes[e]);
		} else i = nr(e.trim(), t || r);
	} else if (e.nodeType || e === n || e === r) i.push(e);
	else if (Array.isArray(e)) {
		if (e instanceof Zn) return e;
		i = e;
	}
	return new Zn(er(i));
}
U.fn = Zn.prototype;
function rr(...e) {
	let t = Qn(e.map((e) => e.split(" ")));
	return this.forEach((e) => {
		e.classList.add(...t);
	}), this;
}
function ir(...e) {
	let t = Qn(e.map((e) => e.split(" ")));
	return this.forEach((e) => {
		e.classList.remove(...t);
	}), this;
}
function ar(...e) {
	let t = Qn(e.map((e) => e.split(" ")));
	this.forEach((e) => {
		t.forEach((t) => {
			e.classList.toggle(t);
		});
	});
}
function or(...e) {
	let t = Qn(e.map((e) => e.split(" ")));
	return $n(this, (e) => t.filter((t) => e.classList.contains(t)).length > 0).length > 0;
}
function sr(e, t) {
	if (arguments.length === 1 && typeof e == "string") return this[0] ? this[0].getAttribute(e) : void 0;
	for (let n = 0; n < this.length; n += 1) if (arguments.length === 2) this[n].setAttribute(e, t);
	else for (let t in e) this[n][t] = e[t], this[n].setAttribute(t, e[t]);
	return this;
}
function cr(e) {
	for (let t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
	return this;
}
function lr(e, t) {
	if (arguments.length === 1 && typeof e == "string") {
		if (this[0]) return this[0][e];
	} else {
		for (let n = 0; n < this.length; n += 1) if (arguments.length === 2) this[n][e] = t;
		else for (let t in e) this[n][t] = e[t];
		return this;
	}
	return this;
}
function ur(e, t) {
	let n;
	if (t === void 0) return n = this[0], n ? n.dom7ElementDataStorage && e in n.dom7ElementDataStorage ? n.dom7ElementDataStorage[e] : n.getAttribute(`data-${e}`) || void 0 : void 0;
	for (let r = 0; r < this.length; r += 1) n = this[r], n.dom7ElementDataStorage ||= {}, n.dom7ElementDataStorage[e] = t;
	return this;
}
function dr(e) {
	for (let t = 0; t < this.length; t += 1) {
		let n = this[t];
		n.dom7ElementDataStorage && n.dom7ElementDataStorage[e] && (n.dom7ElementDataStorage[e] = null, delete n.dom7ElementDataStorage[e]);
	}
}
function fr() {
	let e = this[0];
	if (!e) return;
	let t = {};
	if (e.dataset) for (let n in e.dataset) t[n] = e.dataset[n];
	else for (let n = 0; n < e.attributes.length; n += 1) {
		let r = e.attributes[n];
		r.name.indexOf("data-") >= 0 && (t[tr(r.name.split("data-")[1])] = r.value);
	}
	for (let e in t) t[e] === "false" ? t[e] = !1 : t[e] === "true" ? t[e] = !0 : parseFloat(t[e]) === t[e] * 1 && (t[e] *= 1);
	return t;
}
function pr(e) {
	if (e === void 0) {
		let e = this[0];
		if (!e) return;
		if (e.multiple && e.nodeName.toLowerCase() === "select") {
			let t = [];
			for (let n = 0; n < e.selectedOptions.length; n += 1) t.push(e.selectedOptions[n].value);
			return t;
		}
		return e.value;
	}
	for (let t = 0; t < this.length; t += 1) {
		let n = this[t];
		if (Array.isArray(e) && n.multiple && n.nodeName.toLowerCase() === "select") for (let t = 0; t < n.options.length; t += 1) n.options[t].selected = e.indexOf(n.options[t].value) >= 0;
		else n.value = e;
	}
	return this;
}
function mr(e) {
	return this.val(e);
}
function hr(e) {
	for (let t = 0; t < this.length; t += 1) this[t].style.transform = e;
	return this;
}
function gr(e) {
	for (let t = 0; t < this.length; t += 1) this[t].style.transitionDuration = typeof e == "string" ? e : `${e}ms`;
	return this;
}
function _r(...e) {
	let [t, n, r, i] = e;
	typeof e[1] == "function" && ([t, r, i] = e, n = void 0), i ||= !1;
	function a(e) {
		let t = e.target;
		if (!t) return;
		let i = e.target.dom7EventData || [];
		if (i.indexOf(e) < 0 && i.unshift(e), U(t).is(n)) r.apply(t, i);
		else {
			let e = U(t).parents();
			for (let t = 0; t < e.length; t += 1) U(e[t]).is(n) && r.apply(e[t], i);
		}
	}
	function o(e) {
		let t = e && e.target && e.target.dom7EventData || [];
		t.indexOf(e) < 0 && t.unshift(e), r.apply(this, t);
	}
	let s = t.split(" "), c;
	for (let e = 0; e < this.length; e += 1) {
		let t = this[e];
		if (n) for (c = 0; c < s.length; c += 1) {
			let e = s[c];
			t.dom7LiveListeners ||= {}, t.dom7LiveListeners[e] || (t.dom7LiveListeners[e] = []), t.dom7LiveListeners[e].push({
				listener: r,
				proxyListener: a
			}), t.addEventListener(e, a, i);
		}
		else for (c = 0; c < s.length; c += 1) {
			let e = s[c];
			t.dom7Listeners ||= {}, t.dom7Listeners[e] || (t.dom7Listeners[e] = []), t.dom7Listeners[e].push({
				listener: r,
				proxyListener: o
			}), t.addEventListener(e, o, i);
		}
	}
	return this;
}
function vr(...e) {
	let [t, n, r, i] = e;
	typeof e[1] == "function" && ([t, r, i] = e, n = void 0), i ||= !1;
	let a = t.split(" ");
	for (let e = 0; e < a.length; e += 1) {
		let t = a[e];
		for (let e = 0; e < this.length; e += 1) {
			let a = this[e], o;
			if (!n && a.dom7Listeners ? o = a.dom7Listeners[t] : n && a.dom7LiveListeners && (o = a.dom7LiveListeners[t]), o && o.length) for (let e = o.length - 1; e >= 0; --e) {
				let n = o[e];
				r && n.listener === r || r && n.listener && n.listener.dom7proxy && n.listener.dom7proxy === r ? (a.removeEventListener(t, n.proxyListener, i), o.splice(e, 1)) : r || (a.removeEventListener(t, n.proxyListener, i), o.splice(e, 1));
			}
		}
	}
	return this;
}
function yr(...e) {
	let t = this, [n, r, i, a] = e;
	typeof e[1] == "function" && ([n, i, a] = e, r = void 0);
	function o(...e) {
		i.apply(this, e), t.off(n, r, o, a), o.dom7proxy && delete o.dom7proxy;
	}
	return o.dom7proxy = i, t.on(n, r, o, a);
}
function br(...e) {
	let t = H(), n = e[0].split(" "), r = e[1];
	for (let i = 0; i < n.length; i += 1) {
		let a = n[i];
		for (let n = 0; n < this.length; n += 1) {
			let i = this[n];
			if (t.CustomEvent) {
				let n = new t.CustomEvent(a, {
					detail: r,
					bubbles: !0,
					cancelable: !0
				});
				i.dom7EventData = e.filter((e, t) => t > 0), i.dispatchEvent(n), i.dom7EventData = [], delete i.dom7EventData;
			}
		}
	}
	return this;
}
function xr(e) {
	let t = this;
	function n(r) {
		r.target === this && (e.call(this, r), t.off("transitionstart", n));
	}
	return e && t.on("transitionstart", n), this;
}
function Sr(e) {
	let t = this;
	function n(r) {
		r.target === this && (e.call(this, r), t.off("transitionend", n));
	}
	return e && t.on("transitionend", n), this;
}
function Cr(e) {
	let t = this;
	function n(r) {
		r.target === this && (e.call(this, r), t.off("animationend", n));
	}
	return e && t.on("animationend", n), this;
}
function wr() {
	let e = H();
	return this[0] === e ? e.innerWidth : this.length > 0 ? parseFloat(this.css("width")) : null;
}
function Tr(e) {
	if (this.length > 0) {
		if (e) {
			let e = this.styles();
			return this[0].offsetWidth + parseFloat(e.getPropertyValue("margin-right")) + parseFloat(e.getPropertyValue("margin-left"));
		}
		return this[0].offsetWidth;
	}
	return null;
}
function Er() {
	let e = H();
	return this[0] === e ? e.innerHeight : this.length > 0 ? parseFloat(this.css("height")) : null;
}
function Dr(e) {
	if (this.length > 0) {
		if (e) {
			let e = this.styles();
			return this[0].offsetHeight + parseFloat(e.getPropertyValue("margin-top")) + parseFloat(e.getPropertyValue("margin-bottom"));
		}
		return this[0].offsetHeight;
	}
	return null;
}
function Or() {
	if (this.length > 0) {
		let e = H(), t = V(), n = this[0], r = n.getBoundingClientRect(), i = t.body, a = n.clientTop || i.clientTop || 0, o = n.clientLeft || i.clientLeft || 0, s = n === e ? e.scrollY : n.scrollTop, c = n === e ? e.scrollX : n.scrollLeft;
		return {
			top: r.top + s - a,
			left: r.left + c - o
		};
	}
	return null;
}
function kr() {
	for (let e = 0; e < this.length; e += 1) this[e].style.display = "none";
	return this;
}
function Ar() {
	let e = H();
	for (let t = 0; t < this.length; t += 1) {
		let n = this[t];
		n.style.display === "none" && (n.style.display = ""), e.getComputedStyle(n, null).getPropertyValue("display") === "none" && (n.style.display = "block");
	}
	return this;
}
function jr() {
	let e = H();
	return this[0] ? e.getComputedStyle(this[0], null) : {};
}
function Mr(e, t) {
	let n = H(), r;
	if (arguments.length === 1) if (typeof e == "string") {
		if (this[0]) return n.getComputedStyle(this[0], null).getPropertyValue(e);
	} else {
		for (r = 0; r < this.length; r += 1) for (let t in e) this[r].style[t] = e[t];
		return this;
	}
	if (arguments.length === 2 && typeof e == "string") {
		for (r = 0; r < this.length; r += 1) this[r].style[e] = t;
		return this;
	}
	return this;
}
function Nr(e) {
	return e && this.forEach((t, n) => {
		e.apply(t, [t, n]);
	}), this;
}
function Pr(e) {
	return U($n(this, e));
}
function Fr(e) {
	if (e === void 0) return this[0] ? this[0].innerHTML : null;
	for (let t = 0; t < this.length; t += 1) this[t].innerHTML = e;
	return this;
}
function Ir(e) {
	if (e === void 0) return this[0] ? this[0].textContent.trim() : null;
	for (let t = 0; t < this.length; t += 1) this[t].textContent = e;
	return this;
}
function Lr(e) {
	let t = H(), n = V(), r = this[0], i, a;
	if (!r || e === void 0) return !1;
	if (typeof e == "string") {
		if (r.matches) return r.matches(e);
		if (r.webkitMatchesSelector) return r.webkitMatchesSelector(e);
		if (r.msMatchesSelector) return r.msMatchesSelector(e);
		for (i = U(e), a = 0; a < i.length; a += 1) if (i[a] === r) return !0;
		return !1;
	}
	if (e === n) return r === n;
	if (e === t) return r === t;
	if (e.nodeType || e instanceof Zn) {
		for (i = e.nodeType ? [e] : e, a = 0; a < i.length; a += 1) if (i[a] === r) return !0;
		return !1;
	}
	return !1;
}
function Rr() {
	let e = this[0], t;
	if (e) {
		for (t = 0; (e = e.previousSibling) !== null;) e.nodeType === 1 && (t += 1);
		return t;
	}
}
function zr(e) {
	if (e === void 0) return this;
	let t = this.length;
	if (e > t - 1) return U([]);
	if (e < 0) {
		let n = t + e;
		return U(n < 0 ? [] : [this[n]]);
	}
	return U([this[e]]);
}
function Br(...e) {
	let t, n = V();
	for (let r = 0; r < e.length; r += 1) {
		t = e[r];
		for (let e = 0; e < this.length; e += 1) if (typeof t == "string") {
			let r = n.createElement("div");
			for (r.innerHTML = t; r.firstChild;) this[e].appendChild(r.firstChild);
		} else if (t instanceof Zn) for (let n = 0; n < t.length; n += 1) this[e].appendChild(t[n]);
		else this[e].appendChild(t);
	}
	return this;
}
function Vr(e) {
	return U(e).append(this), this;
}
function Hr(e) {
	let t = V(), n, r;
	for (n = 0; n < this.length; n += 1) if (typeof e == "string") {
		let i = t.createElement("div");
		for (i.innerHTML = e, r = i.childNodes.length - 1; r >= 0; --r) this[n].insertBefore(i.childNodes[r], this[n].childNodes[0]);
	} else if (e instanceof Zn) for (r = 0; r < e.length; r += 1) this[n].insertBefore(e[r], this[n].childNodes[0]);
	else this[n].insertBefore(e, this[n].childNodes[0]);
	return this;
}
function Ur(e) {
	return U(e).prepend(this), this;
}
function Wr(e) {
	let t = U(e);
	for (let e = 0; e < this.length; e += 1) if (t.length === 1) t[0].parentNode.insertBefore(this[e], t[0]);
	else if (t.length > 1) for (let n = 0; n < t.length; n += 1) t[n].parentNode.insertBefore(this[e].cloneNode(!0), t[n]);
}
function Gr(e) {
	let t = U(e);
	for (let e = 0; e < this.length; e += 1) if (t.length === 1) t[0].parentNode.insertBefore(this[e], t[0].nextSibling);
	else if (t.length > 1) for (let n = 0; n < t.length; n += 1) t[n].parentNode.insertBefore(this[e].cloneNode(!0), t[n].nextSibling);
}
function Kr(e) {
	return this.length > 0 ? e ? this[0].nextElementSibling && U(this[0].nextElementSibling).is(e) ? U([this[0].nextElementSibling]) : U([]) : this[0].nextElementSibling ? U([this[0].nextElementSibling]) : U([]) : U([]);
}
function qr(e) {
	let t = [], n = this[0];
	if (!n) return U([]);
	for (; n.nextElementSibling;) {
		let r = n.nextElementSibling;
		e ? U(r).is(e) && t.push(r) : t.push(r), n = r;
	}
	return U(t);
}
function Jr(e) {
	if (this.length > 0) {
		let t = this[0];
		return e ? t.previousElementSibling && U(t.previousElementSibling).is(e) ? U([t.previousElementSibling]) : U([]) : t.previousElementSibling ? U([t.previousElementSibling]) : U([]);
	}
	return U([]);
}
function Yr(e) {
	let t = [], n = this[0];
	if (!n) return U([]);
	for (; n.previousElementSibling;) {
		let r = n.previousElementSibling;
		e ? U(r).is(e) && t.push(r) : t.push(r), n = r;
	}
	return U(t);
}
function Xr(e) {
	return this.nextAll(e).add(this.prevAll(e));
}
function Zr(e) {
	let t = [];
	for (let n = 0; n < this.length; n += 1) this[n].parentNode !== null && (e ? U(this[n].parentNode).is(e) && t.push(this[n].parentNode) : t.push(this[n].parentNode));
	return U(t);
}
function Qr(e) {
	let t = [];
	for (let n = 0; n < this.length; n += 1) {
		let r = this[n].parentNode;
		for (; r;) e ? U(r).is(e) && t.push(r) : t.push(r), r = r.parentNode;
	}
	return U(t);
}
function $r(e) {
	let t = this;
	return e === void 0 ? U([]) : (t.is(e) || (t = t.parents(e).eq(0)), t);
}
function ei(e) {
	let t = [];
	for (let n = 0; n < this.length; n += 1) {
		let r = this[n].querySelectorAll(e);
		for (let e = 0; e < r.length; e += 1) t.push(r[e]);
	}
	return U(t);
}
function ti(e) {
	let t = [];
	for (let n = 0; n < this.length; n += 1) {
		let r = this[n].children;
		for (let n = 0; n < r.length; n += 1) (!e || U(r[n]).is(e)) && t.push(r[n]);
	}
	return U(t);
}
function ni() {
	for (let e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]);
	return this;
}
function ri() {
	return this.remove();
}
function ii(...e) {
	let t = this, n, r;
	for (n = 0; n < e.length; n += 1) {
		let i = U(e[n]);
		for (r = 0; r < i.length; r += 1) t.push(i[r]);
	}
	return t;
}
function ai() {
	for (let e = 0; e < this.length; e += 1) {
		let t = this[e];
		if (t.nodeType === 1) {
			for (let e = 0; e < t.childNodes.length; e += 1) t.childNodes[e].parentNode && t.childNodes[e].parentNode.removeChild(t.childNodes[e]);
			t.textContent = "";
		}
	}
	return this;
}
function oi(...e) {
	let t = H(), [n, r, i, a, o] = e;
	return e.length === 4 && typeof a == "function" && (o = a, [n, r, i, o, a] = e), a === void 0 && (a = "swing"), this.each(function() {
		let e = this, s, c, l, u, d, f, p, m, h = r > 0 || r === 0, g = n > 0 || n === 0;
		if (a === void 0 && (a = "swing"), h && (s = e.scrollTop, i || (e.scrollTop = r)), g && (c = e.scrollLeft, i || (e.scrollLeft = n)), !i) return;
		h && (l = e.scrollHeight - e.offsetHeight, d = Math.max(Math.min(r, l), 0)), g && (u = e.scrollWidth - e.offsetWidth, f = Math.max(Math.min(n, u), 0));
		let _ = null;
		h && d === s && (h = !1), g && f === c && (g = !1);
		function v(n = (/* @__PURE__ */ new Date()).getTime()) {
			_ === null && (_ = n);
			let r = Math.max(Math.min((n - _) / i, 1), 0), l = a === "linear" ? r : .5 - Math.cos(r * Math.PI) / 2, u;
			if (h && (p = s + l * (d - s)), g && (m = c + l * (f - c)), h && d > s && p >= d && (e.scrollTop = d, u = !0), h && d < s && p <= d && (e.scrollTop = d, u = !0), g && f > c && m >= f && (e.scrollLeft = f, u = !0), g && f < c && m <= f && (e.scrollLeft = f, u = !0), u) {
				o && o();
				return;
			}
			h && (e.scrollTop = p), g && (e.scrollLeft = m), t.requestAnimationFrame(v);
		}
		t.requestAnimationFrame(v);
	});
}
function si(...e) {
	let [t, n, r, i] = e;
	e.length === 3 && typeof r == "function" && ([t, n, i, r] = e);
	let a = this;
	return t === void 0 ? a.length > 0 ? a[0].scrollTop : null : a.scrollTo(void 0, t, n, r, i);
}
function ci(...e) {
	let [t, n, r, i] = e;
	e.length === 3 && typeof r == "function" && ([t, n, i, r] = e);
	let a = this;
	return t === void 0 ? a.length > 0 ? a[0].scrollLeft : null : a.scrollTo(t, void 0, n, r, i);
}
function li(e, t) {
	let n = H(), r = this, i = {
		props: Object.assign({}, e),
		params: Object.assign({
			duration: 300,
			easing: "swing"
		}, t),
		elements: r,
		animating: !1,
		que: [],
		easingProgress(e, t) {
			return e === "swing" ? .5 - Math.cos(t * Math.PI) / 2 : typeof e == "function" ? e(t) : t;
		},
		stop() {
			i.frameId && n.cancelAnimationFrame(i.frameId), i.animating = !1, i.elements.each((e) => {
				let t = e;
				delete t.dom7AnimateInstance;
			}), i.que = [];
		},
		done(e) {
			if (i.animating = !1, i.elements.each((e) => {
				let t = e;
				delete t.dom7AnimateInstance;
			}), e && e(r), i.que.length > 0) {
				let e = i.que.shift();
				i.animate(e[0], e[1]);
			}
		},
		animate(e, t) {
			if (i.animating) return i.que.push([e, t]), i;
			let a = [];
			i.elements.each((t, r) => {
				let o, s, c, l, u;
				t.dom7AnimateInstance || (i.elements[r].dom7AnimateInstance = i), a[r] = { container: t }, Object.keys(e).forEach((i) => {
					o = n.getComputedStyle(t, null).getPropertyValue(i).replace(",", "."), s = parseFloat(o), c = o.replace(s, ""), l = parseFloat(e[i]), u = e[i] + c, a[r][i] = {
						initialFullValue: o,
						initialValue: s,
						unit: c,
						finalValue: l,
						finalFullValue: u,
						currentValue: s
					};
				});
			});
			let o = null, s, c = 0, l = 0, u, d = !1;
			i.animating = !0;
			function f() {
				s = (/* @__PURE__ */ new Date()).getTime();
				let p, m;
				d || (d = !0, t.begin && t.begin(r)), o === null && (o = s), t.progress && t.progress(r, Math.max(Math.min((s - o) / t.duration, 1), 0), o + t.duration - s < 0 ? 0 : o + t.duration - s, o), a.forEach((n) => {
					let r = n;
					u || r.done || Object.keys(e).forEach((n) => {
						if (u || r.done) return;
						p = Math.max(Math.min((s - o) / t.duration, 1), 0), m = i.easingProgress(t.easing, p);
						let { initialValue: d, finalValue: f, unit: h } = r[n];
						r[n].currentValue = d + m * (f - d);
						let g = r[n].currentValue;
						if ((f > d && g >= f || f < d && g <= f) && (r.container.style[n] = f + h, l += 1, l === Object.keys(e).length && (r.done = !0, c += 1), c === a.length && (u = !0)), u) {
							i.done(t.complete);
							return;
						}
						r.container.style[n] = g + h;
					});
				}), !u && (i.frameId = n.requestAnimationFrame(f));
			}
			return i.frameId = n.requestAnimationFrame(f), i;
		}
	};
	if (i.elements.length === 0) return r;
	let a;
	for (let e = 0; e < i.elements.length; e += 1) i.elements[e].dom7AnimateInstance ? a = i.elements[e].dom7AnimateInstance : i.elements[e].dom7AnimateInstance = i;
	return a ||= i, e === "stop" ? a.stop() : a.animate(i.props, i.params), r;
}
function ui() {
	let e = this;
	for (let t = 0; t < e.length; t += 1) e[t].dom7AnimateInstance && e[t].dom7AnimateInstance.stop();
}
var di = "resize scroll".split(" ");
function fi(e) {
	function t(...t) {
		if (t[0] === void 0) {
			for (let t = 0; t < this.length; t += 1) di.indexOf(e) < 0 && (e in this[t] ? this[t][e]() : U(this[t]).trigger(e));
			return this;
		}
		return this.on(e, ...t);
	}
	return t;
}
var pi = fi("click"), mi = fi("blur"), hi = fi("focus"), gi = fi("focusin"), _i = fi("focusout"), vi = fi("keyup"), yi = fi("keydown"), bi = fi("keypress"), xi = fi("submit"), Si = fi("change"), Ci = fi("mousedown"), wi = fi("mousemove"), Ti = fi("mouseup"), Ei = fi("mouseenter"), Di = fi("mouseleave"), Oi = fi("mouseout"), ki = fi("mouseover"), Ai = fi("touchstart"), ji = fi("touchend"), Mi = fi("touchmove"), Ni = fi("resize"), Pi = fi("scroll");
//#endregion
//#region node_modules/framework7/shared/dom7.js
Object.keys(Yn).forEach((e) => {
	e !== "$" && (U.fn[e] = Yn[e]);
});
var W = U;
//#endregion
//#region node_modules/framework7/shared/material-color-utils.js
function Fi(e) {
	return e < 0 ? -1 : e === 0 ? 0 : 1;
}
function Ii(e, t, n) {
	return (1 - n) * e + n * t;
}
function Li(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function Ri(e, t, n) {
	return n < e ? e : n > t ? t : n;
}
function zi(e) {
	return (e %= 360) < 0 && (e += 360), e;
}
function Bi(e, t) {
	return zi(t - e) <= 180 ? 1 : -1;
}
function Vi(e, t) {
	return 180 - Math.abs(Math.abs(e - t) - 180);
}
function Hi(e, t) {
	return [
		e[0] * t[0][0] + e[1] * t[0][1] + e[2] * t[0][2],
		e[0] * t[1][0] + e[1] * t[1][1] + e[2] * t[1][2],
		e[0] * t[2][0] + e[1] * t[2][1] + e[2] * t[2][2]
	];
}
var Ui = [
	[
		.41233895,
		.35762064,
		.18051042
	],
	[
		.2126,
		.7152,
		.0722
	],
	[
		.01932141,
		.11916382,
		.95034478
	]
], Wi = [
	[
		3.2413774792388685,
		-1.5376652402851851,
		-.49885366846268053
	],
	[
		-.9691452513005321,
		1.8758853451067872,
		.04156585616912061
	],
	[
		.05562093689691305,
		-.20395524564742123,
		1.0571799111220335
	]
], Gi = [
	95.047,
	100,
	108.883
];
function Ki(e, t, n) {
	return (255 << 24 | (255 & e) << 16 | (255 & t) << 8 | 255 & n) >>> 0;
}
function qi(e) {
	return Ki(ia(e[0]), ia(e[1]), ia(e[2]));
}
function Ji(e) {
	return e >> 16 & 255;
}
function Yi(e) {
	return e >> 8 & 255;
}
function Xi(e) {
	return 255 & e;
}
function Zi(e, t, n) {
	let r = Wi, i = r[0][0] * e + r[0][1] * t + r[0][2] * n, a = r[1][0] * e + r[1][1] * t + r[1][2] * n, o = r[2][0] * e + r[2][1] * t + r[2][2] * n;
	return Ki(ia(i), ia(a), ia(o));
}
function Qi(e) {
	return Hi([
		ra(Ji(e)),
		ra(Yi(e)),
		ra(Xi(e))
	], Ui);
}
function $i(e) {
	let t = ia(ta(e));
	return Ki(t, t, t);
}
function ea(e) {
	return 116 * oa(Qi(e)[1] / 100) - 16;
}
function ta(e) {
	return 100 * sa((e + 16) / 116);
}
function na(e) {
	return 116 * oa(e / 100) - 16;
}
function ra(e) {
	let t = e / 255;
	return t <= .040449936 ? t / 12.92 * 100 : 100 * ((t + .055) / 1.055) ** 2.4;
}
function ia(e) {
	let t = e / 100, n = 0;
	return n = t <= .0031308 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - .055, Li(0, 255, Math.round(255 * n));
}
function aa() {
	return Gi;
}
function oa(e) {
	return e > 216 / 24389 ? e ** (1 / 3) : (903.2962962962963 * e + 16) / 116;
}
function sa(e) {
	let t = e * e * e;
	return t > 216 / 24389 ? t : (116 * e - 16) / 903.2962962962963;
}
var ca = class e {
	static make(t, n, r, i, a) {
		t === void 0 && (t = aa()), n === void 0 && (n = 200 / Math.PI * ta(50) / 100), r === void 0 && (r = 50), i === void 0 && (i = 2), a === void 0 && (a = !1);
		let o = t, s = .401288 * o[0] + .650173 * o[1] + -.051461 * o[2], c = -.250268 * o[0] + 1.204414 * o[1] + .045854 * o[2], l = -.002079 * o[0] + .048952 * o[1] + .953127 * o[2], u = .8 + i / 10, d = u >= .9 ? Ii(.59, .69, 10 * (u - .9)) : Ii(.525, .59, 10 * (u - .8)), f = a ? 1 : u * (1 - 1 / 3.6 * Math.exp((-n - 42) / 92));
		f = f > 1 ? 1 : f < 0 ? 0 : f;
		let p = u, m = [
			100 / s * f + 1 - f,
			100 / c * f + 1 - f,
			100 / l * f + 1 - f
		], h = 1 / (5 * n + 1), g = h * h * h * h, _ = 1 - g, v = g * n + .1 * _ * _ * Math.cbrt(5 * n), y = ta(r) / t[1], b = 1.48 + Math.sqrt(y), x = .725 / y ** .2, S = x, C = [
			(v * m[0] * s / 100) ** .42,
			(v * m[1] * c / 100) ** .42,
			(v * m[2] * l / 100) ** .42
		], w = [
			400 * C[0] / (C[0] + 27.13),
			400 * C[1] / (C[1] + 27.13),
			400 * C[2] / (C[2] + 27.13)
		];
		return new e(y, (2 * w[0] + w[1] + .05 * w[2]) * x, x, S, d, p, m, v, v ** .25, b);
	}
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.n = e, this.aw = t, this.nbb = n, this.ncb = r, this.c = i, this.nc = a, this.rgbD = o, this.fl = s, this.fLRoot = c, this.z = l;
	}
};
ca.DEFAULT = ca.make();
var la = class e {
	constructor(e, t, n, r, i, a, o, s, c) {
		this.hue = e, this.chroma = t, this.j = n, this.q = r, this.m = i, this.s = a, this.jstar = o, this.astar = s, this.bstar = c;
	}
	distance(e) {
		let t = this.jstar - e.jstar, n = this.astar - e.astar, r = this.bstar - e.bstar;
		return 1.41 * Math.sqrt(t * t + n * n + r * r) ** .63;
	}
	static fromInt(t) {
		return e.fromIntInViewingConditions(t, ca.DEFAULT);
	}
	static fromIntInViewingConditions(t, n) {
		let r = (65280 & t) >> 8, i = 255 & t, a = ra((16711680 & t) >> 16), o = ra(r), s = ra(i), c = .41233895 * a + .35762064 * o + .18051042 * s, l = .2126 * a + .7152 * o + .0722 * s, u = .01932141 * a + .11916382 * o + .95034478 * s, d = .401288 * c + .650173 * l - .051461 * u, f = -.250268 * c + 1.204414 * l + .045854 * u, p = -.002079 * c + .048952 * l + .953127 * u, m = n.rgbD[0] * d, h = n.rgbD[1] * f, g = n.rgbD[2] * p, _ = (n.fl * Math.abs(m) / 100) ** .42, v = (n.fl * Math.abs(h) / 100) ** .42, y = (n.fl * Math.abs(g) / 100) ** .42, b = 400 * Fi(m) * _ / (_ + 27.13), x = 400 * Fi(h) * v / (v + 27.13), S = 400 * Fi(g) * y / (y + 27.13), C = (11 * b + -12 * x + S) / 11, w = (b + x - 2 * S) / 9, T = (20 * b + 20 * x + 21 * S) / 20, E = (40 * b + 20 * x + S) / 20, D = 180 * Math.atan2(w, C) / Math.PI, O = D < 0 ? D + 360 : D >= 360 ? D - 360 : D, k = O * Math.PI / 180, A = 100 * (E * n.nbb / n.aw) ** +(n.c * n.z), j = 4 / n.c * Math.sqrt(A / 100) * (n.aw + 4) * n.fLRoot, M = O < 20.14 ? O + 360 : O, N = (5e4 / 13 * (.25 * (Math.cos(M * Math.PI / 180 + 2) + 3.8)) * n.nc * n.ncb * Math.sqrt(C * C + w * w) / (T + .305)) ** .9 * (1.64 - .29 ** n.n) ** .73, P = N * Math.sqrt(A / 100), F = P * n.fLRoot, ee = 50 * Math.sqrt(N * n.c / (n.aw + 4)), te = 1.7000000000000002 * A / (1 + .007 * A), I = 1 / .0228 * Math.log(1 + .0228 * F);
		return new e(O, P, A, j, F, ee, te, I * Math.cos(k), I * Math.sin(k));
	}
	static fromJch(t, n, r) {
		return e.fromJchInViewingConditions(t, n, r, ca.DEFAULT);
	}
	static fromJchInViewingConditions(t, n, r, i) {
		let a = 4 / i.c * Math.sqrt(t / 100) * (i.aw + 4) * i.fLRoot, o = n * i.fLRoot, s = n / Math.sqrt(t / 100), c = 50 * Math.sqrt(s * i.c / (i.aw + 4)), l = r * Math.PI / 180, u = 1.7000000000000002 * t / (1 + .007 * t), d = 1 / .0228 * Math.log(1 + .0228 * o);
		return new e(r, n, t, a, o, c, u, d * Math.cos(l), d * Math.sin(l));
	}
	static fromUcs(t, n, r) {
		return e.fromUcsInViewingConditions(t, n, r, ca.DEFAULT);
	}
	static fromUcsInViewingConditions(t, n, r, i) {
		let a = n, o = r, s = Math.sqrt(a * a + o * o), c = (Math.exp(.0228 * s) - 1) / .0228 / i.fLRoot, l = 180 / Math.PI * Math.atan2(o, a);
		l < 0 && (l += 360);
		let u = t / (1 - .007 * (t - 100));
		return e.fromJchInViewingConditions(u, c, l, i);
	}
	toInt() {
		return this.viewed(ca.DEFAULT);
	}
	viewed(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, m = (460 * o - 220 * u - 6300 * d) / 1403, h = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), g = Fi(f) * (100 / e.fl) * h ** (1 / .42), _ = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), v = Fi(p) * (100 / e.fl) * _ ** (1 / .42), y = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), b = Fi(m) * (100 / e.fl) * y ** (1 / .42), x = g / e.rgbD[0], S = v / e.rgbD[1], C = b / e.rgbD[2];
		return Zi(1.86206786 * x - 1.01125463 * S + .14918677 * C, .38752654 * x + .62144744 * S - .00897398 * C, -.0158415 * x - .03412294 * S + 1.04996444 * C);
	}
	static fromXyzInViewingConditions(t, n, r, i) {
		let a = .401288 * t + .650173 * n - .051461 * r, o = -.250268 * t + 1.204414 * n + .045854 * r, s = -.002079 * t + .048952 * n + .953127 * r, c = i.rgbD[0] * a, l = i.rgbD[1] * o, u = i.rgbD[2] * s, d = (i.fl * Math.abs(c) / 100) ** .42, f = (i.fl * Math.abs(l) / 100) ** .42, p = (i.fl * Math.abs(u) / 100) ** .42, m = 400 * Fi(c) * d / (d + 27.13), h = 400 * Fi(l) * f / (f + 27.13), g = 400 * Fi(u) * p / (p + 27.13), _ = (11 * m + -12 * h + g) / 11, v = (m + h - 2 * g) / 9, y = (20 * m + 20 * h + 21 * g) / 20, b = (40 * m + 20 * h + g) / 20, x = 180 * Math.atan2(v, _) / Math.PI, S = x < 0 ? x + 360 : x >= 360 ? x - 360 : x, C = S * Math.PI / 180, w = 100 * (b * i.nbb / i.aw) ** +(i.c * i.z), T = 4 / i.c * Math.sqrt(w / 100) * (i.aw + 4) * i.fLRoot, E = S < 20.14 ? S + 360 : S, D = (5e4 / 13 * (1 / 4 * (Math.cos(E * Math.PI / 180 + 2) + 3.8)) * i.nc * i.ncb * Math.sqrt(_ * _ + v * v) / (y + .305)) ** .9 * (1.64 - .29 ** i.n) ** .73, O = D * Math.sqrt(w / 100), k = O * i.fLRoot, A = 50 * Math.sqrt(D * i.c / (i.aw + 4)), j = 1.7000000000000002 * w / (1 + .007 * w), M = Math.log(1 + .0228 * k) / .0228;
		return new e(S, O, w, T, k, A, j, M * Math.cos(C), M * Math.sin(C));
	}
	xyzInViewingConditions(e) {
		let t = ((this.chroma === 0 || this.j === 0 ? 0 : this.chroma / Math.sqrt(this.j / 100)) / (1.64 - .29 ** e.n) ** .73) ** (1 / .9), n = this.hue * Math.PI / 180, r = .25 * (Math.cos(n + 2) + 3.8), i = e.aw * (this.j / 100) ** (1 / e.c / e.z), a = 5e4 / 13 * r * e.nc * e.ncb, o = i / e.nbb, s = Math.sin(n), c = Math.cos(n), l = 23 * (o + .305) * t / (23 * a + 11 * t * c + 108 * t * s), u = l * c, d = l * s, f = (460 * o + 451 * u + 288 * d) / 1403, p = (460 * o - 891 * u - 261 * d) / 1403, m = (460 * o - 220 * u - 6300 * d) / 1403, h = Math.max(0, 27.13 * Math.abs(f) / (400 - Math.abs(f))), g = Fi(f) * (100 / e.fl) * h ** (1 / .42), _ = Math.max(0, 27.13 * Math.abs(p) / (400 - Math.abs(p))), v = Fi(p) * (100 / e.fl) * _ ** (1 / .42), y = Math.max(0, 27.13 * Math.abs(m) / (400 - Math.abs(m))), b = Fi(m) * (100 / e.fl) * y ** (1 / .42), x = g / e.rgbD[0], S = v / e.rgbD[1], C = b / e.rgbD[2];
		return [
			1.86206786 * x - 1.01125463 * S + .14918677 * C,
			.38752654 * x + .62144744 * S - .00897398 * C,
			-.0158415 * x - .03412294 * S + 1.04996444 * C
		];
	}
}, ua = class e {
	static sanitizeRadians(e) {
		return (e + 8 * Math.PI) % (2 * Math.PI);
	}
	static trueDelinearized(e) {
		let t = e / 100, n = 0;
		return n = t <= .0031308 ? 12.92 * t : 1.055 * t ** (1 / 2.4) - .055, 255 * n;
	}
	static chromaticAdaptation(e) {
		let t = Math.abs(e) ** .42;
		return 400 * Fi(e) * t / (t + 27.13);
	}
	static hueOf(t) {
		let n = Hi(t, e.SCALED_DISCOUNT_FROM_LINRGB), r = e.chromaticAdaptation(n[0]), i = e.chromaticAdaptation(n[1]), a = e.chromaticAdaptation(n[2]), o = (11 * r + -12 * i + a) / 11, s = (r + i - 2 * a) / 9;
		return Math.atan2(s, o);
	}
	static areInCyclicOrder(t, n, r) {
		return e.sanitizeRadians(n - t) < e.sanitizeRadians(r - t);
	}
	static intercept(e, t, n) {
		return (t - e) / (n - e);
	}
	static lerpPoint(e, t, n) {
		return [
			e[0] + (n[0] - e[0]) * t,
			e[1] + (n[1] - e[1]) * t,
			e[2] + (n[2] - e[2]) * t
		];
	}
	static setCoordinate(t, n, r, i) {
		let a = e.intercept(t[i], n, r[i]);
		return e.lerpPoint(t, a, r);
	}
	static isBounded(e) {
		return 0 <= e && e <= 100;
	}
	static nthVertex(t, n) {
		let r = e.Y_FROM_LINRGB[0], i = e.Y_FROM_LINRGB[1], a = e.Y_FROM_LINRGB[2], o = n % 4 <= 1 ? 0 : 100, s = n % 2 == 0 ? 0 : 100;
		if (n < 4) {
			let n = o, c = s, l = (t - n * i - c * a) / r;
			return e.isBounded(l) ? [
				l,
				n,
				c
			] : [
				-1,
				-1,
				-1
			];
		}
		if (n < 8) {
			let n = o, c = s, l = (t - c * r - n * a) / i;
			return e.isBounded(l) ? [
				c,
				l,
				n
			] : [
				-1,
				-1,
				-1
			];
		}
		{
			let n = o, c = s, l = (t - n * r - c * i) / a;
			return e.isBounded(l) ? [
				n,
				c,
				l
			] : [
				-1,
				-1,
				-1
			];
		}
	}
	static bisectToSegment(t, n) {
		let r = [
			-1,
			-1,
			-1
		], i = r, a = 0, o = 0, s = !1, c = !0;
		for (let l = 0; l < 12; l++) {
			let u = e.nthVertex(t, l);
			if (u[0] < 0) continue;
			let d = e.hueOf(u);
			s ? (c || e.areInCyclicOrder(a, d, o)) && (c = !1, e.areInCyclicOrder(a, n, d) ? (i = u, o = d) : (r = u, a = d)) : (r = u, i = u, a = d, o = d, s = !0);
		}
		return [r, i];
	}
	static midpoint(e, t) {
		return [
			(e[0] + t[0]) / 2,
			(e[1] + t[1]) / 2,
			(e[2] + t[2]) / 2
		];
	}
	static criticalPlaneBelow(e) {
		return Math.floor(e - .5);
	}
	static criticalPlaneAbove(e) {
		return Math.ceil(e - .5);
	}
	static bisectToLimit(t, n) {
		let r = e.bisectToSegment(t, n), i = r[0], a = e.hueOf(i), o = r[1];
		for (let t = 0; t < 3; t++) if (i[t] !== o[t]) {
			let r = -1, s = 255;
			i[t] < o[t] ? (r = e.criticalPlaneBelow(e.trueDelinearized(i[t])), s = e.criticalPlaneAbove(e.trueDelinearized(o[t]))) : (r = e.criticalPlaneAbove(e.trueDelinearized(i[t])), s = e.criticalPlaneBelow(e.trueDelinearized(o[t])));
			for (let c = 0; c < 8 && !(Math.abs(s - r) <= 1); c++) {
				let c = Math.floor((r + s) / 2), l = e.CRITICAL_PLANES[c], u = e.setCoordinate(i, l, o, t), d = e.hueOf(u);
				e.areInCyclicOrder(a, n, d) ? (o = u, s = c) : (i = u, a = d, r = c);
			}
		}
		return e.midpoint(i, o);
	}
	static inverseChromaticAdaptation(e) {
		let t = Math.abs(e), n = Math.max(0, 27.13 * t / (400 - t));
		return Fi(e) * n ** (1 / .42);
	}
	static findResultByJ(t, n, r) {
		let i = 11 * Math.sqrt(r), a = ca.DEFAULT, o = 1 / (1.64 - .29 ** a.n) ** .73, s = .25 * (Math.cos(t + 2) + 3.8) * (5e4 / 13) * a.nc * a.ncb, c = Math.sin(t), l = Math.cos(t);
		for (let t = 0; t < 5; t++) {
			let u = i / 100, d = ((n === 0 || i === 0 ? 0 : n / Math.sqrt(u)) * o) ** (1 / .9), f = a.aw * u ** (1 / a.c / a.z) / a.nbb, p = 23 * (f + .305) * d / (23 * s + 11 * d * l + 108 * d * c), m = p * l, h = p * c, g = (460 * f + 451 * m + 288 * h) / 1403, _ = (460 * f - 891 * m - 261 * h) / 1403, v = (460 * f - 220 * m - 6300 * h) / 1403, y = Hi([
				e.inverseChromaticAdaptation(g),
				e.inverseChromaticAdaptation(_),
				e.inverseChromaticAdaptation(v)
			], e.LINRGB_FROM_SCALED_DISCOUNT);
			if (y[0] < 0 || y[1] < 0 || y[2] < 0) return 0;
			let b = e.Y_FROM_LINRGB[0], x = e.Y_FROM_LINRGB[1], S = e.Y_FROM_LINRGB[2], C = b * y[0] + x * y[1] + S * y[2];
			if (C <= 0) return 0;
			if (t === 4 || Math.abs(C - r) < .002) return y[0] > 100.01 || y[1] > 100.01 || y[2] > 100.01 ? 0 : qi(y);
			i -= (C - r) * i / (2 * C);
		}
		return 0;
	}
	static solveToInt(t, n, r) {
		if (n < 1e-4 || r < 1e-4 || r > 99.9999) return $i(r);
		let i = (t = zi(t)) / 180 * Math.PI, a = ta(r), o = e.findResultByJ(i, n, a);
		return o === 0 ? qi(e.bisectToLimit(a, i)) : o;
	}
	static solveToCam(t, n, r) {
		return la.fromInt(e.solveToInt(t, n, r));
	}
};
ua.SCALED_DISCOUNT_FROM_LINRGB = [
	[
		.001200833568784504,
		.002389694492170889,
		.0002795742885861124
	],
	[
		.0005891086651375999,
		.0029785502573438758,
		.0003270666104008398
	],
	[
		.00010146692491640572,
		.0005364214359186694,
		.0032979401770712076
	]
], ua.LINRGB_FROM_SCALED_DISCOUNT = [
	[
		1373.2198709594231,
		-1100.4251190754821,
		-7.278681089101213
	],
	[
		-271.815969077903,
		559.6580465940733,
		-32.46047482791194
	],
	[
		1.9622899599665666,
		-57.173814538844006,
		308.7233197812385
	]
], ua.Y_FROM_LINRGB = [
	.2126,
	.7152,
	.0722
], ua.CRITICAL_PLANES = [
	.015176349177441876,
	.045529047532325624,
	.07588174588720938,
	.10623444424209313,
	.13658714259697685,
	.16693984095186062,
	.19729253930674434,
	.2276452376616281,
	.2579979360165119,
	.28835063437139563,
	.3188300904430532,
	.350925934958123,
	.3848314933096426,
	.42057480301049466,
	.458183274052838,
	.4976837250274023,
	.5391024159806381,
	.5824650784040898,
	.6277969426914107,
	.6751227633498623,
	.7244668422128921,
	.775853049866786,
	.829304845476233,
	.8848452951698498,
	.942497089126609,
	1.0022825574869039,
	1.0642236851973577,
	1.1283421258858297,
	1.1946592148522128,
	1.2631959812511864,
	1.3339731595349034,
	1.407011200216447,
	1.4823302800086415,
	1.5599503113873272,
	1.6398909516233677,
	1.7221716113234105,
	1.8068114625156377,
	1.8938294463134073,
	1.9832442801866852,
	2.075074464868551,
	2.1693382909216234,
	2.2660538449872063,
	2.36523901573795,
	2.4669114995532007,
	2.5710888059345764,
	2.6777882626779785,
	2.7870270208169257,
	2.898822059350997,
	3.0131901897720907,
	3.1301480604002863,
	3.2497121605402226,
	3.3718988244681087,
	3.4967242352587946,
	3.624204428461639,
	3.754355295633311,
	3.887192587735158,
	4.022731918402185,
	4.160988767090289,
	4.301978482107941,
	4.445716283538092,
	4.592217266055746,
	4.741496401646282,
	4.893568542229298,
	5.048448422192488,
	5.20615066083972,
	5.3666897647573375,
	5.5300801301023865,
	5.696336044816294,
	5.865471690767354,
	6.037501145825082,
	6.212438385869475,
	6.390297286737924,
	6.571091626112461,
	6.7548350853498045,
	6.941541251256611,
	7.131223617812143,
	7.323895587840543,
	7.5195704746346665,
	7.7182615035334345,
	7.919981813454504,
	8.124744458384042,
	8.332562408825165,
	8.543448553206703,
	8.757415699253682,
	8.974476575321063,
	9.194643831691977,
	9.417930041841839,
	9.644347703669503,
	9.873909240696694,
	10.106627003236781,
	10.342513269534024,
	10.58158024687427,
	10.8238400726681,
	11.069304815507364,
	11.317986476196008,
	11.569896988756009,
	11.825048221409341,
	12.083451977536606,
	12.345119996613247,
	12.610063955123938,
	12.878295467455942,
	13.149826086772048,
	13.42466730586372,
	13.702830557985108,
	13.984327217668513,
	14.269168601521828,
	14.55736596900856,
	14.848930523210871,
	15.143873411576273,
	15.44220572664832,
	15.743938506781891,
	16.04908273684337,
	16.35764934889634,
	16.66964922287304,
	16.985093187232053,
	17.30399201960269,
	17.62635644741625,
	17.95219714852476,
	18.281524751807332,
	18.614349837764564,
	18.95068293910138,
	19.290534541298456,
	19.633915083172692,
	19.98083495742689,
	20.331304511189067,
	20.685334046541502,
	21.042933821039977,
	21.404114048223256,
	21.76888489811322,
	22.137256497705877,
	22.50923893145328,
	22.884842241736916,
	23.264076429332462,
	23.6469514538663,
	24.033477234264016,
	24.42366364919083,
	24.817520537484558,
	25.21505769858089,
	25.61628489293138,
	26.021211842414342,
	26.429848230738664,
	26.842203703840827,
	27.258287870275353,
	27.678110301598522,
	28.10168053274597,
	28.529008062403893,
	28.96010235337422,
	29.39497283293396,
	29.83362889318845,
	30.276079891419332,
	30.722335150426627,
	31.172403958865512,
	31.62629557157785,
	32.08401920991837,
	32.54558406207592,
	33.010999283389665,
	33.4802739966603,
	33.953417292456834,
	34.430438229418264,
	34.911345834551085,
	35.39614910352207,
	35.88485700094671,
	36.37747846067349,
	36.87402238606382,
	37.37449765026789,
	37.87891309649659,
	38.38727753828926,
	38.89959975977785,
	39.41588851594697,
	39.93615253289054,
	40.460400508064545,
	40.98864111053629,
	41.520882981230194,
	42.05713473317016,
	42.597404951718396,
	43.141702194811224,
	43.6900349931913,
	44.24241185063697,
	44.798841244188324,
	45.35933162437017,
	45.92389141541209,
	46.49252901546552,
	47.065252796817916,
	47.64207110610409,
	48.22299226451468,
	48.808024568002054,
	49.3971762874833,
	49.9904556690408,
	50.587870934119984,
	51.189430279724725,
	51.79514187861014,
	52.40501387947288,
	53.0190544071392,
	53.637271562750364,
	54.259673423945976,
	54.88626804504493,
	55.517063457223934,
	56.15206766869424,
	56.79128866487574,
	57.43473440856916,
	58.08241284012621,
	58.734331877617365,
	59.39049941699807,
	60.05092333227251,
	60.715611475655585,
	61.38457167773311,
	62.057811747619894,
	62.7353394731159,
	63.417162620860914,
	64.10328893648692,
	64.79372614476921,
	65.48848194977529,
	66.18756403501224,
	66.89098006357258,
	67.59873767827808,
	68.31084450182222,
	69.02730813691093,
	69.74813616640164,
	70.47333615344107,
	71.20291564160104,
	71.93688215501312,
	72.67524319850172,
	73.41800625771542,
	74.16517879925733,
	74.9167682708136,
	75.67278210128072,
	76.43322770089146,
	77.1981124613393,
	77.96744375590167,
	78.74122893956174,
	79.51947534912904,
	80.30219030335869,
	81.08938110306934,
	81.88105503125999,
	82.67721935322541,
	83.4778813166706,
	84.28304815182372,
	85.09272707154808,
	85.90692527145302,
	86.72564993000343,
	87.54890820862819,
	88.3767072518277,
	89.2090541872801,
	90.04595612594655,
	90.88742016217518,
	91.73345337380438,
	92.58406282226491,
	93.43925555268066,
	94.29903859396902,
	95.16341895893969,
	96.03240364439274,
	96.9059996312159,
	97.78421388448044,
	98.6670533535366,
	99.55452497210776
];
var da = class e {
	static from(t, n, r) {
		return new e(ua.solveToInt(t, n, r));
	}
	static fromInt(t) {
		return new e(t);
	}
	toInt() {
		return this.argb;
	}
	get hue() {
		return this.internalHue;
	}
	set hue(e) {
		this.setInternalState(ua.solveToInt(e, this.internalChroma, this.internalTone));
	}
	get chroma() {
		return this.internalChroma;
	}
	set chroma(e) {
		this.setInternalState(ua.solveToInt(this.internalHue, e, this.internalTone));
	}
	get tone() {
		return this.internalTone;
	}
	set tone(e) {
		this.setInternalState(ua.solveToInt(this.internalHue, this.internalChroma, e));
	}
	constructor(e) {
		this.argb = e;
		let t = la.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = ea(e), this.argb = e;
	}
	setInternalState(e) {
		let t = la.fromInt(e);
		this.internalHue = t.hue, this.internalChroma = t.chroma, this.internalTone = ea(e), this.argb = e;
	}
	inViewingConditions(t) {
		let n = la.fromInt(this.toInt()).xyzInViewingConditions(t), r = la.fromXyzInViewingConditions(n[0], n[1], n[2], ca.make());
		return e.from(r.hue, r.chroma, na(n[1]));
	}
}, fa = class e {
	static harmonize(e, t) {
		let n = da.fromInt(e), r = da.fromInt(t), i = Vi(n.hue, r.hue), a = Math.min(.5 * i, 15), o = zi(n.hue + a * Bi(n.hue, r.hue));
		return da.from(o, n.chroma, n.tone).toInt();
	}
	static hctHue(t, n, r) {
		let i = e.cam16Ucs(t, n, r), a = la.fromInt(i), o = la.fromInt(t);
		return da.from(a.hue, o.chroma, ea(t)).toInt();
	}
	static cam16Ucs(e, t, n) {
		let r = la.fromInt(e), i = la.fromInt(t), a = r.jstar, o = r.astar, s = r.bstar, c = a + (i.jstar - a) * n, l = o + (i.astar - o) * n, u = s + (i.bstar - s) * n;
		return la.fromUcs(c, l, u).toInt();
	}
}, pa = class e {
	static ratioOfTones(t, n) {
		return t = Ri(0, 100, t), n = Ri(0, 100, n), e.ratioOfYs(ta(t), ta(n));
	}
	static ratioOfYs(e, t) {
		let n = e > t ? e : t;
		return (n + 5) / ((n === t ? e : t) + 5);
	}
	static lighter(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = ta(t), i = n * (r + 5) - 5, a = e.ratioOfYs(i, r), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = na(i) + .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static darker(t, n) {
		if (t < 0 || t > 100) return -1;
		let r = ta(t), i = (r + 5) / n - 5, a = e.ratioOfYs(r, i), o = Math.abs(a - n);
		if (a < n && o > .04) return -1;
		let s = na(i) - .4;
		return s < 0 || s > 100 ? -1 : s;
	}
	static lighterUnsafe(t, n) {
		let r = e.lighter(t, n);
		return r < 0 ? 100 : r;
	}
	static darkerUnsafe(t, n) {
		let r = e.darker(t, n);
		return r < 0 ? 0 : r;
	}
}, ma = class e {
	static isDisliked(e) {
		let t = Math.round(e.hue) >= 90 && Math.round(e.hue) <= 111, n = Math.round(e.chroma) > 16, r = Math.round(e.tone) < 65;
		return t && n && r;
	}
	static fixIfDisliked(t) {
		return e.isDisliked(t) ? da.from(t.hue, t.chroma, 70) : t;
	}
}, G = class e {
	static fromPalette(t) {
		return new e(t.name ?? "", t.palette, t.tone, t.isBackground ?? !1, t.background, t.secondBackground, t.contrastCurve, t.toneDeltaPair);
	}
	constructor(e, t, n, r, i, a, o, s) {
		if (this.name = e, this.palette = t, this.tone = n, this.isBackground = r, this.background = i, this.secondBackground = a, this.contrastCurve = o, this.toneDeltaPair = s, this.hctCache = /* @__PURE__ */ new Map(), !i && a) throw Error(`Color ${e} has secondBackgrounddefined, but background is not defined.`);
		if (!i && o) throw Error(`Color ${e} has contrastCurvedefined, but background is not defined.`);
		if (i && !o) throw Error(`Color ${e} has backgrounddefined, but contrastCurve is not defined.`);
	}
	getArgb(e) {
		return this.getHct(e).toInt();
	}
	getHct(e) {
		let t = this.hctCache.get(e);
		if (t != null) return t;
		let n = this.getTone(e), r = this.palette(e).getHct(n);
		return this.hctCache.size > 4 && this.hctCache.clear(), this.hctCache.set(e, r), r;
	}
	getTone(t) {
		let n = t.contrastLevel < 0;
		if (this.toneDeltaPair) {
			let r = this.toneDeltaPair(t), i = r.roleA, a = r.roleB, o = r.delta, s = r.polarity, c = r.stayTogether, l = this.background(t).getTone(t), u = s === "nearer" || s === "lighter" && !t.isDark || s === "darker" && t.isDark, d = u ? i : a, f = u ? a : i, p = this.name === d.name, m = t.isDark ? 1 : -1, h = d.contrastCurve.getContrast(t.contrastLevel), g = f.contrastCurve.getContrast(t.contrastLevel), _ = d.tone(t), v = pa.ratioOfTones(l, _) >= h ? _ : e.foregroundTone(l, h), y = f.tone(t), b = pa.ratioOfTones(l, y) >= g ? y : e.foregroundTone(l, g);
			return n && (v = e.foregroundTone(l, h), b = e.foregroundTone(l, g)), (b - v) * m >= o || (b = Ri(0, 100, v + o * m), (b - v) * m >= o || (v = Ri(0, 100, b - o * m))), 50 <= v && v < 60 ? m > 0 ? (v = 60, b = Math.max(b, v + o * m)) : (v = 49, b = Math.min(b, v + o * m)) : 50 <= b && b < 60 && (c ? m > 0 ? (v = 60, b = Math.max(b, v + o * m)) : (v = 49, b = Math.min(b, v + o * m)) : b = m > 0 ? 60 : 49), p ? v : b;
		}
		{
			let r = this.tone(t);
			if (this.background == null) return r;
			let i = this.background(t).getTone(t), a = this.contrastCurve.getContrast(t.contrastLevel);
			if (pa.ratioOfTones(i, r) >= a || (r = e.foregroundTone(i, a)), n && (r = e.foregroundTone(i, a)), this.isBackground && 50 <= r && r < 60 && (r = pa.ratioOfTones(49, i) >= a ? 49 : 60), this.secondBackground) {
				let [n, i] = [this.background, this.secondBackground], [o, s] = [n(t).getTone(t), i(t).getTone(t)], [c, l] = [Math.max(o, s), Math.min(o, s)];
				if (pa.ratioOfTones(c, r) >= a && pa.ratioOfTones(l, r) >= a) return r;
				let u = pa.lighter(c, a), d = pa.darker(l, a), f = [];
				return u !== -1 && f.push(u), d !== -1 && f.push(d), e.tonePrefersLightForeground(o) || e.tonePrefersLightForeground(s) ? u < 0 ? 100 : u : f.length === 1 ? f[0] : d < 0 ? 0 : d;
			}
			return r;
		}
	}
	static foregroundTone(t, n) {
		let r = pa.lighterUnsafe(t, n), i = pa.darkerUnsafe(t, n), a = pa.ratioOfTones(r, t), o = pa.ratioOfTones(i, t);
		if (e.tonePrefersLightForeground(t)) {
			let e = Math.abs(a - o) < .1 && a < n && o < n;
			return a >= n || a >= o || e ? r : i;
		}
		return o >= n || o >= a ? i : r;
	}
	static tonePrefersLightForeground(e) {
		return Math.round(e) < 60;
	}
	static toneAllowsLightForeground(e) {
		return Math.round(e) <= 49;
	}
	static enableLightForeground(t) {
		return e.tonePrefersLightForeground(t) && !e.toneAllowsLightForeground(t) ? 49 : t;
	}
}, ha;
(function(e) {
	e[e.MONOCHROME = 0] = "MONOCHROME", e[e.NEUTRAL = 1] = "NEUTRAL", e[e.TONAL_SPOT = 2] = "TONAL_SPOT", e[e.VIBRANT = 3] = "VIBRANT", e[e.EXPRESSIVE = 4] = "EXPRESSIVE", e[e.FIDELITY = 5] = "FIDELITY", e[e.CONTENT = 6] = "CONTENT", e[e.RAINBOW = 7] = "RAINBOW", e[e.FRUIT_SALAD = 8] = "FRUIT_SALAD";
})(ha ||= {});
var K = class {
	constructor(e, t, n, r) {
		this.low = e, this.normal = t, this.medium = n, this.high = r;
	}
	getContrast(e) {
		return e <= -1 ? this.low : e < 0 ? Ii(this.low, this.normal, (e - -1) / 1) : e < .5 ? Ii(this.normal, this.medium, (e - 0) / .5) : e < 1 ? Ii(this.medium, this.high, (e - .5) / .5) : this.high;
	}
}, ga = class {
	constructor(e, t, n, r, i) {
		this.roleA = e, this.roleB = t, this.delta = n, this.polarity = r, this.stayTogether = i;
	}
};
function _a(e) {
	return e.variant === ha.FIDELITY || e.variant === ha.CONTENT;
}
function va(e) {
	return e.variant === ha.MONOCHROME;
}
function ya(e, t, n, r) {
	let i = n, a = da.from(e, t, n);
	if (a.chroma < t) {
		let n = a.chroma;
		for (; a.chroma < t;) {
			i += r ? -1 : 1;
			let o = da.from(e, t, i);
			if (n > o.chroma || Math.abs(o.chroma - t) < .4) break;
			Math.abs(o.chroma - t) < Math.abs(a.chroma - t) && (a = o), n = Math.max(n, o.chroma);
		}
	}
	return i;
}
function ba(e) {
	return ca.make(void 0, void 0, e.isDark ? 30 : 80, void 0, void 0);
}
function xa(e, t) {
	let n = e.inViewingConditions(ba(t));
	return G.tonePrefersLightForeground(e.tone) && !G.toneAllowsLightForeground(n.tone) ? G.enableLightForeground(e.tone) : G.enableLightForeground(n.tone);
}
var q = class e {
	static highestSurface(t) {
		return t.isDark ? e.surfaceBright : e.surfaceDim;
	}
};
q.contentAccentToneDelta = 15, q.primaryPaletteKeyColor = G.fromPalette({
	name: "primary_palette_key_color",
	palette: (e) => e.primaryPalette,
	tone: (e) => e.primaryPalette.keyColor.tone
}), q.secondaryPaletteKeyColor = G.fromPalette({
	name: "secondary_palette_key_color",
	palette: (e) => e.secondaryPalette,
	tone: (e) => e.secondaryPalette.keyColor.tone
}), q.tertiaryPaletteKeyColor = G.fromPalette({
	name: "tertiary_palette_key_color",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => e.tertiaryPalette.keyColor.tone
}), q.neutralPaletteKeyColor = G.fromPalette({
	name: "neutral_palette_key_color",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.neutralPalette.keyColor.tone
}), q.neutralVariantPaletteKeyColor = G.fromPalette({
	name: "neutral_variant_palette_key_color",
	palette: (e) => e.neutralVariantPalette,
	tone: (e) => e.neutralVariantPalette.keyColor.tone
}), q.background = G.fromPalette({
	name: "background",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 6 : 98,
	isBackground: !0
}), q.onBackground = G.fromPalette({
	name: "on_background",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 90 : 10,
	background: (e) => q.background,
	contrastCurve: new K(3, 3, 4.5, 7)
}), q.surface = G.fromPalette({
	name: "surface",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 6 : 98,
	isBackground: !0
}), q.surfaceDim = G.fromPalette({
	name: "surface_dim",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 6 : 87,
	isBackground: !0
}), q.surfaceBright = G.fromPalette({
	name: "surface_bright",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 24 : 98,
	isBackground: !0
}), q.surfaceContainerLowest = G.fromPalette({
	name: "surface_container_lowest",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 4 : 100,
	isBackground: !0
}), q.surfaceContainerLow = G.fromPalette({
	name: "surface_container_low",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 10 : 96,
	isBackground: !0
}), q.surfaceContainer = G.fromPalette({
	name: "surface_container",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 12 : 94,
	isBackground: !0
}), q.surfaceContainerHigh = G.fromPalette({
	name: "surface_container_high",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 17 : 92,
	isBackground: !0
}), q.surfaceContainerHighest = G.fromPalette({
	name: "surface_container_highest",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 22 : 90,
	isBackground: !0
}), q.onSurface = G.fromPalette({
	name: "on_surface",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 90 : 10,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.surfaceVariant = G.fromPalette({
	name: "surface_variant",
	palette: (e) => e.neutralVariantPalette,
	tone: (e) => e.isDark ? 30 : 90,
	isBackground: !0
}), q.onSurfaceVariant = G.fromPalette({
	name: "on_surface_variant",
	palette: (e) => e.neutralVariantPalette,
	tone: (e) => e.isDark ? 80 : 30,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(3, 4.5, 7, 11)
}), q.inverseSurface = G.fromPalette({
	name: "inverse_surface",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 90 : 20
}), q.inverseOnSurface = G.fromPalette({
	name: "inverse_on_surface",
	palette: (e) => e.neutralPalette,
	tone: (e) => e.isDark ? 20 : 95,
	background: (e) => q.inverseSurface,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.outline = G.fromPalette({
	name: "outline",
	palette: (e) => e.neutralVariantPalette,
	tone: (e) => e.isDark ? 60 : 50,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1.5, 3, 4.5, 7)
}), q.outlineVariant = G.fromPalette({
	name: "outline_variant",
	palette: (e) => e.neutralVariantPalette,
	tone: (e) => e.isDark ? 30 : 80,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7)
}), q.shadow = G.fromPalette({
	name: "shadow",
	palette: (e) => e.neutralPalette,
	tone: (e) => 0
}), q.scrim = G.fromPalette({
	name: "scrim",
	palette: (e) => e.neutralPalette,
	tone: (e) => 0
}), q.surfaceTint = G.fromPalette({
	name: "surface_tint",
	palette: (e) => e.primaryPalette,
	tone: (e) => e.isDark ? 80 : 40,
	isBackground: !0
}), q.primary = G.fromPalette({
	name: "primary",
	palette: (e) => e.primaryPalette,
	tone: (e) => va(e) ? e.isDark ? 100 : 0 : e.isDark ? 80 : 40,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(3, 4.5, 7, 11),
	toneDeltaPair: (e) => new ga(q.primaryContainer, q.primary, 15, "nearer", !1)
}), q.onPrimary = G.fromPalette({
	name: "on_primary",
	palette: (e) => e.primaryPalette,
	tone: (e) => va(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
	background: (e) => q.primary,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.primaryContainer = G.fromPalette({
	name: "primary_container",
	palette: (e) => e.primaryPalette,
	tone: (e) => _a(e) ? xa(e.sourceColorHct, e) : va(e) ? e.isDark ? 85 : 25 : e.isDark ? 30 : 90,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.primaryContainer, q.primary, 15, "nearer", !1)
}), q.onPrimaryContainer = G.fromPalette({
	name: "on_primary_container",
	palette: (e) => e.primaryPalette,
	tone: (e) => _a(e) ? G.foregroundTone(q.primaryContainer.tone(e), 4.5) : va(e) ? e.isDark ? 0 : 100 : e.isDark ? 90 : 10,
	background: (e) => q.primaryContainer,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.inversePrimary = G.fromPalette({
	name: "inverse_primary",
	palette: (e) => e.primaryPalette,
	tone: (e) => e.isDark ? 40 : 80,
	background: (e) => q.inverseSurface,
	contrastCurve: new K(3, 4.5, 7, 11)
}), q.secondary = G.fromPalette({
	name: "secondary",
	palette: (e) => e.secondaryPalette,
	tone: (e) => e.isDark ? 80 : 40,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(3, 4.5, 7, 11),
	toneDeltaPair: (e) => new ga(q.secondaryContainer, q.secondary, 15, "nearer", !1)
}), q.onSecondary = G.fromPalette({
	name: "on_secondary",
	palette: (e) => e.secondaryPalette,
	tone: (e) => va(e) ? e.isDark ? 10 : 100 : e.isDark ? 20 : 100,
	background: (e) => q.secondary,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.secondaryContainer = G.fromPalette({
	name: "secondary_container",
	palette: (e) => e.secondaryPalette,
	tone: (e) => {
		let t = e.isDark ? 30 : 90;
		if (va(e)) return e.isDark ? 30 : 85;
		if (!_a(e)) return t;
		let n = ya(e.secondaryPalette.hue, e.secondaryPalette.chroma, t, !e.isDark);
		return n = xa(e.secondaryPalette.getHct(n), e), n;
	},
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.secondaryContainer, q.secondary, 15, "nearer", !1)
}), q.onSecondaryContainer = G.fromPalette({
	name: "on_secondary_container",
	palette: (e) => e.secondaryPalette,
	tone: (e) => _a(e) ? G.foregroundTone(q.secondaryContainer.tone(e), 4.5) : e.isDark ? 90 : 10,
	background: (e) => q.secondaryContainer,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.tertiary = G.fromPalette({
	name: "tertiary",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => va(e) ? e.isDark ? 90 : 25 : e.isDark ? 80 : 40,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(3, 4.5, 7, 11),
	toneDeltaPair: (e) => new ga(q.tertiaryContainer, q.tertiary, 15, "nearer", !1)
}), q.onTertiary = G.fromPalette({
	name: "on_tertiary",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => va(e) ? e.isDark ? 10 : 90 : e.isDark ? 20 : 100,
	background: (e) => q.tertiary,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.tertiaryContainer = G.fromPalette({
	name: "tertiary_container",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => {
		if (va(e)) return e.isDark ? 60 : 49;
		if (!_a(e)) return e.isDark ? 30 : 90;
		let t = xa(e.tertiaryPalette.getHct(e.sourceColorHct.tone), e), n = e.tertiaryPalette.getHct(t);
		return ma.fixIfDisliked(n).tone;
	},
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.tertiaryContainer, q.tertiary, 15, "nearer", !1)
}), q.onTertiaryContainer = G.fromPalette({
	name: "on_tertiary_container",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => va(e) ? e.isDark ? 0 : 100 : _a(e) ? G.foregroundTone(q.tertiaryContainer.tone(e), 4.5) : e.isDark ? 90 : 10,
	background: (e) => q.tertiaryContainer,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.error = G.fromPalette({
	name: "error",
	palette: (e) => e.errorPalette,
	tone: (e) => e.isDark ? 80 : 40,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(3, 4.5, 7, 11),
	toneDeltaPair: (e) => new ga(q.errorContainer, q.error, 15, "nearer", !1)
}), q.onError = G.fromPalette({
	name: "on_error",
	palette: (e) => e.errorPalette,
	tone: (e) => e.isDark ? 20 : 100,
	background: (e) => q.error,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.errorContainer = G.fromPalette({
	name: "error_container",
	palette: (e) => e.errorPalette,
	tone: (e) => e.isDark ? 30 : 90,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.errorContainer, q.error, 15, "nearer", !1)
}), q.onErrorContainer = G.fromPalette({
	name: "on_error_container",
	palette: (e) => e.errorPalette,
	tone: (e) => e.isDark ? 90 : 10,
	background: (e) => q.errorContainer,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.primaryFixed = G.fromPalette({
	name: "primary_fixed",
	palette: (e) => e.primaryPalette,
	tone: (e) => va(e) ? 40 : 90,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.primaryFixed, q.primaryFixedDim, 10, "lighter", !0)
}), q.primaryFixedDim = G.fromPalette({
	name: "primary_fixed_dim",
	palette: (e) => e.primaryPalette,
	tone: (e) => va(e) ? 30 : 80,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.primaryFixed, q.primaryFixedDim, 10, "lighter", !0)
}), q.onPrimaryFixed = G.fromPalette({
	name: "on_primary_fixed",
	palette: (e) => e.primaryPalette,
	tone: (e) => va(e) ? 100 : 10,
	background: (e) => q.primaryFixedDim,
	secondBackground: (e) => q.primaryFixed,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.onPrimaryFixedVariant = G.fromPalette({
	name: "on_primary_fixed_variant",
	palette: (e) => e.primaryPalette,
	tone: (e) => va(e) ? 90 : 30,
	background: (e) => q.primaryFixedDim,
	secondBackground: (e) => q.primaryFixed,
	contrastCurve: new K(3, 4.5, 7, 11)
}), q.secondaryFixed = G.fromPalette({
	name: "secondary_fixed",
	palette: (e) => e.secondaryPalette,
	tone: (e) => va(e) ? 80 : 90,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.secondaryFixed, q.secondaryFixedDim, 10, "lighter", !0)
}), q.secondaryFixedDim = G.fromPalette({
	name: "secondary_fixed_dim",
	palette: (e) => e.secondaryPalette,
	tone: (e) => va(e) ? 70 : 80,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.secondaryFixed, q.secondaryFixedDim, 10, "lighter", !0)
}), q.onSecondaryFixed = G.fromPalette({
	name: "on_secondary_fixed",
	palette: (e) => e.secondaryPalette,
	tone: (e) => 10,
	background: (e) => q.secondaryFixedDim,
	secondBackground: (e) => q.secondaryFixed,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.onSecondaryFixedVariant = G.fromPalette({
	name: "on_secondary_fixed_variant",
	palette: (e) => e.secondaryPalette,
	tone: (e) => va(e) ? 25 : 30,
	background: (e) => q.secondaryFixedDim,
	secondBackground: (e) => q.secondaryFixed,
	contrastCurve: new K(3, 4.5, 7, 11)
}), q.tertiaryFixed = G.fromPalette({
	name: "tertiary_fixed",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => va(e) ? 40 : 90,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.tertiaryFixed, q.tertiaryFixedDim, 10, "lighter", !0)
}), q.tertiaryFixedDim = G.fromPalette({
	name: "tertiary_fixed_dim",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => va(e) ? 30 : 80,
	isBackground: !0,
	background: (e) => q.highestSurface(e),
	contrastCurve: new K(1, 1, 3, 7),
	toneDeltaPair: (e) => new ga(q.tertiaryFixed, q.tertiaryFixedDim, 10, "lighter", !0)
}), q.onTertiaryFixed = G.fromPalette({
	name: "on_tertiary_fixed",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => va(e) ? 100 : 10,
	background: (e) => q.tertiaryFixedDim,
	secondBackground: (e) => q.tertiaryFixed,
	contrastCurve: new K(4.5, 7, 11, 21)
}), q.onTertiaryFixedVariant = G.fromPalette({
	name: "on_tertiary_fixed_variant",
	palette: (e) => e.tertiaryPalette,
	tone: (e) => va(e) ? 90 : 30,
	background: (e) => q.tertiaryFixedDim,
	secondBackground: (e) => q.tertiaryFixed,
	contrastCurve: new K(3, 4.5, 7, 11)
});
var Sa = class e {
	static fromInt(t) {
		let n = da.fromInt(t);
		return e.fromHct(n);
	}
	static fromHct(t) {
		return new e(t.hue, t.chroma, t);
	}
	static fromHueAndChroma(t, n) {
		return new e(t, n, e.createKeyColor(t, n));
	}
	constructor(e, t, n) {
		this.hue = e, this.chroma = t, this.keyColor = n, this.cache = /* @__PURE__ */ new Map();
	}
	static createKeyColor(e, t) {
		let n = da.from(e, t, 50), r = Math.abs(n.chroma - t);
		for (let i = 1; i < 50; i += 1) {
			if (Math.round(t) === Math.round(n.chroma)) return n;
			let a = da.from(e, t, 50 + i), o = Math.abs(a.chroma - t);
			o < r && (r = o, n = a);
			let s = da.from(e, t, 50 - i), c = Math.abs(s.chroma - t);
			c < r && (r = c, n = s);
		}
		return n;
	}
	tone(e) {
		let t = this.cache.get(e);
		return t === void 0 && (t = da.from(this.hue, this.chroma, e).toInt(), this.cache.set(e, t)), t;
	}
	getHct(e) {
		return da.fromInt(this.tone(e));
	}
}, Ca = class e {
	static of(t) {
		return new e(t, !1);
	}
	static contentOf(t) {
		return new e(t, !0);
	}
	static fromColors(t) {
		return e.createPaletteFromColors(!1, t);
	}
	static contentFromColors(t) {
		return e.createPaletteFromColors(!0, t);
	}
	static createPaletteFromColors(t, n) {
		let r = new e(n.primary, t);
		return n.secondary && (r.a2 = new e(n.secondary, t).a1), n.tertiary && (r.a3 = new e(n.tertiary, t).a1), n.error && (r.error = new e(n.error, t).a1), n.neutral && (r.n1 = new e(n.neutral, t).n1), n.neutralVariant && (r.n2 = new e(n.neutralVariant, t).n2), r;
	}
	constructor(e, t) {
		let n = da.fromInt(e), r = n.hue, i = n.chroma;
		t ? (this.a1 = Sa.fromHueAndChroma(r, i), this.a2 = Sa.fromHueAndChroma(r, i / 3), this.a3 = Sa.fromHueAndChroma(r + 60, i / 2), this.n1 = Sa.fromHueAndChroma(r, Math.min(i / 12, 4)), this.n2 = Sa.fromHueAndChroma(r, Math.min(i / 6, 8))) : (this.a1 = Sa.fromHueAndChroma(r, Math.max(48, i)), this.a2 = Sa.fromHueAndChroma(r, 16), this.a3 = Sa.fromHueAndChroma(r + 60, 24), this.n1 = Sa.fromHueAndChroma(r, 4), this.n2 = Sa.fromHueAndChroma(r, 8)), this.error = Sa.fromHueAndChroma(25, 84);
	}
}, wa = class e {
	get primary() {
		return this.props.primary;
	}
	get onPrimary() {
		return this.props.onPrimary;
	}
	get primaryContainer() {
		return this.props.primaryContainer;
	}
	get onPrimaryContainer() {
		return this.props.onPrimaryContainer;
	}
	get secondary() {
		return this.props.secondary;
	}
	get onSecondary() {
		return this.props.onSecondary;
	}
	get secondaryContainer() {
		return this.props.secondaryContainer;
	}
	get onSecondaryContainer() {
		return this.props.onSecondaryContainer;
	}
	get tertiary() {
		return this.props.tertiary;
	}
	get onTertiary() {
		return this.props.onTertiary;
	}
	get tertiaryContainer() {
		return this.props.tertiaryContainer;
	}
	get onTertiaryContainer() {
		return this.props.onTertiaryContainer;
	}
	get error() {
		return this.props.error;
	}
	get onError() {
		return this.props.onError;
	}
	get errorContainer() {
		return this.props.errorContainer;
	}
	get onErrorContainer() {
		return this.props.onErrorContainer;
	}
	get background() {
		return this.props.background;
	}
	get onBackground() {
		return this.props.onBackground;
	}
	get surface() {
		return this.props.surface;
	}
	get onSurface() {
		return this.props.onSurface;
	}
	get surfaceVariant() {
		return this.props.surfaceVariant;
	}
	get onSurfaceVariant() {
		return this.props.onSurfaceVariant;
	}
	get outline() {
		return this.props.outline;
	}
	get outlineVariant() {
		return this.props.outlineVariant;
	}
	get shadow() {
		return this.props.shadow;
	}
	get scrim() {
		return this.props.scrim;
	}
	get inverseSurface() {
		return this.props.inverseSurface;
	}
	get inverseOnSurface() {
		return this.props.inverseOnSurface;
	}
	get inversePrimary() {
		return this.props.inversePrimary;
	}
	static light(t) {
		return e.lightFromCorePalette(Ca.of(t));
	}
	static dark(t) {
		return e.darkFromCorePalette(Ca.of(t));
	}
	static lightContent(t) {
		return e.lightFromCorePalette(Ca.contentOf(t));
	}
	static darkContent(t) {
		return e.darkFromCorePalette(Ca.contentOf(t));
	}
	static lightFromCorePalette(t) {
		return new e({
			primary: t.a1.tone(40),
			onPrimary: t.a1.tone(100),
			primaryContainer: t.a1.tone(90),
			onPrimaryContainer: t.a1.tone(10),
			secondary: t.a2.tone(40),
			onSecondary: t.a2.tone(100),
			secondaryContainer: t.a2.tone(90),
			onSecondaryContainer: t.a2.tone(10),
			tertiary: t.a3.tone(40),
			onTertiary: t.a3.tone(100),
			tertiaryContainer: t.a3.tone(90),
			onTertiaryContainer: t.a3.tone(10),
			error: t.error.tone(40),
			onError: t.error.tone(100),
			errorContainer: t.error.tone(90),
			onErrorContainer: t.error.tone(10),
			background: t.n1.tone(99),
			onBackground: t.n1.tone(10),
			surface: t.n1.tone(99),
			onSurface: t.n1.tone(10),
			surfaceVariant: t.n2.tone(90),
			onSurfaceVariant: t.n2.tone(30),
			outline: t.n2.tone(50),
			outlineVariant: t.n2.tone(80),
			shadow: t.n1.tone(0),
			scrim: t.n1.tone(0),
			inverseSurface: t.n1.tone(20),
			inverseOnSurface: t.n1.tone(95),
			inversePrimary: t.a1.tone(80)
		});
	}
	static darkFromCorePalette(t) {
		return new e({
			primary: t.a1.tone(80),
			onPrimary: t.a1.tone(20),
			primaryContainer: t.a1.tone(30),
			onPrimaryContainer: t.a1.tone(90),
			secondary: t.a2.tone(80),
			onSecondary: t.a2.tone(20),
			secondaryContainer: t.a2.tone(30),
			onSecondaryContainer: t.a2.tone(90),
			tertiary: t.a3.tone(80),
			onTertiary: t.a3.tone(20),
			tertiaryContainer: t.a3.tone(30),
			onTertiaryContainer: t.a3.tone(90),
			error: t.error.tone(80),
			onError: t.error.tone(20),
			errorContainer: t.error.tone(30),
			onErrorContainer: t.error.tone(80),
			background: t.n1.tone(10),
			onBackground: t.n1.tone(90),
			surface: t.n1.tone(10),
			onSurface: t.n1.tone(90),
			surfaceVariant: t.n2.tone(30),
			onSurfaceVariant: t.n2.tone(80),
			outline: t.n2.tone(60),
			outlineVariant: t.n2.tone(30),
			shadow: t.n1.tone(0),
			scrim: t.n1.tone(0),
			inverseSurface: t.n1.tone(90),
			inverseOnSurface: t.n1.tone(20),
			inversePrimary: t.a1.tone(40)
		});
	}
	constructor(e) {
		this.props = e;
	}
	toJSON() {
		return { ...this.props };
	}
};
function Ta(e) {
	let t = Ji(e), n = Yi(e), r = Xi(e), i = [
		t.toString(16),
		n.toString(16),
		r.toString(16)
	];
	for (let [e, t] of i.entries()) t.length === 1 && (i[e] = "0" + t);
	return "#" + i.join("");
}
function Ea(e) {
	let t = (e = e.replace("#", "")).length === 3, n = e.length === 6, r = e.length === 8;
	if (!t && !n && !r) throw Error("unexpected hex " + e);
	let i = 0, a = 0, o = 0;
	return t ? (i = Da(e.slice(0, 1).repeat(2)), a = Da(e.slice(1, 2).repeat(2)), o = Da(e.slice(2, 3).repeat(2))) : n ? (i = Da(e.slice(0, 2)), a = Da(e.slice(2, 4)), o = Da(e.slice(4, 6))) : r && (i = Da(e.slice(2, 4)), a = Da(e.slice(4, 6)), o = Da(e.slice(6, 8))), (255 << 24 | (255 & i) << 16 | (255 & a) << 8 | 255 & o) >>> 0;
}
function Da(e) {
	return parseInt(e, 16);
}
function Oa(e, t) {
	t === void 0 && (t = []);
	let n = Ca.of(e);
	return {
		source: e,
		schemes: {
			light: wa.light(e),
			dark: wa.dark(e)
		},
		palettes: {
			primary: n.a1,
			secondary: n.a2,
			tertiary: n.a3,
			neutral: n.n1,
			neutralVariant: n.n2,
			error: n.error
		},
		customColors: t.map((t) => ka(e, t))
	};
}
function ka(e, t) {
	let n = t.value, r = n, i = e;
	t.blend && (n = fa.harmonize(r, i));
	let a = Ca.of(n).a1;
	return {
		color: t,
		value: n,
		light: {
			color: a.tone(40),
			onColor: a.tone(100),
			colorContainer: a.tone(90),
			onColorContainer: a.tone(10)
		},
		dark: {
			color: a.tone(80),
			onColor: a.tone(20),
			colorContainer: a.tone(30),
			onColorContainer: a.tone(90)
		}
	};
}
//#endregion
//#region node_modules/framework7/shared/material-colors.js
function Aa(e) {
	let t = Math.round, n = e.length, r = {};
	return e.slice(0, 3).toLowerCase() === "rgb" ? (e = e.replace(" ", "").split(","), r[0] = parseInt(e[0].slice(e[3].toLowerCase() === "a" ? 5 : 4), 10), r[1] = parseInt(e[1], 10), r[2] = parseInt(e[2], 10), r[3] = e[3] ? parseFloat(e[3]) : -1) : (e = parseInt(n < 6 ? String(e[1]) + e[1] + e[2] + e[2] + e[3] + e[3] + (n > 4 ? String(e[4]) + e[4] : "") : e.slice(1), 16), r[0] = e >> 16 & 255, r[1] = e >> 8 & 255, r[2] = e & 255, r[3] = n === 9 || n === 5 ? t((e >> 24 & 255) / 255 * 1e4) / 1e4 : -1), r;
}
function ja(e, t, n) {
	n === void 0 && (n = .5);
	let r = Math.round;
	e = e.trim(), t = t.trim(), n = n < 0 ? n * -1 : n;
	let i = Aa(e), a = Aa(t);
	return t[0] === "r" ? "rgb" + (t[3] === "a" ? "a(" : "(") + r((a[0] - i[0]) * n + i[0]) + "," + r((a[1] - i[1]) * n + i[1]) + "," + r((a[2] - i[2]) * n + i[2]) + (i[3] < 0 && a[3] < 0 ? "" : "," + (i[3] > -1 && a[3] > -1 ? r(((a[3] - i[3]) * n + i[3]) * 1e4) / 1e4 : a[3] < 0 ? i[3] : a[3])) + ")" : "#" + (4294967296 + (i[3] > -1 && a[3] > -1 ? r(((a[3] - i[3]) * n + i[3]) * 255) : a[3] > -1 ? r(a[3] * 255) : i[3] > -1 ? r(i[3] * 255) : 255) * 16777216 + r((a[0] - i[0]) * n + i[0]) * 65536 + r((a[1] - i[1]) * n + i[1]) * 256 + r((a[2] - i[2]) * n + i[2])).toString(16).slice(i[3] > -1 || a[3] > -1 ? 1 : 3);
}
var Ma = function(e) {
	e === void 0 && (e = "");
	let t = Oa(Ea(`#${e.replace("#", "")}`));
	[
		.05,
		.08,
		.11,
		.12,
		.14
	].forEach((e, n) => {
		t.schemes.light.props[`surface${n + 1}`] = Ea(ja(Ta(t.schemes.light.props.surface), Ta(t.schemes.light.props.primary), e)), t.schemes.dark.props[`surface${n + 1}`] = Ea(ja(Ta(t.schemes.dark.props.surface), Ta(t.schemes.dark.props.primary), e));
	});
	let n = (e) => e.split("").map((e) => e.toUpperCase() === e && e !== "-" && e !== "7" ? `-${e.toLowerCase()}` : e).join(""), r = (e) => [
		"tertiary",
		"shadow",
		"scrim",
		"error",
		"background"
	].filter((t) => e.toLowerCase().includes(t)).length > 0, i = {}, a = {};
	return Object.keys(t.schemes.light.props).forEach((e) => {
		r(e) || (i[n(`--f7-md-${e}`)] = Ta(t.schemes.light.props[e]));
	}), Object.keys(t.schemes.dark.props).forEach((e) => {
		r(e) || (a[n(`--f7-md-${e}`)] = Ta(t.schemes.dark.props[e]));
	}), {
		light: i,
		dark: a
	};
}, Na = /* @__PURE__ */ n({
	bindMethods: () => ao,
	cancelAnimationFrame: () => Ha,
	colorHexToRgb: () => Za,
	colorHsbToHsl: () => to,
	colorHslToHsb: () => no,
	colorHslToRgb: () => eo,
	colorRgbToHex: () => Qa,
	colorRgbToHsl: () => $a,
	colorThemeCSSProperties: () => io,
	colorThemeCSSStyles: () => so,
	deleteProps: () => Ba,
	eventNameToColonCase: () => za,
	extend: () => J,
	flattenArray: () => oo,
	getTranslate: () => qa,
	id: () => Ia,
	iosPreloaderContent: () => Ra,
	isObject: () => Ya,
	mdPreloaderContent: () => La,
	merge: () => Xa,
	nextFrame: () => Wa,
	nextTick: () => Ua,
	now: () => Ga,
	parseUrlQuery: () => Ka,
	requestAnimationFrame: () => Va,
	serializeObject: () => Ja,
	uniqueNumber: () => Fa
}), Pa = 0;
function Fa() {
	return Pa += 1, Pa;
}
function Ia(e, t) {
	e === void 0 && (e = "xxxxxxxxxx"), t === void 0 && (t = "0123456789abcdef");
	let n = t.length;
	return e.replace(/x/g, () => t[Math.floor(Math.random() * n)]);
}
var La = "<span class=\"preloader-inner\">\n    <svg viewBox=\"0 0 36 36\">\n      <circle cx=\"18\" cy=\"18\" r=\"16\"></circle>\n    </svg>\n  </span>", Ra = `
  <span class="preloader-inner">
    ${[
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7
].map(() => "<span class=\"preloader-inner-line\"></span>").join("")}
  </span>
`.trim();
function za(e) {
	let t;
	return e.split("").map((e, n) => e.match(/[A-Z]/) && n !== 0 && !t ? (t = !0, `:${e.toLowerCase()}`) : e.toLowerCase()).join("");
}
function Ba(e) {
	let t = e;
	Object.keys(t).forEach((e) => {
		try {
			t[e] = null;
		} catch {}
		try {
			delete t[e];
		} catch {}
	});
}
function Va(e) {
	return H().requestAnimationFrame(e);
}
function Ha(e) {
	return H().cancelAnimationFrame(e);
}
function Ua(e, t) {
	return t === void 0 && (t = 0), setTimeout(e, t);
}
function Wa(e) {
	return Va(() => {
		Va(e);
	});
}
function Ga() {
	return Date.now();
}
function Ka(e) {
	let t = H(), n = {}, r = e || t.location.href, i, a, o, s;
	if (typeof r == "string" && r.length) for (r = r.indexOf("?") > -1 ? r.replace(/\S*\?/, "") : "", a = r.split("&").filter((e) => e !== ""), s = a.length, i = 0; i < s; i += 1) o = a[i].replace(/#\S+/g, "").split("="), n[decodeURIComponent(o[0])] = o[1] === void 0 ? void 0 : decodeURIComponent(o.slice(1).join("=")) || "";
	return n;
}
function qa(e, t) {
	t === void 0 && (t = "x");
	let n = H(), r, i, a, o = n.getComputedStyle(e, null);
	return n.WebKitCSSMatrix ? (i = o.transform || o.webkitTransform, i.split(",").length > 6 && (i = i.split(", ").map((e) => e.replace(",", ".")).join(", ")), a = new n.WebKitCSSMatrix(i === "none" ? "" : i)) : (a = o.MozTransform || o.OTransform || o.MsTransform || o.msTransform || o.transform || o.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), r = a.toString().split(",")), t === "x" && (i = n.WebKitCSSMatrix ? a.m41 : r.length === 16 ? parseFloat(r[12]) : parseFloat(r[4])), t === "y" && (i = n.WebKitCSSMatrix ? a.m42 : r.length === 16 ? parseFloat(r[13]) : parseFloat(r[5])), i || 0;
}
function Ja(e, t) {
	if (t === void 0 && (t = []), typeof e == "string") return e;
	let n = [], r;
	function i(e) {
		if (t.length > 0) {
			let n = "";
			for (let e = 0; e < t.length; e += 1) e === 0 ? n += t[e] : n += `[${encodeURIComponent(t[e])}]`;
			return `${n}[${encodeURIComponent(e)}]`;
		}
		return encodeURIComponent(e);
	}
	function a(e) {
		return encodeURIComponent(e);
	}
	return Object.keys(e).forEach((o) => {
		let s;
		if (Array.isArray(e[o])) {
			s = [];
			for (let n = 0; n < e[o].length; n += 1) !Array.isArray(e[o][n]) && typeof e[o][n] == "object" ? (r = t.slice(), r.push(o), r.push(String(n)), s.push(Ja(e[o][n], r))) : s.push(`${i(o)}[]=${a(e[o][n])}`);
			s.length > 0 && n.push(s.join("&"));
		} else e[o] === null || e[o] === "" ? n.push(`${i(o)}=`) : typeof e[o] == "object" ? (r = t.slice(), r.push(o), s = Ja(e[o], r), s !== "" && n.push(s)) : e[o] !== void 0 && e[o] !== "" ? n.push(`${i(o)}=${a(e[o])}`) : e[o] === "" && n.push(i(o));
	}), n.join("&");
}
function Ya(e) {
	return typeof e == "object" && !!e && e.constructor && e.constructor === Object;
}
function Xa() {
	var e = [...arguments];
	let t = e[0];
	e.splice(0, 1);
	let n = e;
	for (let r = 0; r < n.length; r += 1) {
		let n = e[r];
		if (n != null) {
			let e = Object.keys(Object(n));
			for (let r = 0, i = e.length; r < i; r += 1) {
				let i = e[r], a = Object.getOwnPropertyDescriptor(n, i);
				a !== void 0 && a.enumerable && (t[i] = n[i]);
			}
		}
	}
	return t;
}
function J() {
	let e = !0, t, n;
	var r = [...arguments];
	typeof r[0] == "boolean" ? (e = r[0], t = r[1], r.splice(0, 2), n = r) : (t = r[0], r.splice(0, 1), n = r);
	for (let i = 0; i < n.length; i += 1) {
		let n = r[i];
		if (n != null) {
			let r = Object.keys(Object(n));
			for (let i = 0, a = r.length; i < a; i += 1) {
				let a = r[i], o = Object.getOwnPropertyDescriptor(n, a);
				o !== void 0 && o.enumerable && (e ? Ya(t[a]) && Ya(n[a]) ? J(t[a], n[a]) : !Ya(t[a]) && Ya(n[a]) ? (t[a] = {}, J(t[a], n[a])) : t[a] = n[a] : t[a] = n[a]);
			}
		}
	}
	return t;
}
function Za(e) {
	let t = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (e, t, n, r) => t + t + n + n + r + r), n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
	return n ? n.slice(1).map((e) => parseInt(e, 16)) : null;
}
function Qa(e, t, n) {
	return `#${[
		e,
		t,
		n
	].map((e) => {
		let t = e.toString(16);
		return t.length === 1 ? `0${t}` : t;
	}).join("")}`;
}
function $a(e, t, n) {
	e /= 255, t /= 255, n /= 255;
	let r = Math.max(e, t, n), i = Math.min(e, t, n), a = r - i, o;
	a === 0 ? o = 0 : r === e ? o = (t - n) / a % 6 : r === t ? o = (n - e) / a + 2 : r === n && (o = (e - t) / a + 4);
	let s = (i + r) / 2, c = a === 0 ? 0 : a / (1 - Math.abs(2 * s - 1));
	return o < 0 && (o = 360 / 60 + o), [
		o * 60,
		c,
		s
	];
}
function eo(e, t, n) {
	let r = (1 - Math.abs(2 * n - 1)) * t, i = e / 60, a = r * (1 - Math.abs(i % 2 - 1)), o;
	Number.isNaN(e) || e === void 0 ? o = [
		0,
		0,
		0
	] : i <= 1 ? o = [
		r,
		a,
		0
	] : i <= 2 ? o = [
		a,
		r,
		0
	] : i <= 3 ? o = [
		0,
		r,
		a
	] : i <= 4 ? o = [
		0,
		a,
		r
	] : i <= 5 ? o = [
		a,
		0,
		r
	] : i <= 6 && (o = [
		r,
		0,
		a
	]);
	let s = n - r / 2;
	return o.map((e) => Math.max(0, Math.min(255, Math.round(255 * (e + s)))));
}
function to(e, t, n) {
	let r = {
		h: e,
		s: 0,
		l: 0
	}, i = {
		h: e,
		s: t,
		b: n
	};
	return r.l = (2 - i.s) * i.b / 2, r.s = r.l && r.l < 1 ? i.s * i.b / (r.l < .5 ? r.l * 2 : 2 - r.l * 2) : r.s, [
		r.h,
		r.s,
		r.l
	];
}
function no(e, t, n) {
	let r = {
		h: e,
		s: 0,
		b: 0
	}, i = {
		h: e,
		s: t,
		l: n
	}, a = i.s * (i.l < .5 ? i.l : 1 - i.l);
	return r.b = i.l + a, r.s = i.l > 0 ? 2 * a / r.b : r.s, [
		r.h,
		r.s,
		r.b
	];
}
var ro = (e) => {
	let t = $a(...e), n = [
		t[0],
		t[1],
		Math.max(0, t[2] - .08)
	], r = [
		t[0],
		t[1],
		Math.max(0, t[2] + .08)
	];
	return {
		shade: Qa(...eo(...n)),
		tint: Qa(...eo(...r))
	};
};
function io() {
	let e, t;
	var n = [...arguments];
	if (n.length === 1 ? (e = n[0], t = Za(e)) : n.length === 3 && (t = n, e = Qa(...t)), !t) return {};
	let { light: r, dark: i } = Ma(e), a = ro(t), o = ro(Za(r["--f7-md-primary"])), s = ro(Za(i["--f7-md-primary"]));
	return Object.keys(r).forEach((e) => {
		e.includes("surface-") && (r[`${e}-rgb`] = Za(r[e]));
	}), Object.keys(i).forEach((e) => {
		e.includes("surface-") && (i[`${e}-rgb`] = Za(i[e]));
	}), {
		ios: {
			"--f7-theme-color": "var(--f7-ios-primary)",
			"--f7-theme-color-rgb": "var(--f7-ios-primary-rgb)",
			"--f7-theme-color-shade": "var(--f7-ios-primary-shade)",
			"--f7-theme-color-tint": "var(--f7-ios-primary-tint)"
		},
		md: {
			"--f7-theme-color": "var(--f7-md-primary)",
			"--f7-theme-color-rgb": "var(--f7-md-primary-rgb)",
			"--f7-theme-color-shade": "var(--f7-md-primary-shade)",
			"--f7-theme-color-tint": "var(--f7-md-primary-tint)"
		},
		light: {
			"--f7-ios-primary": e,
			"--f7-ios-primary-shade": a.shade,
			"--f7-ios-primary-tint": a.tint,
			"--f7-ios-primary-rgb": t.join(", "),
			"--f7-md-primary-shade": o.shade,
			"--f7-md-primary-tint": o.tint,
			"--f7-md-primary-rgb": Za(r["--f7-md-primary"]).join(", "),
			...r
		},
		dark: {
			"--f7-md-primary-shade": s.shade,
			"--f7-md-primary-tint": s.tint,
			"--f7-md-primary-rgb": Za(i["--f7-md-primary"]).join(", "),
			...i
		}
	};
}
function ao(e, t) {
	Object.keys(t).forEach((n) => {
		Ya(t[n]) && Object.keys(t[n]).forEach((r) => {
			typeof t[n][r] == "function" && (t[n][r] = t[n][r].bind(e));
		}), e[n] = t[n];
	});
}
function oo() {
	let e = [];
	return [...arguments].forEach((t) => {
		Array.isArray(t) ? e.push(...oo(...t)) : e.push(t);
	}), e;
}
function so(e) {
	e === void 0 && (e = {});
	let t = (e) => {
		let t = "";
		return Object.keys(e).forEach((n) => {
			t += `${n}:${e[n]};`;
		}), t;
	}, n = io(e.primary), r = [
		":root{",
		t(n.light),
		"--swiper-theme-color:var(--f7-theme-color);",
		...Object.keys(e).map((t) => `--f7-color-${t}: ${e[t]};`),
		"}",
		".dark{",
		t(n.dark),
		"}",
		".ios, .ios .dark{",
		t(n.ios),
		"}",
		".md, .md .dark{",
		t(n.md),
		"}"
	].join(""), i = {};
	Object.keys(e).forEach((t) => {
		let n = e[t];
		i[t] = io(n);
	});
	let a = "";
	return Object.keys(e).forEach((n) => {
		let { light: r, dark: o, ios: s, md: c } = i[n], l = "\n    --f7-ios-primary: #ffffff;\n    --f7-ios-primary-shade: #ebebeb;\n    --f7-ios-primary-tint: #ffffff;\n    --f7-ios-primary-rgb: 255, 255, 255;\n    --f7-md-primary-shade: #eee;\n    --f7-md-primary-tint: #fff;\n    --f7-md-primary-rgb: 255, 255, 255;\n    --f7-md-primary: #fff;\n    --f7-md-on-primary: #000;\n    --f7-md-primary-container: #fff;\n    --f7-md-on-primary-container: #000;\n    --f7-md-secondary: #fff;\n    --f7-md-on-secondary: #000;\n    --f7-md-secondary-container: #555;\n    --f7-md-on-secondary-container: #fff;\n    --f7-md-surface: #fff;\n    --f7-md-on-surface: #000;\n    --f7-md-surface-variant: #333;\n    --f7-md-on-surface-variant: #fff;\n    --f7-md-outline: #fff;\n    --f7-md-outline-variant: #fff;\n    --f7-md-inverse-surface: #000;\n    --f7-md-inverse-on-surface: #fff;\n    --f7-md-inverse-primary: #000;\n    --f7-md-surface-1: #f8f8f8;\n    --f7-md-surface-2: #f1f1f1;\n    --f7-md-surface-3: #e7e7e7;\n    --f7-md-surface-4: #e1e1e1;\n    --f7-md-surface-5: #d7d7d7;\n    --f7-md-surface-variant-rgb: 51, 51, 51;\n    --f7-md-on-surface-variant-rgb: 255, 255, 255;\n    --f7-md-surface-1-rgb: 248, 248, 248;\n    --f7-md-surface-2-rgb: 241, 241, 241;\n    --f7-md-surface-3-rgb: 231, 231, 231;\n    --f7-md-surface-4-rgb: 225, 225, 225;\n    --f7-md-surface-5-rgb: 215, 215, 215;\n    ", u = "\n    --f7-ios-primary: #000;\n    --f7-ios-primary-shade: #000;\n    --f7-ios-primary-tint: #232323;\n    --f7-ios-primary-rgb: 0, 0, 0;\n    --f7-md-primary-shade: #000;\n    --f7-md-primary-tint: #232323;\n    --f7-md-primary-rgb: 0, 0, 0;\n    --f7-md-primary: #000;\n    --f7-md-on-primary: #fff;\n    --f7-md-primary-container: #000;\n    --f7-md-on-primary-container: #fff;\n    --f7-md-secondary: #000;\n    --f7-md-on-secondary: #fff;\n    --f7-md-secondary-container: #aaa;\n    --f7-md-on-secondary-container: #000;\n    --f7-md-surface: #000;\n    --f7-md-on-surface: #fff;\n    --f7-md-surface-variant: #ccc;\n    --f7-md-on-surface-variant: #000;\n    --f7-md-outline: #000;\n    --f7-md-outline-variant: #000;\n    --f7-md-inverse-surface: #fff;\n    --f7-md-inverse-on-surface: #000;\n    --f7-md-inverse-primary: #fff;\n    --f7-md-surface-1: #070707;\n    --f7-md-surface-2: #161616;\n    --f7-md-surface-3: #232323;\n    --f7-md-surface-4: #303030;\n    --f7-md-surface-5: #373737;\n    --f7-md-surface-variant-rgb: 204, 204, 204;\n    --f7-md-on-surface-variant-rgb: 0, 0, 0;\n    --f7-md-surface-1-rgb: 7, 7, 7;\n    --f7-md-surface-2-rgb: 22, 22, 22;\n    --f7-md-surface-3-rgb: 35, 35, 35;\n    --f7-md-surface-4-rgb: 48, 48, 48;\n    --f7-md-surface-5-rgb: 55, 55, 55;\n    ", d = n === "white" ? l : n === "black" ? u : t(r), f = n === "white" ? l : n === "black" ? u : t(o);
		a += [
			`.color-${n} {`,
			d,
			"--swiper-theme-color: var(--f7-theme-color);",
			"}",
			`.color-${n}.dark, .color-${n} .dark, .dark .color-${n} {`,
			f,
			"--swiper-theme-color: var(--f7-theme-color);",
			"}",
			`.ios .color-${n}, .ios.color-${n}, .ios .dark .color-${n}, .ios .dark.color-${n} {`,
			t(s),
			"}",
			`.md .color-${n}, .md.color-${n}, .md .dark .color-${n}, .md .dark.color-${n} {`,
			t(c),
			"}",
			`.text-color-${n} {`,
			`--f7-theme-color-text-color: ${e[n]};`,
			"}",
			`.bg-color-${n} {`,
			`--f7-theme-color-bg-color: ${e[n]};`,
			"}",
			`.border-color-${n} {`,
			`--f7-theme-color-border-color: ${e[n]};`,
			"}",
			`.ripple-color-${n} {`,
			`--f7-theme-color-ripple-color: rgba(${r["--f7-ios-primary-rgb"]}, 0.3);`,
			"}"
		].join("");
	}), `${r}${a}`;
}
//#endregion
//#region node_modules/framework7/shared/get-support.js
var co;
function lo() {
	let e = H(), t = V();
	return {
		touch: !!("ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch),
		pointerEvents: !!e.PointerEvent && "maxTouchPoints" in e.navigator && e.navigator.maxTouchPoints >= 0,
		passiveListener: function() {
			let t = !1;
			try {
				let n = Object.defineProperty({}, "passive", { get() {
					t = !0;
				} });
				e.addEventListener("testPassiveListener", null, n);
			} catch {}
			return t;
		}(),
		intersectionObserver: function() {
			return "IntersectionObserver" in e;
		}()
	};
}
function Y() {
	return co ||= lo(), co;
}
//#endregion
//#region node_modules/framework7/shared/get-device.js
var uo;
function fo(e) {
	let { userAgent: t } = e === void 0 ? {} : e, n = Y(), r = H(), i = r.navigator.platform, a = t || r.navigator.userAgent, o = {
		ios: !1,
		android: !1,
		androidChrome: !1,
		desktop: !1,
		iphone: !1,
		ipod: !1,
		ipad: !1,
		edge: !1,
		ie: !1,
		firefox: !1,
		macos: !1,
		windows: !1,
		cordova: !!r.cordova,
		electron: !1,
		capacitor: !!r.Capacitor,
		nwjs: !1
	}, s = r.screen.width, c = r.screen.height, l = a.match(/(Android);?[\s\/]+([\d.]+)?/), u = a.match(/(iPad).*OS\s([\d_]+)/), d = a.match(/(iPod)(.*OS\s([\d_]+))?/), f = !u && a.match(/(iPhone\sOS|iOS|iPhone;\sCPU\sOS)\s([\d_]+)/), p = a.indexOf("MSIE ") >= 0 || a.indexOf("Trident/") >= 0, m = a.indexOf("Edge/") >= 0, h = a.indexOf("Gecko/") >= 0 && a.indexOf("Firefox/") >= 0, g = i === "Win32", _ = a.toLowerCase().indexOf("electron") >= 0, v = typeof nw < "u" && typeof process < "u" && process.versions !== void 0 && process.versions.nw !== void 0, y = i === "MacIntel";
	return !u && y && n.touch && [
		"1024x1366",
		"1366x1024",
		"834x1194",
		"1194x834",
		"834x1112",
		"1112x834",
		"768x1024",
		"1024x768",
		"820x1180",
		"1180x820",
		"810x1080",
		"1080x810"
	].indexOf(`${s}x${c}`) >= 0 && (u = a.match(/(Version)\/([\d.]+)/), u ||= [
		0,
		1,
		"13_0_0"
	], y = !1), o.ie = p, o.edge = m, o.firefox = h, l && (o.os = "android", o.osVersion = l[2], o.android = !0, o.androidChrome = a.toLowerCase().indexOf("chrome") >= 0), (u || f || d) && (o.os = "ios", o.ios = !0), f && !d && (o.osVersion = f[2].replace(/_/g, "."), o.iphone = !0), u && (o.osVersion = u[2].replace(/_/g, "."), o.ipad = !0), d && (o.osVersion = d[3] ? d[3].replace(/_/g, ".") : null, o.ipod = !0), o.ios && o.osVersion && a.indexOf("Version/") >= 0 && o.osVersion.split(".")[0] === "10" && (o.osVersion = a.toLowerCase().split("version/")[1].split(" ")[0]), o.webView = !!((f || u || d) && (a.match(/.*AppleWebKit(?!.*Safari)/i) || r.navigator.standalone)) || r.matchMedia && r.matchMedia("(display-mode: standalone)").matches, o.webview = o.webView, o.standalone = o.webView, o.desktop = !(o.ios || o.android) || _ || v, o.desktop && (o.electron = _, o.nwjs = v, o.macos = y, o.windows = g, o.macos && (o.os = "macos"), o.windows && (o.os = "windows")), o.pixelRatio = r.devicePixelRatio || 1, o.prefersColorScheme = function() {
		let e;
		return r.matchMedia && r.matchMedia("(prefers-color-scheme: light)").matches && (e = "light"), r.matchMedia && r.matchMedia("(prefers-color-scheme: dark)").matches && (e = "dark"), e;
	}, o;
}
var po = (() => {
	let e = V();
	try {
		return !!(e && e.body && e.body.getBoundingClientRect && e.body.getBoundingClientRect().width > 0);
	} catch {
		return !1;
	}
})();
function X(e, t) {
	return e === void 0 && (e = {}), t === void 0 && (t = po), (!uo || t) && (uo = fo(e)), uo;
}
//#endregion
//#region node_modules/framework7/shared/events-class.js
var mo = class {
	constructor(e) {
		e === void 0 && (e = []);
		let t = this;
		t.eventsParents = e, t.eventsListeners = {};
	}
	on(e, t, n) {
		let r = this;
		if (typeof t != "function") return r;
		let i = n ? "unshift" : "push";
		return e.split(" ").forEach((e) => {
			r.eventsListeners[e] || (r.eventsListeners[e] = []), r.eventsListeners[e][i](t);
		}), r;
	}
	once(e, t, n) {
		let r = this;
		if (typeof t != "function") return r;
		function i() {
			r.off(e, i), i.f7proxy && delete i.f7proxy;
			var n = [...arguments];
			t.apply(r, n);
		}
		return i.f7proxy = t, r.on(e, i, n);
	}
	off(e, t) {
		let n = this;
		return n.eventsListeners && e.split(" ").forEach((e) => {
			t === void 0 ? n.eventsListeners[e] = [] : n.eventsListeners[e] && n.eventsListeners[e].forEach((r, i) => {
				(r === t || r.f7proxy && r.f7proxy === t) && n.eventsListeners[e].splice(i, 1);
			});
		}), n;
	}
	emit() {
		let e = this;
		if (!e.eventsListeners) return e;
		let t, n, r, i;
		var a = [...arguments];
		typeof a[0] == "string" || Array.isArray(a[0]) ? (t = a[0], n = a.slice(1, a.length), r = e, i = e.eventsParents) : (t = a[0].events, n = a[0].data, r = a[0].context || e, i = a[0].local ? [] : a[0].parents || e.eventsParents);
		let o = Array.isArray(t) ? t : t.split(" "), s = o.map((e) => e.replace("local::", "")), c = o.filter((e) => e.indexOf("local::") < 0);
		return s.forEach((t) => {
			if (e.eventsListeners && e.eventsListeners[t]) {
				let i = [];
				e.eventsListeners[t].forEach((e) => {
					i.push(e);
				}), i.forEach((e) => {
					e.apply(r, n);
				});
			}
		}), i && i.length > 0 && i.forEach((e) => {
			e.emit(c, ...n);
		}), e;
	}
}, Z = class extends mo {
	constructor(e, t) {
		e === void 0 && (e = {}), t === void 0 && (t = []), super(t);
		let n = this;
		n.params = e, n.params && n.params.on && Object.keys(n.params.on).forEach((e) => {
			n.on(e, n.params.on[e]);
		});
	}
	useModuleParams(e, t) {
		if (e.params) {
			let n = {};
			Object.keys(e.params).forEach((e) => {
				t[e] !== void 0 && (n[e] = J({}, t[e]));
			}), J(t, e.params), Object.keys(n).forEach((e) => {
				J(t[e], n[e]);
			});
		}
	}
	useModulesParams(e) {
		let t = this;
		t.modules && Object.keys(t.modules).forEach((n) => {
			let r = t.modules[n];
			r.params && J(e, r.params);
		});
	}
	useModule(e, t) {
		e === void 0 && (e = ""), t === void 0 && (t = {});
		let n = this;
		if (!n.modules) return;
		let r = typeof e == "string" ? n.modules[e] : e;
		r && (r.instance && Object.keys(r.instance).forEach((e) => {
			let t = r.instance[e];
			typeof t == "function" ? n[e] = t.bind(n) : n[e] = t;
		}), r.on && n.on && Object.keys(r.on).forEach((e) => {
			n.on(e, r.on[e]);
		}), r.vnode && (n.vnodeHooks ||= {}, Object.keys(r.vnode).forEach((e) => {
			Object.keys(r.vnode[e]).forEach((t) => {
				let i = r.vnode[e][t];
				n.vnodeHooks[t] || (n.vnodeHooks[t] = {}), n.vnodeHooks[t][e] || (n.vnodeHooks[t][e] = []), n.vnodeHooks[t][e].push(i.bind(n));
			});
		})), r.create && r.create.bind(n)(t));
	}
	useModules(e) {
		e === void 0 && (e = {});
		let t = this;
		t.modules && Object.keys(t.modules).forEach((n) => {
			let r = e[n] || {};
			t.useModule(n, r);
		});
	}
	static set components(e) {
		let t = this;
		t.use && t.use(e);
	}
	static installModule(e) {
		let t = this;
		t.prototype.modules || (t.prototype.modules = {});
		let n = e.name || `${Object.keys(t.prototype.modules).length}_${Ga()}`;
		if (t.prototype.modules[n] = e, e.proto && Object.keys(e.proto).forEach((n) => {
			t.prototype[n] = e.proto[n];
		}), e.static && Object.keys(e.static).forEach((n) => {
			t[n] = e.static[n];
		}), e.install) {
			var r = [...arguments].slice(1);
			e.install.apply(t, r);
		}
		return t;
	}
	static use(e) {
		let t = this;
		if (Array.isArray(e)) return e.forEach((e) => t.installModule(e)), t;
		var n = [...arguments].slice(1);
		return t.installModule(e, ...n);
	}
};
//#endregion
//#region node_modules/framework7/shared/constructor-methods.js
function ho(e) {
	e === void 0 && (e = {});
	let { defaultSelector: t, constructor: n, domProp: r, app: i, addMethods: a } = e, o = {
		create() {
			var e = [...arguments];
			return i ? new n(i, ...e) : new n(...e);
		},
		get(e) {
			if (e === void 0 && (e = t), e instanceof n) return e;
			let i = W(e);
			if (i.length !== 0) return i[0][r];
		},
		destroy(e) {
			let t = o.get(e);
			if (t && t.destroy) return t.destroy();
		}
	};
	return a && Array.isArray(a) && a.forEach((e) => {
		o[e] = function(n) {
			n === void 0 && (n = t);
			let r = o.get(n);
			var i = [...arguments].slice(1);
			if (r && r[e]) return r[e](...i);
		};
	}), o;
}
//#endregion
//#region node_modules/framework7/shared/modal-methods.js
function go(e) {
	e === void 0 && (e = {});
	let { defaultSelector: t, constructor: n, app: r } = e;
	return J(ho({
		defaultSelector: t,
		constructor: n,
		app: r,
		domProp: "f7Modal"
	}), {
		open(e, t, i) {
			let a = W(e);
			if (a.length > 1 && i) {
				let e = W(i).parents(".page");
				e.length && a.each((t) => {
					let n = W(t);
					n.parents(e)[0] === e[0] && (a = n);
				});
			}
			if (a.length > 1 && (a = a.eq(a.length - 1)), !a.length) return;
			let o = a[0].f7Modal;
			if (!o) {
				let e = a.dataset();
				o = new n(r, {
					el: a,
					...e
				});
			}
			return o.open(t);
		},
		close(e, i, a) {
			e === void 0 && (e = t);
			let o = W(e);
			if (!o.length) return;
			if (o.length > 1) {
				let e;
				if (a) {
					let t = W(a);
					t.length && (e = t.parents(o));
				}
				o = e && e.length > 0 ? e : o.eq(o.length - 1);
			}
			let s = o[0].f7Modal;
			if (!s) {
				let e = o.dataset();
				s = new n(r, {
					el: o,
					...e
				});
			}
			return s.close(i);
		}
	});
}
//#endregion
//#region node_modules/framework7/components/app/load-module.js
var _o = [];
function vo(e) {
	let t = this, n = H(), r = V();
	return new Promise((i, a) => {
		let o = t.instance, s, c, l;
		if (!e) {
			a(/* @__PURE__ */ Error("Framework7: Lazy module must be specified"));
			return;
		}
		function u(e) {
			t.use(e), o && (o.useModuleParams(e, o.params), o.useModule(e));
		}
		if (typeof e == "string") {
			let t = e.match(/([a-z0-9-]*)/i);
			if (e.indexOf(".") < 0 && t && t[0].length === e.length) {
				if (!o || o && !o.params.lazyModulesPath) {
					a(/* @__PURE__ */ Error("Framework7: \"lazyModulesPath\" app parameter must be specified to fetch module by name"));
					return;
				}
				s = `${o.params.lazyModulesPath}/${e}/${e}.lazy.js`;
			} else s = e;
		} else typeof e == "function" ? l = e : c = e;
		if (l) {
			let e = l(t, !1);
			if (!e) {
				a(/* @__PURE__ */ Error("Framework7: Can't find Framework7 component in specified component function"));
				return;
			}
			if (t.prototype.modules && t.prototype.modules[e.name]) {
				i();
				return;
			}
			u(e), i();
		}
		if (c) {
			let e = c;
			if (!e) {
				a(/* @__PURE__ */ Error("Framework7: Can't find Framework7 component in specified component"));
				return;
			}
			if (t.prototype.modules && t.prototype.modules[e.name]) {
				i();
				return;
			}
			u(e), i();
		}
		if (s) {
			if (_o.indexOf(s) >= 0) {
				i();
				return;
			}
			_o.push(s);
			let e = new Promise((e, i) => {
				fetch(s).then((e) => e.text()).then((a) => {
					let o = `f7_component_loader_callback_${Ia()}`, c = r.createElement("script");
					c.innerHTML = `window.${o} = function (Framework7, Framework7AutoInstallComponent) {return ${a.trim()}}`, W("head").append(c);
					let l = n[o];
					delete n[o], W(c).remove();
					let d = l(t, !1);
					if (!d) {
						i(/* @__PURE__ */ Error(`Framework7: Can't find Framework7 component in ${s} file`));
						return;
					}
					if (t.prototype.modules && t.prototype.modules[d.name]) {
						e();
						return;
					}
					u(d), e();
				}).catch((e) => {
					i(e);
				});
			}), c = new Promise((e) => {
				fetch(s.replace(".lazy.js", o.rtl ? ".rtl.css" : ".css").replace(".js", o.rtl ? ".rtl.css" : ".css")).then((e) => e.text()).then((t) => {
					let n = r.createElement("style");
					n.innerHTML = t, W("head").append(n), e();
				}).catch(() => {
					e();
				});
			});
			Promise.all([e, c]).then(() => {
				i();
			}).catch((e) => {
				a(e);
			});
		}
	});
}
//#endregion
//#region node_modules/framework7/shared/$jsx.js
var Q = function(e, t) {
	let n = t || {}, r = [...arguments].slice(2) || [], i = Object.keys(n).map((e) => e[0] === "_" ? n[e] ? e.replace("_", "") : "" : `${e}="${n[e]}"`).filter((e) => !!e).join(" ");
	return [
		"path",
		"img",
		"circle",
		"polygon",
		"line",
		"input"
	].indexOf(e) >= 0 ? `<${e} ${i} />`.trim() : `<${e} ${i}>${r.filter((e) => !!e).map((e) => Array.isArray(e) ? e.join("") : e).join("")}</${e}>`.trim();
}, yo = class e extends Z {
	constructor(t) {
		if (t === void 0 && (t = {}), super(t), e.instance && typeof window < "u") throw Error("Framework7 is already initialized and can't be initialized more than once");
		let n = X({ userAgent: t.userAgent || void 0 }), r = Y(), i = J({}, t), a = this;
		a.device = n, a.support = r;
		let o = H(), s = V();
		e.instance = a;
		let c = {
			el: "body",
			theme: "auto",
			routes: [],
			name: "Framework7",
			lazyModulesPath: null,
			initOnDeviceReady: !0,
			init: !0,
			darkMode: void 0,
			iosTranslucentBars: !0,
			iosTranslucentModals: !0,
			component: void 0,
			componentUrl: void 0,
			userAgent: null,
			url: null,
			colors: {
				primary: "#007aff",
				red: "#ff3b30",
				green: "#4cd964",
				blue: "#2196f3",
				pink: "#ff2d55",
				yellow: "#ffcc00",
				orange: "#ff9500",
				purple: "#9c27b0",
				deeppurple: "#673ab7",
				lightblue: "#5ac8fa",
				teal: "#009688",
				lime: "#cddc39",
				deeporange: "#ff6b22",
				white: "#ffffff",
				black: "#000000"
			}
		};
		return a.useModulesParams(c), a.params = J(c, t), J(a, {
			name: a.params.name,
			routes: a.params.routes,
			theme: function() {
				return a.params.theme === "auto" ? n.ios ? "ios" : "md" : a.params.theme;
			}(),
			passedParams: i,
			online: o.navigator.onLine,
			colors: a.params.colors,
			darkMode: a.params.darkMode
		}), t.store && (a.params.store = t.store), a.$el && a.$el[0] && (a.$el[0].f7 = a), a.useModules(), a.initStore(), a.params.init && (n.cordova && a.params.initOnDeviceReady ? W(s).on("deviceready", () => {
			a.init();
		}) : a.init()), a;
	}
	setColorTheme(e) {
		if (!e) return;
		let t = this;
		t.colors.primary = e, t.setColors();
	}
	setColors() {
		let e = this, t = V();
		e.colorsStyleEl || (e.colorsStyleEl = t.createElement("style"), t.head.prepend(e.colorsStyleEl)), e.colorsStyleEl.textContent = e.utils.colorThemeCSSStyles(e.colors);
	}
	mount(e) {
		let t = this, n = H(), r = V(), i = W(e || t.params.el).eq(0);
		t.$el = i, t.$el && t.$el[0] && (t.el = t.$el[0], t.el.f7 = t, t.rtl = i.css("direction") === "rtl");
		let a = "(prefers-color-scheme: dark)", o = "(prefers-color-scheme: light)";
		t.mq = {}, n.matchMedia && (t.mq.dark = n.matchMedia(a), t.mq.light = n.matchMedia(o)), t.colorSchemeListener = function(e) {
			let { matches: n, media: i } = e;
			if (!n) return;
			let s = r.querySelector("html");
			i === a ? (s.classList.add("dark"), t.darkMode = !0, t.emit("darkModeChange", !0)) : i === o && (s.classList.remove("dark"), t.darkMode = !1, t.emit("darkModeChange", !1));
		}, t.emit("mount");
	}
	initStore() {
		let e = this;
		e.params.store !== void 0 && e.params.store.__store ? e.store = e.params.store : e.store = e.createStore(e.params.store);
	}
	enableAutoDarkMode() {
		let e = H(), t = V();
		if (!e.matchMedia) return;
		let n = this, r = t.querySelector("html");
		n.mq.dark && n.mq.light && (n.mq.dark.addEventListener("change", n.colorSchemeListener), n.mq.light.addEventListener("change", n.colorSchemeListener)), n.mq.dark && n.mq.dark.matches ? (r.classList.add("dark"), n.darkMode = !0, n.emit("darkModeChange", !0)) : n.mq.light && n.mq.light.matches && (r.classList.remove("dark"), n.darkMode = !1, n.emit("darkModeChange", !1));
	}
	disableAutoDarkMode() {
		if (!H().matchMedia) return;
		let e = this;
		e.mq.dark && e.mq.dark.removeEventListener("change", e.colorSchemeListener), e.mq.light && e.mq.light.removeEventListener("change", e.colorSchemeListener);
	}
	setDarkMode(e) {
		let t = this;
		e === "auto" ? t.enableAutoDarkMode() : (t.disableAutoDarkMode(), W("html")[e ? "addClass" : "removeClass"]("dark"), t.darkMode = e);
	}
	initAppComponent(e) {
		let t = this;
		t.router.componentLoader(t.params.component, t.params.componentUrl, { componentOptions: { el: t.$el[0] } }, (n) => {
			t.$el = W(n), t.$el[0].f7 = t, t.$elComponent = n.f7Component, t.el = t.$el[0], e && e();
		}, () => {});
	}
	init(e) {
		let t = this;
		t.setColors(), t.mount(e);
		let n = () => {
			if (t.initialized) return;
			t.$el.addClass("framework7-initializing"), t.rtl && W("html").attr("dir", "rtl"), t.params.darkMode === void 0 ? t.darkMode = W("html").hasClass("dark") : t.setDarkMode(t.params.darkMode);
			let e = H();
			e.addEventListener("offline", () => {
				t.online = !1, t.emit("offline"), t.emit("connection", !1);
			}), e.addEventListener("online", () => {
				t.online = !0, t.emit("online"), t.emit("connection", !0);
			}), t.$el.addClass("framework7-root"), W("html").removeClass("ios md").addClass(t.theme), t.params.iosTranslucentBars && t.theme === "ios" && W("html").addClass("ios-translucent-bars"), t.params.iosTranslucentModals && t.theme === "ios" && W("html").addClass("ios-translucent-modals"), Wa(() => {
				t.$el.removeClass("framework7-initializing");
			}), t.initialized = !0, t.emit("init");
		};
		return t.params.component || t.params.componentUrl ? t.initAppComponent(() => {
			n();
		}) : n(), t;
	}
	loadModule() {
		return e.loadModule(...arguments);
	}
	loadModules() {
		return e.loadModules(...arguments);
	}
	getVnodeHooks(e, t) {
		let n = this;
		return !n.vnodeHooks || !n.vnodeHooks[e] ? [] : n.vnodeHooks[e][t] || [];
	}
	get $() {
		return W;
	}
	static get Dom7() {
		return W;
	}
	static get $() {
		return W;
	}
	static get device() {
		return X();
	}
	static get support() {
		return Y();
	}
	static get Class() {
		return Z;
	}
	static get Events() {
		return mo;
	}
};
yo.$jsx = Q, yo.ModalMethods = go, yo.ConstructorMethods = ho, yo.loadModule = vo, yo.loadModules = function(e) {
	return Promise.all(e.map((e) => yo.loadModule(e)));
};
//#endregion
//#region node_modules/framework7/modules/device/device.js
var bo = {
	name: "device",
	static: { getDevice: X },
	on: { init() {
		let e = V(), t = X(), n = [], r = e.querySelector("html"), i = e.querySelector("meta[name=\"apple-mobile-web-app-status-bar-style\"]");
		r && (t.standalone && t.ios && i && i.content === "black-translucent" && n.push("device-full-viewport"), n.push(`device-pixel-ratio-${Math.floor(t.pixelRatio)}`), t.os && !t.desktop ? n.push(`device-${t.os}`) : t.desktop && (n.push("device-desktop"), t.os && n.push(`device-${t.os}`)), t.cordova && n.push("device-cordova"), t.capacitor && n.push("device-capacitor"), n.forEach((e) => {
			r.classList.add(e);
		}));
	} }
}, xo = {
	name: "support",
	static: { getSupport: Y }
}, So = {
	name: "utils",
	proto: { utils: Na },
	static: { utils: Na }
}, Co = {
	name: "resize",
	create() {
		let e = this;
		e.getSize = () => {
			if (!e.el) return {
				width: 0,
				height: 0,
				left: 0,
				top: 0
			};
			let t = e.$el.offset(), [n, r, i, a] = [
				e.el.offsetWidth,
				e.el.offsetHeight,
				t.left,
				t.top
			];
			return e.width = n, e.height = r, e.left = i, e.top = a, {
				width: n,
				height: r,
				left: i,
				top: a
			};
		};
	},
	on: {
		init() {
			let e = this, t = H();
			e.getSize(), t.addEventListener("resize", () => {
				e.emit("resize");
			}, !1), t.addEventListener("orientationchange", () => {
				e.emit("orientationchange");
			});
		},
		orientationchange() {
			let e = V();
			X().ipad && (e.body.scrollLeft = 0, setTimeout(() => {
				e.body.scrollLeft = 0;
			}, 0));
		},
		resize() {
			this.getSize();
		}
	}
};
//#endregion
//#region node_modules/framework7/modules/touch/touch.js
function wo() {
	let e = this, t = X(), n = Y(), r = H(), i = V(), a = e.params.touch, o = a[`${e.theme}TouchRipple`];
	t.ios && t.webView && r.addEventListener("touchstart", () => {});
	let s, c, l, u, d, f, p, m, h, g, _, v;
	function y(e) {
		let t = W(e), n = t.parents(a.activeStateElements);
		if (t.closest(".no-active-state").length) return null;
		let r;
		if (t.is(a.activeStateElements) && (r = t), n.length > 0 && (r = r ? r.add(n) : n), r && r.length > 1) {
			let e = [], t;
			for (let n = 0; n < r.length; n += 1) t || (e.push(r[n]), (r.eq(n).hasClass("prevent-active-state-propagation") || r.eq(n).hasClass("no-active-state-propagation")) && (t = !0));
			r = W(e);
		}
		return r || t;
	}
	function b(e) {
		return e.parents(".page-content").length > 0;
	}
	function x() {
		m && m.addClass("active-state");
	}
	function S() {
		m &&= (m.removeClass("active-state"), null);
	}
	function C(e) {
		let t = a.touchRippleElements, n = W(e);
		if (n.is(t)) return n.hasClass("no-ripple") ? !1 : n;
		if (n.parents(t).length > 0) {
			let e = n.parents(t).eq(0);
			return e.hasClass("no-ripple") ? !1 : e;
		}
		return !1;
	}
	function w(t, n, r) {
		t && (g = e.touchRipple.create(e, t, n, r));
	}
	function T() {
		g && (g.remove(), g = void 0, _ = void 0);
	}
	function E(e) {
		if (_ = C(e), !_ || _.length === 0) {
			_ = void 0;
			return;
		}
		b(_) ? (clearTimeout(v), v = setTimeout(() => {
			T(), w(_, s, c);
		}, 80)) : (T(), w(_, s, c));
	}
	function D() {
		clearTimeout(v), T();
	}
	function O() {
		!g && _ && !u ? (clearTimeout(v), w(_, s, c), setTimeout(T, 0)) : T();
	}
	function k(e) {
		let t = y(e.target);
		t && (t.addClass("active-state"), "which" in e && e.which === 3 && setTimeout(() => {
			W(".active-state").removeClass("active-state");
		}, 0)), o && (s = e.pageX, c = e.pageY, E(e.target, e.pageX, e.pageY));
	}
	function A() {
		a.activeStateOnMouseMove || W(".active-state").removeClass("active-state"), o && D();
	}
	function j() {
		W(".active-state").removeClass("active-state"), o && O();
	}
	function M() {
		l = null, clearTimeout(h), clearTimeout(f), a.activeState && S(), o && O();
	}
	let N, P = !1, F = null, ee = ".dialog-button, .actions-button", te = !1, I = null;
	function L(t) {
		return t.isTrusted ? (u = !1, d = !1, p = !1, N = void 0, t.targetTouches.length > 1 ? (m && S(), !0) : (t.touches.length > 1 && m && S(), a.tapHold && (f && clearTimeout(f), f = setTimeout(() => {
			t && t.touches && t.touches.length > 1 || (d = !0, t.preventDefault(), p = !0, W(t.target).trigger("taphold", t), e.emit("taphold", t));
		}, a.tapHoldDelay)), l = t.target, s = t.targetTouches[0].pageX, c = t.targetTouches[0].pageY, P = t.target.closest(".segmented-strong .button-active, .segmented-strong .tab-link-active"), te = e.theme === "ios" && t.target.closest(ee), P && (F = P.closest(".segmented-strong")), a.activeState && (m = y(l), m && !b(m) ? x() : m && (h = setTimeout(x, 80))), o && E(l, s, c), !0)) : !0;
	}
	function ne(e) {
		if (!e.isTrusted) return;
		let t, n, r = !0;
		e.type === "touchmove" && (t = e.targetTouches[0], n = a.touchClicksDistanceThreshold);
		let d = e.targetTouches[0].pageX, g = e.targetTouches[0].pageY;
		if (N === void 0 && (N = !!(N || Math.abs(g - c) > Math.abs(d - s))), (te || !N && P && F) && e.cancelable && e.preventDefault(), !N && P && F) {
			let t = i.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY).closest(".segmented-strong .button:not(.button-active):not(.tab-link-active)");
			t && F.contains(t) && (W(t).trigger("click", "f7Segmented"), l = t);
		}
		if (n && t) {
			let e = t.pageX, r = t.pageY;
			(Math.abs(e - s) > n || Math.abs(r - c) > n) && (u = !0);
		} else u = !0;
		u && (p = !0, te && (I = i.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY).closest(ee), I && m && m[0] === I ? r = !1 : I && setTimeout(() => {
			m = y(I), x();
		})), a.tapHold && clearTimeout(f), a.activeState && r && (clearTimeout(h), S()), o && D());
	}
	function re(e) {
		return e.isTrusted ? (N = void 0, P = !1, F = null, te = !1, clearTimeout(h), clearTimeout(f), I &&= (W(I).trigger("click", "f7TouchMoveActivable"), null), i.activeElement === e.target ? (a.activeState && S(), o && O(), !0) : (a.activeState && (x(), setTimeout(S, 0)), o && O(), a.tapHoldPreventClicks && d || p ? (e.cancelable && e.preventDefault(), p = !0, !1) : !0)) : !0;
	}
	function ie(e) {
		let n = e && e.detail && e.detail === "f7Overswipe", r = e && e.detail && e.detail === "f7Segmented", i = e && e.detail && e.detail === "f7TouchMoveActivable", o = p;
		return l && e.target !== l ? o = !(n || r || i) : i && (o = !1), a.tapHold && a.tapHoldPreventClicks && d && (o = !0), o && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault()), a.tapHold && (f = setTimeout(() => {
			d = !1;
		}, t.ios || t.androidChrome ? 100 : 400)), p = !1, l = null, !o;
	}
	function ae(t, n) {
		e.emit({
			events: t,
			data: [n]
		});
	}
	function oe(e) {
		ae("click", e);
	}
	function se(e) {
		ae("touchstart touchstart:active", e);
	}
	function ce(e) {
		ae("touchmove touchmove:active", e);
	}
	function le(e) {
		ae("touchend touchend:active", e);
	}
	function ue(e) {
		ae("touchstart:passive", e);
	}
	function de(e) {
		ae("touchmove:passive", e);
	}
	function fe(e) {
		ae("touchend:passive", e);
	}
	let pe = n.passiveListener ? { passive: !0 } : !1, me = n.passiveListener ? {
		passive: !0,
		capture: !0
	} : !0, he = n.passiveListener ? { passive: !1 } : !1, ge = n.passiveListener ? {
		passive: !1,
		capture: !0
	} : !0;
	i.addEventListener("click", oe, !0), n.passiveListener ? (i.addEventListener(e.touchEvents.start, se, ge), i.addEventListener(e.touchEvents.move, ce, he), i.addEventListener(e.touchEvents.end, le, he), i.addEventListener(e.touchEvents.start, ue, me), i.addEventListener(e.touchEvents.move, de, pe), i.addEventListener(e.touchEvents.end, fe, pe)) : (i.addEventListener(e.touchEvents.start, (e) => {
		se(e), ue(e);
	}, !0), i.addEventListener(e.touchEvents.move, (e) => {
		ce(e), de(e);
	}, !1), i.addEventListener(e.touchEvents.end, (e) => {
		le(e), fe(e);
	}, !1)), n.touch ? (e.on("click", ie), e.on("touchstart", L), e.on("touchmove", ne), e.on("touchend", re), i.addEventListener("touchcancel", M, { passive: !0 })) : a.activeState && (e.on("touchstart", k), e.on("touchmove", A), e.on("touchend", j), i.addEventListener("pointercancel", j, { passive: !0 })), i.addEventListener("contextmenu", (e) => {
		a.disableContextMenu && (t.ios || t.android || t.cordova || r.Capacitor && r.Capacitor.isNative) && e.preventDefault(), o && (m && S(), O());
	});
}
var To = {
	name: "touch",
	params: { touch: {
		touchClicksDistanceThreshold: 5,
		disableContextMenu: !1,
		tapHold: !1,
		tapHoldDelay: 750,
		tapHoldPreventClicks: !0,
		activeState: !0,
		activeStateElements: "a, button, label, span, .actions-button, .stepper-button, .stepper-button-plus, .stepper-button-minus, .card-expandable, .link, .item-link, .accordion-item-toggle",
		activeStateOnMouseMove: !1,
		mdTouchRipple: !0,
		iosTouchRipple: !1,
		touchRippleElements: ".ripple, .link, .item-link, .list label.item-content, .list-button, .links-list a, .button, button, .input-clear-button, .dialog-button, .tab-link, .item-radio, .item-checkbox, .actions-button, .searchbar-disable-button, .fab a, .checkbox, .radio, .data-table .sortable-cell:not(.input-cell), .notification-close-button, .stepper-button, .stepper-button-minus, .stepper-button-plus, .list.accordion-list .accordion-item-toggle",
		touchRippleInsetElements: ".ripple-inset, .icon-only, .searchbar-disable-button, .input-clear-button, .notification-close-button, .md .navbar .link.back"
	} },
	create() {
		let e = this, t = Y();
		J(e, { touchEvents: {
			start: t.touch ? "touchstart" : t.pointerEvents ? "pointerdown" : "mousedown",
			move: t.touch ? "touchmove" : t.pointerEvents ? "pointermove" : "mousemove",
			end: t.touch ? "touchend" : t.pointerEvents ? "pointerup" : "mouseup"
		} });
	},
	on: { init: wo }
};
//#endregion
//#region node_modules/path-to-regexp/dist.es2015/index.js
function Eo(e) {
	for (var t = [], n = 0; n < e.length;) {
		var r = e[n];
		if (r === "*" || r === "+" || r === "?") {
			t.push({
				type: "MODIFIER",
				index: n,
				value: e[n++]
			});
			continue;
		}
		if (r === "\\") {
			t.push({
				type: "ESCAPED_CHAR",
				index: n++,
				value: e[n++]
			});
			continue;
		}
		if (r === "{") {
			t.push({
				type: "OPEN",
				index: n,
				value: e[n++]
			});
			continue;
		}
		if (r === "}") {
			t.push({
				type: "CLOSE",
				index: n,
				value: e[n++]
			});
			continue;
		}
		if (r === ":") {
			for (var i = "", a = n + 1; a < e.length;) {
				var o = e.charCodeAt(a);
				if (o >= 48 && o <= 57 || o >= 65 && o <= 90 || o >= 97 && o <= 122 || o === 95) {
					i += e[a++];
					continue;
				}
				break;
			}
			if (!i) throw TypeError(`Missing parameter name at ${n}`);
			t.push({
				type: "NAME",
				index: n,
				value: i
			}), n = a;
			continue;
		}
		if (r === "(") {
			var s = 1, c = "", a = n + 1;
			if (e[a] === "?") throw TypeError(`Pattern cannot start with "?" at ${a}`);
			for (; a < e.length;) {
				if (e[a] === "\\") {
					c += e[a++] + e[a++];
					continue;
				}
				if (e[a] === ")") {
					if (s--, s === 0) {
						a++;
						break;
					}
				} else if (e[a] === "(" && (s++, e[a + 1] !== "?")) throw TypeError(`Capturing groups are not allowed at ${a}`);
				c += e[a++];
			}
			if (s) throw TypeError(`Unbalanced pattern at ${n}`);
			if (!c) throw TypeError(`Missing pattern at ${n}`);
			t.push({
				type: "PATTERN",
				index: n,
				value: c
			}), n = a;
			continue;
		}
		t.push({
			type: "CHAR",
			index: n,
			value: e[n++]
		});
	}
	return t.push({
		type: "END",
		index: n,
		value: ""
	}), t;
}
function Do(e, t) {
	t === void 0 && (t = {});
	for (var n = Eo(e), r = t.prefixes, i = r === void 0 ? "./" : r, a = t.delimiter, o = a === void 0 ? "/#?" : a, s = [], c = 0, l = 0, u = "", d = function(e) {
		if (l < n.length && n[l].type === e) return n[l++].value;
	}, f = function(e) {
		var t = d(e);
		if (t !== void 0) return t;
		var r = n[l], i = r.type, a = r.index;
		throw TypeError(`Unexpected ${i} at ${a}, expected ${e}`);
	}, p = function() {
		for (var e = "", t; t = d("CHAR") || d("ESCAPED_CHAR");) e += t;
		return e;
	}, m = function(e) {
		for (var t = 0, n = o; t < n.length; t++) {
			var r = n[t];
			if (e.indexOf(r) > -1) return !0;
		}
		return !1;
	}, h = function(e) {
		var t = s[s.length - 1], n = e || (t && typeof t == "string" ? t : "");
		if (t && !n) throw TypeError(`Must have text between two parameters, missing text after "${t.name}"`);
		return !n || m(n) ? `[^${Ao(o)}]+?` : `(?:(?!${Ao(n)})[^${Ao(o)}])+?`;
	}; l < n.length;) {
		var g = d("CHAR"), _ = d("NAME"), v = d("PATTERN");
		if (_ || v) {
			var y = g || "";
			i.indexOf(y) === -1 && (u += y, y = ""), u &&= (s.push(u), ""), s.push({
				name: _ || c++,
				prefix: y,
				suffix: "",
				pattern: v || h(y),
				modifier: d("MODIFIER") || ""
			});
			continue;
		}
		var b = g || d("ESCAPED_CHAR");
		if (b) {
			u += b;
			continue;
		}
		if (u &&= (s.push(u), ""), d("OPEN")) {
			var y = p(), x = d("NAME") || "", S = d("PATTERN") || "", C = p();
			f("CLOSE"), s.push({
				name: x || (S ? c++ : ""),
				pattern: x && !S ? h(y) : S,
				prefix: y,
				suffix: C,
				modifier: d("MODIFIER") || ""
			});
			continue;
		}
		f("END");
	}
	return s;
}
function Oo(e, t) {
	return ko(Do(e, t), t);
}
function ko(e, t) {
	t === void 0 && (t = {});
	var n = jo(t), r = t.encode, i = r === void 0 ? function(e) {
		return e;
	} : r, a = t.validate, o = a === void 0 ? !0 : a, s = e.map(function(e) {
		if (typeof e == "object") return RegExp(`^(?:${e.pattern})\$`, n);
	});
	return function(t) {
		for (var n = "", r = 0; r < e.length; r++) {
			var a = e[r];
			if (typeof a == "string") {
				n += a;
				continue;
			}
			var c = t ? t[a.name] : void 0, l = a.modifier === "?" || a.modifier === "*", u = a.modifier === "*" || a.modifier === "+";
			if (Array.isArray(c)) {
				if (!u) throw TypeError(`Expected "${a.name}" to not repeat, but got an array`);
				if (c.length === 0) {
					if (l) continue;
					throw TypeError(`Expected "${a.name}" to not be empty`);
				}
				for (var d = 0; d < c.length; d++) {
					var f = i(c[d], a);
					if (o && !s[r].test(f)) throw TypeError(`Expected all "${a.name}" to match "${a.pattern}", but got "${f}"`);
					n += a.prefix + f + a.suffix;
				}
				continue;
			}
			if (typeof c == "string" || typeof c == "number") {
				var f = i(String(c), a);
				if (o && !s[r].test(f)) throw TypeError(`Expected "${a.name}" to match "${a.pattern}", but got "${f}"`);
				n += a.prefix + f + a.suffix;
				continue;
			}
			if (!l) {
				var p = u ? "an array" : "a string";
				throw TypeError(`Expected "${a.name}" to be ${p}`);
			}
		}
		return n;
	};
}
function Ao(e) {
	return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function jo(e) {
	return e && e.sensitive ? "" : "i";
}
function Mo(e, t) {
	if (!t) return e;
	for (var n = /\((?:\?<(.*?)>)?(?!\?)/g, r = 0, i = n.exec(e.source); i;) t.push({
		name: i[1] || r++,
		prefix: "",
		suffix: "",
		modifier: "",
		pattern: ""
	}), i = n.exec(e.source);
	return e;
}
function No(e, t, n) {
	var r = e.map(function(e) {
		return Io(e, t, n).source;
	});
	return RegExp(`(?:${r.join("|")})`, jo(n));
}
function Po(e, t, n) {
	return Fo(Do(e, n), t, n);
}
function Fo(e, t, n) {
	n === void 0 && (n = {});
	for (var r = n.strict, i = r === void 0 ? !1 : r, a = n.start, o = a === void 0 ? !0 : a, s = n.end, c = s === void 0 ? !0 : s, l = n.encode, u = l === void 0 ? function(e) {
		return e;
	} : l, d = n.delimiter, f = d === void 0 ? "/#?" : d, p = n.endsWith, m = `[${Ao(p === void 0 ? "" : p)}]|\$`, h = `[${Ao(f)}]`, g = o ? "^" : "", _ = 0, v = e; _ < v.length; _++) {
		var y = v[_];
		if (typeof y == "string") g += Ao(u(y));
		else {
			var b = Ao(u(y.prefix)), x = Ao(u(y.suffix));
			if (y.pattern) if (t && t.push(y), b || x) if (y.modifier === "+" || y.modifier === "*") {
				var S = y.modifier === "*" ? "?" : "";
				g += `(?:${b}((?:${y.pattern})(?:${x}${b}(?:${y.pattern}))*)${x})${S}`;
			} else g += `(?:${b}(${y.pattern})${x})${y.modifier}`;
			else {
				if (y.modifier === "+" || y.modifier === "*") throw TypeError(`Can not repeat "${y.name}" without a prefix and suffix`);
				g += `(${y.pattern})${y.modifier}`;
			}
			else g += `(?:${b}${x})${y.modifier}`;
		}
	}
	if (c) i || (g += `${h}?`), g += n.endsWith ? `(?=${m})` : "$";
	else {
		var C = e[e.length - 1], w = typeof C == "string" ? h.indexOf(C[C.length - 1]) > -1 : C === void 0;
		i || (g += `(?:${h}(?=${m}))?`), w || (g += `(?=${h}|${m})`);
	}
	return new RegExp(g, jo(n));
}
function Io(e, t, n) {
	return e instanceof RegExp ? Mo(e, t) : Array.isArray(e) ? No(e, t, n) : Po(e, t, n);
}
//#endregion
//#region node_modules/framework7/shared/history.js
var $ = {
	queue: [],
	clearQueue() {
		$.queue.length !== 0 && $.queue.shift()();
	},
	routerQueue: [],
	clearRouterQueue() {
		if ($.routerQueue.length === 0) return;
		let { router: e, stateUrl: t, action: n } = $.routerQueue.pop(), r = e.params.animate;
		e.params.browserHistoryAnimate === !1 && (r = !1), n === "back" && e.back({
			animate: r,
			browserHistory: !1
		}), n === "load" && e.navigate(t, {
			animate: r,
			browserHistory: !1
		});
	},
	handle(e) {
		if ($.blockPopstate) return;
		let t = this, n = e.state;
		$.previousState = $.state, $.state = n, $.allowChange = !0, $.clearQueue(), n = $.state, n ||= {}, t.views.forEach((e) => {
			let t = e.router, r = n[e.id];
			if (!r && e.params.browserHistory && (r = { url: e.router.history[0] }), !r) return;
			let i = r.url || void 0, a = t.params.animate;
			t.params.browserHistoryAnimate === !1 && (a = !1), i !== t.url && (t.history.indexOf(i) >= 0 ? t.allowPageChange ? t.back({
				animate: a,
				browserHistory: !1
			}) : $.routerQueue.push({
				action: "back",
				router: t
			}) : t.allowPageChange ? t.navigate(i, {
				animate: a,
				browserHistory: !1
			}) : $.routerQueue.unshift({
				action: "load",
				stateUrl: i,
				router: t
			}));
		});
	},
	initViewState(e, t) {
		let n = H(), r = J({}, $.state || {}, { [e]: t });
		$.state = r, n.history.replaceState(r, "");
	},
	push(e, t, n) {
		let r = H(), i = V();
		if (n.substr(-3) === "#!/" && (n = n.replace("#!/", ""), n === "" && (n = i.location.href, n.includes("#!/") && (n = i.location.href.split("#!/")[0]))), !$.allowChange) {
			$.queue.push(() => {
				$.push(e, t, n);
			});
			return;
		}
		$.previousState = $.state;
		let a = J({}, $.previousState || {}, { [e]: t });
		$.state = a, r.history.pushState(a, "", n);
	},
	replace(e, t, n) {
		let r = H();
		if (n.substr(-3) === "#!/" && (n = n.replace("#!/", "")), !$.allowChange) {
			$.queue.push(() => {
				$.replace(e, t, n);
			});
			return;
		}
		$.previousState = $.state;
		let i = J({}, $.previousState || {}, { [e]: t });
		$.state = i, r.history.replaceState(i, "", n);
	},
	go(e) {
		let t = H();
		$.allowChange = !1, t.history.go(e);
	},
	back() {
		let e = H();
		$.allowChange = !1, e.history.back();
	},
	allowChange: !0,
	previousState: {},
	state: {},
	blockPopstate: !0,
	init(e) {
		let t = H(), n = V();
		$.state = t.history.state, W(t).on("load", () => {
			setTimeout(() => {
				$.blockPopstate = !1;
			}, 0);
		}), n.readyState && n.readyState === "complete" && ($.blockPopstate = !1), W(t).on("popstate", $.handle.bind(e));
	}
};
//#endregion
//#region node_modules/framework7/modules/router/swipe-back.js
function Lo(e) {
	let t = e, { $el: n, $navbarsEl: r, app: i, params: a } = t, o = Y(), s = X(), c = !1, l = !1, u = {}, d, f = [], p = [], m, h, g = !0, _, v = [], y = [], b, x, S, C, w = a[`${i.theme}SwipeBackAnimateShadow`], T = a[`${i.theme}SwipeBackAnimateOpacity`], E = a[`${i.theme}SwipeBackActiveArea`], D = a[`${i.theme}SwipeBackThreshold`], O = i.rtl ? "right center" : "left center", k = i.rtl ? "calc(100% - var(--f7-navbar-large-title-padding-left) - var(--f7-safe-area-left)) center" : "calc(var(--f7-navbar-large-title-padding-left) + var(--f7-safe-area-left)) center";
	function A() {
		let e = [], t = i.rtl ? -1 : 1, n = v.hasClass("navbar-transparent") && !v.hasClass("navbar-large") && !v.hasClass("navbar-transparent-visible"), r = v.hasClass("navbar-large"), o = v.hasClass("navbar-large-collapsed"), c = v.hasClass("navbar-large-transparent") || v.hasClass("navbar-large") && v.hasClass("navbar-transparent"), l = y.hasClass("navbar-transparent") && !y.hasClass("navbar-large") && !y.hasClass("navbar-transparent-visible"), u = y.hasClass("navbar-large"), d = y.hasClass("navbar-large-collapsed"), f = y.hasClass("navbar-large-transparent") || y.hasClass("navbar-large") && y.hasClass("navbar-transparent"), p = r && !o, m = u && !d, h = v.find(".left, .title, .right, .subnavbar, .fading, .title-large, .navbar-bg"), g = y.find(".left, .title, .right, .subnavbar, .fading, .title-large, .navbar-bg"), _, b;
		return a.iosAnimateNavbarBackIcon && (_ = v.hasClass("sliding") || v.find(".navbar-inner.sliding").length ? v.find(".left").find(".back .icon + span").eq(0) : v.find(".left.sliding").find(".back .icon + span").eq(0), b = y.hasClass("sliding") || y.find(".navbar-inner.sliding").length ? y.find(".left").find(".back .icon + span").eq(0) : y.find(".left.sliding").find(".back .icon + span").eq(0), _.length && g.each((e) => {
			W(e).hasClass("title") && (e.f7NavbarLeftOffset += _.prev(".icon")[0].offsetWidth);
		})), h.each((i) => {
			let l = W(i), u = l.hasClass("subnavbar"), d = l.hasClass("left"), f = l.hasClass("title"), h = l.hasClass("navbar-bg");
			if ((f || h) && n || !p && l.hasClass(".title-large")) return;
			let g = { el: i };
			if (p) {
				if (f) return;
				if (l.hasClass("title-large")) {
					e.indexOf(g) < 0 && e.push(g), g.overflow = "visible", l.find(".title-large-text").each((n) => {
						e.push({
							el: n,
							transform: (e) => `translateX(${e * 100 * t}%)`
						});
					});
					return;
				}
			}
			if (m && (p || l.hasClass("title-large") && (e.indexOf(g) < 0 && e.push(g), g.opacity = 0), d)) {
				e.indexOf(g) < 0 && e.push(g), g.opacity = (e) => 1 - e ** .33, l.find(".back span").each((t) => {
					e.push({
						el: t,
						"transform-origin": O,
						transform: (e) => `translateX(calc(${e} * (var(--f7-navbarTitleLargeOffset) - var(--f7-navbarLeftTextOffset)))) translateY(calc(${e} * (var(--f7-navbar-large-title-height) - var(--f7-navbar-large-title-padding-vertical) / 2))) scale(${1 + 1 * e})`
					});
				});
				return;
			}
			if (h) {
				e.indexOf(g) < 0 && e.push(g), !p && !m && (o ? (c && (g.className = "ios-swipeback-navbar-bg-large"), g.transform = (e) => `translateX(${100 * e * t}%) translateY(calc(-1 * var(--f7-navbar-large-title-height)))`) : g.transform = (e) => `translateX(${100 * e * t}%)`), !p && m && (g.className = "ios-swipeback-navbar-bg-large", g.transform = (e) => `translateX(${100 * e * t}%) translateY(calc(-1 * ${1 - e} * var(--f7-navbar-large-title-height)))`), p && m && (g.transform = (e) => `translateX(${100 * e * t}%)`), p && !m && (g.transform = (e) => `translateX(${100 * e * t}%) translateY(calc(-${e} * var(--f7-navbar-large-title-height)))`);
				return;
			}
			if (l.hasClass("title-large")) return;
			let v = l.hasClass("sliding") || l.parents(".navbar-inner.sliding").length;
			if (e.indexOf(g) < 0 && e.push(g), (!u || u && !v) && (g.opacity = (e) => 1 - e ** .33), v) {
				let t = g;
				if (d && _.length && a.iosAnimateNavbarBackIcon) {
					let n = { el: _[0] };
					t = n, e.push(n);
				}
				t.transform = (e) => {
					let n = e * t.el.f7NavbarRightOffset;
					return s.pixelRatio === 1 && (n = Math.round(n)), u && r ? `translate3d(${n}px, calc(-1 * var(--f7-navbar-large-collapse-progress) * var(--f7-navbar-large-title-height)), 0)` : `translate3d(${n}px,0,0)`;
				};
			}
		}), g.each((n) => {
			let r = W(n), i = r.hasClass("subnavbar"), o = r.hasClass("left"), c = r.hasClass("title"), h = r.hasClass("navbar-bg");
			if ((c || h) && l) return;
			let g = { el: n };
			if (m) {
				if (c) return;
				if (e.indexOf(g) < 0 && e.push(g), r.hasClass("title-large")) {
					g.opacity = 1, g.overflow = "visible", r.find(".title-large-text").each((t) => {
						e.push({
							el: t,
							"transform-origin": k,
							opacity: (e) => e ** 3,
							transform: (e) => `translateX(calc(${1 - e} * (var(--f7-navbarLeftTextOffset) - var(--f7-navbarTitleLargeOffset)))) translateY(calc(${e - 1} * var(--f7-navbar-large-title-height) + ${1 - e} * var(--f7-navbar-large-title-padding-vertical))) scale(${.5 + e * .5})`
						});
					});
					return;
				}
			}
			if (h) {
				e.indexOf(g) < 0 && e.push(g), !p && !m && (d ? (f && (g.className = "ios-swipeback-navbar-bg-large"), g.transform = (e) => `translateX(${(-100 + 100 * e) * t}%) translateY(calc(-1 * var(--f7-navbar-large-title-height)))`) : g.transform = (e) => `translateX(${(-100 + 100 * e) * t}%)`), !p && m && (g.transform = (e) => `translateX(${(-100 + 100 * e) * t}%) translateY(calc(-1 * ${1 - e} * var(--f7-navbar-large-title-height)))`), p && !m && (g.className = "ios-swipeback-navbar-bg-large", g.transform = (e) => `translateX(${(-100 + 100 * e) * t}%) translateY(calc(-${e} * var(--f7-navbar-large-title-height)))`), p && m && (g.transform = (e) => `translateX(${(-100 + 100 * e) * t}%)`);
				return;
			}
			if (r.hasClass("title-large")) return;
			let _ = r.hasClass("sliding") || y.children(".navbar-inner.sliding").length;
			if (e.indexOf(g) < 0 && e.push(g), (!i || i && !_) && (g.opacity = (e) => e ** 3), _) {
				let t = g;
				if (o && b.length && a.iosAnimateNavbarBackIcon) {
					let n = { el: b[0] };
					t = n, e.push(n);
				}
				t.transform = (e) => {
					let n = t.el.f7NavbarLeftOffset * (1 - e);
					return s.pixelRatio === 1 && (n = Math.round(n)), i && u ? `translate3d(${n}px, calc(-1 * var(--f7-navbar-large-collapse-progress) * var(--f7-navbar-large-title-height)), 0)` : `translate3d(${n}px,0,0)`;
				};
			}
		}), e;
	}
	function j(e) {
		let { progress: t, reset: n, transition: r, reflow: i } = e === void 0 ? {} : e, a = [
			"overflow",
			"transform",
			"transform-origin",
			"opacity"
		];
		if (r === !0 || r === !1) for (let e = 0; e < C.length; e += 1) {
			let t = C[e];
			t && t.el && (r === !0 && t.el.classList.add("navbar-page-transitioning"), r === !1 && t.el.classList.remove("navbar-page-transitioning"));
		}
		i && C.length && C[0] && C[0].el && (C[0].el._clientLeft = C[0].el.clientLeft);
		for (let e = 0; e < C.length; e += 1) {
			let r = C[e];
			if (r && r.el) {
				r.className && !r.classNameSet && !n && (r.el.classList.add(r.className), r.classNameSet = !0), r.className && n && r.el.classList.remove(r.className);
				for (let e = 0; e < a.length; e += 1) {
					let i = a[e];
					r[i] && (n ? r.el.style[i] = "" : typeof r[i] == "function" ? r.el.style[i] = r[i](t) : r.el.style[i] = r[i]);
				}
			}
		}
	}
	function M(e) {
		e.isTrusted && (!g || !a[`${i.theme}SwipeBack`] || c || i.swipeout && i.swipeout.el || !t.allowPageChange || W(e.target).closest(".range-slider, .calendar-months").length > 0 || W(e.target).closest(".page-master, .page-master-detail").length > 0 && a.masterDetailBreakpoint > 0 && i.width >= a.masterDetailBreakpoint || (l = !1, c = !0, d = void 0, u.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, u.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, _ = Ga(), b = t.dynamicNavbar));
	}
	function N(e) {
		if (!e.isTrusted || !c) return;
		let a = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX, o = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
		if (d === void 0 && (d = !!(d || Math.abs(o - u.y) > Math.abs(a - u.x)) || a < u.x && !i.rtl || a > u.x && i.rtl), d || e.f7PreventSwipeBack || i.preventSwipeBack) {
			c = !1;
			return;
		}
		if (!l) {
			let t = !1, a = W(e.target), o = a.closest(".swipeout");
			o.length > 0 && (!i.rtl && o.find(".swipeout-actions-left").length > 0 && (t = !0), i.rtl && o.find(".swipeout-actions-right").length > 0 && (t = !0)), f = a.closest(".page"), (f.hasClass("no-swipeback") || a.closest(".no-swipeback, .card-opened").length > 0) && (t = !0), p = n.find(".page-previous"), p.length > 1 && (p = p.eq(p.length - 1));
			let s = u.x - n.offset().left > E;
			if (m = n.width(), s = i.rtl ? u.x < n.offset().left - n[0].scrollLeft + (m - E) : u.x - n.offset().left > E, s && (t = !0), (p.length === 0 || f.length === 0) && (t = !0), t) {
				c = !1;
				return;
			}
			w && (x = f.find(".page-shadow-effect"), x.length === 0 && (x = W("<div class=\"page-shadow-effect\"></div>"), f.append(x))), T && (S = p.find(".page-opacity-effect"), S.length === 0 && (S = W("<div class=\"page-opacity-effect\"></div>"), p.append(S))), b && (v = r.find(".navbar-current"), y = r.find(".navbar-previous"), y.length > 1 && (y = y.eq(y.length - 1)), C = A(y, v)), W(".sheet.modal-in").length > 0 && i.sheet && i.sheet.close(W(".sheet.modal-in"));
		}
		e.f7PreventSwipePanel = !0, l = !0, i.preventSwipePanelBySwipeBack = !0, e.preventDefault();
		let g = i.rtl ? -1 : 1;
		h = (a - u.x - D) * g, h < 0 && (h = 0);
		let _ = Math.min(Math.max(h / m, 0), 1), O = {
			percentage: _,
			progress: _,
			currentPageEl: f[0],
			previousPageEl: p[0],
			currentNavbarEl: v[0],
			previousNavbarEl: y[0]
		};
		n.trigger("swipeback:move", O), t.emit("swipebackMove", O);
		let k = h * g, M = (h / 5 - m / 5) * g;
		i.rtl ? (k = Math.max(k, -m), M = Math.max(M, 0)) : (k = Math.min(k, m), M = Math.min(M, 0)), s.pixelRatio === 1 && (k = Math.round(k), M = Math.round(M)), t.swipeBackActive = !0, W([f[0], p[0]]).addClass("page-swipeback-active"), f.transform(`translate3d(${k}px,0,0)`), w && (x[0].style.opacity = 1 - 1 * _), i.theme === "ios" && p.transform(`translate3d(${M}px,0,0)`), T && (S[0].style.opacity = 1 - 1 * _), b && j({ progress: _ });
	}
	function P(e) {
		if (!e.isTrusted) return;
		if (i.preventSwipePanelBySwipeBack = !1, !c || !l) {
			c = !1, l = !1;
			return;
		}
		c = !1, l = !1, t.swipeBackActive = !1;
		let r = W([f[0], p[0]]);
		if (r.removeClass("page-swipeback-active"), h === 0) {
			r.transform(""), x && x.length > 0 && x.remove(), S && S.length > 0 && S.remove(), b && j({ reset: !0 });
			return;
		}
		let o = Ga() - _, u = !1;
		(o < 300 && h > 10 || o >= 300 && h > m / 2) && (f.removeClass("page-current").addClass(`page-next${i.theme === "ios" ? "" : " page-next-on-right"}`), p.removeClass("page-previous").addClass("page-current").removeAttr("aria-hidden"), x && (x[0].style.opacity = ""), S && (S[0].style.opacity = ""), b && (t.setNavbarPosition(v, "next"), t.setNavbarPosition(y, "current", !1)), u = !0), r.addClass("page-transitioning page-transitioning-swipeback"), s.ios && (f[0]._clientLeft = f[0].clientLeft), r.transform(""), b && j({
			progress: +!!u,
			transition: !0,
			reflow: !!s.ios
		}), g = !1, t.allowPageChange = !1;
		let d = {
			currentPageEl: f[0],
			previousPageEl: p[0],
			currentNavbarEl: v[0],
			previousNavbarEl: y[0]
		};
		u ? (t.currentRoute = p[0].f7Page.route, t.currentPage = p[0], t.pageCallback("beforeOut", f, v, "current", "next", {
			route: f[0].f7Page.route,
			swipeBack: !0
		}), t.pageCallback("beforeIn", p, y, "previous", "current", {
			route: p[0].f7Page.route,
			swipeBack: !0
		}, f[0]), n.trigger("swipeback:beforechange", d), t.emit("swipebackBeforeChange", d)) : (n.trigger("swipeback:beforereset", d), t.emit("swipebackBeforeReset", d)), f.transitionEnd(() => {
			r.removeClass("page-transitioning page-transitioning-swipeback"), b && j({
				reset: !0,
				transition: !1
			}), g = !0, t.allowPageChange = !0, u ? (t.history.length === 1 && t.history.unshift(t.url), t.history.pop(), t.saveHistory(), a.browserHistory && $.back(), t.pageCallback("afterOut", f, v, "current", "next", {
				route: f[0].f7Page.route,
				swipeBack: !0
			}), t.pageCallback("afterIn", p, y, "previous", "current", {
				route: p[0].f7Page.route,
				swipeBack: !0
			}), t.pageCallback("beforeRemove", f, v, "next", { swipeBack: !0 }), t.removePage(f), b && t.removeNavbar(v), n.trigger("swipeback:afterchange", d), t.emit("swipebackAfterChange", d), t.emit("routeChanged", t.currentRoute, t.previousRoute, t), a.preloadPreviousPage && t.back(t.history[t.history.length - 2], { preload: !0 })) : (n.trigger("swipeback:afterreset", d), t.emit("swipebackAfterReset", d)), x && x.length > 0 && x.remove(), S && S.length > 0 && S.remove();
		});
	}
	function F() {
		let e = i.touchEvents.start === "touchstart" && o.passiveListener ? {
			passive: !0,
			capture: !1
		} : !1;
		n.on(i.touchEvents.start, M, e), i.on("touchmove:active", N), i.on("touchend:passive", P);
	}
	function ee() {
		let e = i.touchEvents.start === "touchstart" && o.passiveListener ? {
			passive: !0,
			capture: !1
		} : !1;
		n.off(i.touchEvents.start, M, e), i.off("touchmove:active", N), i.off("touchend:passive", P);
	}
	F(), t.on("routerDestroy", ee);
}
//#endregion
//#region node_modules/framework7/modules/router/redirect.js
function Ro(e, t, n) {
	let r = this, i = t.route.redirect, a = e === "forward" ? "navigate" : "back";
	n.initial && r.params.browserHistory && (n.replaceState = !0, n.history = !0);
	function o(e, t) {
		t === void 0 && (t = {}), r.allowPageChange = !0, r[a](e, J({}, n, t));
	}
	function s() {
		r.allowPageChange = !0;
	}
	if (typeof i == "function") {
		r.allowPageChange = !1;
		let c = i.call(r, {
			router: r,
			to: t,
			resolve: o,
			reject: s,
			direction: e,
			app: r.app
		});
		return c && typeof c == "string" ? (r.allowPageChange = !0, r[a](c, n)) : r;
	}
	return r[a](i, n);
}
//#endregion
//#region node_modules/framework7/modules/router/process-route-queue.js
function zo(e, t, n, r, i, a, o, s) {
	let c = [];
	Array.isArray(n) ? c.push(...n) : n && typeof n == "function" && c.push(n), t && (Array.isArray(t) ? c.push(...t) : c.push(t));
	function l() {
		if (c.length === 0) {
			a();
			return;
		}
		c.shift().call(e, {
			router: e,
			to: r,
			from: i,
			resolve() {
				l();
			},
			reject() {
				o();
			},
			direction: s,
			app: e.app
		});
	}
	l();
}
function Bo(e, t, n, r, i) {
	let a = this;
	function o() {
		e && e.route && (a.params.routesBeforeEnter || e.route.beforeEnter) ? (a.allowPageChange = !1, zo(a, a.params.routesBeforeEnter, e.route.beforeEnter, e, t, () => {
			a.allowPageChange = !0, n();
		}, () => {
			r();
		}, i)) : n();
	}
	function s() {
		t && t.route && (a.params.routesBeforeLeave || t.route.beforeLeave) ? (a.allowPageChange = !1, zo(a, a.params.routesBeforeLeave, t.route.beforeLeave, e, t, () => {
			a.allowPageChange = !0, o();
		}, () => {
			r();
		}, i)) : o();
	}
	s();
}
//#endregion
//#region node_modules/framework7/modules/router/app-router-check.js
function Vo(e, t) {
	if (!e.view) throw Error(`Framework7: it is not allowed to use router methods on global app router. Use router methods only on related View, e.g. app.views.main.router.${t}(...)`);
}
//#endregion
//#region node_modules/framework7/modules/router/async-component.js
function Ho(e, t, n, r) {
	function i(e) {
		e.then((e) => {
			n({ component: e.default || e._default || e });
		}).catch((e) => {
			throw r(), Error(e, { cause: e });
		});
	}
	if (t instanceof Promise) {
		i(t);
		return;
	}
	let a = t.call(e);
	a instanceof Promise ? i(a) : n({ component: a });
}
//#endregion
//#region node_modules/framework7/modules/router/navigate.js
function Uo(e) {
	e === void 0 && (e = {});
	let t = this;
	return Vo(t, "refreshPage"), t.navigate(t.currentRoute.url, {
		ignoreCache: !0,
		reloadCurrent: !0,
		props: e
	});
}
function Wo(e, t, n) {
	n === void 0 && (n = {});
	let r = V(), i = W(t), a = e.app, o = e.view, s = J(!1, {
		animate: e.params.animate,
		browserHistory: !0,
		replaceState: !1,
		history: !0,
		reloadCurrent: e.params.reloadPages,
		reloadPrevious: !1,
		reloadAll: !1,
		clearPreviousHistory: !1,
		reloadDetail: e.params.reloadDetail,
		on: {}
	}, n), c = e.params.masterDetailBreakpoint > 0, l = c && s.route && s.route.route && (s.route.route.master === !0 || typeof s.route.route.master == "function" && s.route.route.master(a, e)), u, d, f = 0, p = e.currentRoute.modal, m;
	if (p || "popup popover sheet loginScreen actions customModal panel".split(" ").forEach((t) => {
		e.currentRoute && e.currentRoute.route && e.currentRoute.route[t] && (p = !0, m = t);
	}), p) {
		let t = e.currentRoute.modal || e.currentRoute.route.modalInstance || a[m].get(), n = e.history[e.history.length - 2], r = e.findMatchingRoute(n);
		!r && n && (r = {
			url: n,
			path: n.split("?")[0],
			query: Ka(n),
			route: {
				path: n.split("?")[0],
				url: n
			}
		}), e.modalRemove(t);
	}
	let h = e.dynamicNavbar, g = e.$el, _ = i, v = s.reloadPrevious || s.reloadCurrent || s.reloadAll, y, b, x, S;
	if (e.allowPageChange = !1, _.length === 0) return e.allowPageChange = !0, e;
	_.length && e.removeThemeElements(_), h && (x = _.children(".navbar"), b = e.$navbarsEl, x.length === 0 && _[0] && _[0].f7Page && (x = _[0].f7Page.$navbarEl)), s.route && s.route.route && s.route.route.keepAlive && !s.route.route.keepAliveData && (s.route.route.keepAliveData = { pageEl: i[0] });
	let C = g.children(".page").filter((e) => e !== _[0]), w;
	if (h && (w = b.children(".navbar").filter((e) => e !== x[0])), s.reloadPrevious && C.length < 2) return e.allowPageChange = !0, e;
	let T, E, D;
	if (c && !s.reloadAll) {
		for (let e = 0; e < C.length; e += 1) if (!u && C[e].classList.contains("page-master")) {
			u = C[e];
			continue;
		}
		if (T = !l && u, T && u) {
			for (let e = 0; e < C.length; e += 1) if (C[e].classList.contains("page-master-detail")) {
				d = C[e];
				continue;
			}
		}
		E = T && s.reloadDetail && a.width >= e.params.masterDetailBreakpoint && u;
	}
	T && (D = !d || E || s.reloadAll || s.reloadCurrent);
	let O = "next";
	if (s.reloadCurrent || s.reloadAll || E ? O = "current" : s.reloadPrevious && (O = "previous"), _.removeClass("page-previous page-current page-next").addClass(`page-${O}${l ? " page-master" : ""}${T ? " page-master-detail" : ""}${D ? " page-master-detail-root" : ""}`).trigger("page:unstack").trigger("page:position", { position: O }), e.emit("pageUnstack", _[0]), e.emit("pagePosition", _[0], O), (l || T) && (_.trigger("page:role", {
		role: l ? "master" : "detail",
		root: !!D
	}), e.emit("pageRole", _[0], {
		role: l ? "master" : "detail",
		detailRoot: !!D
	})), h && x.length && (x.removeClass("navbar-previous navbar-current navbar-next").addClass(`navbar-${O}${l ? " navbar-master" : ""}${T ? " navbar-master-detail" : ""}${D ? " navbar-master-detail-root" : ""}`), x.trigger("navbar:position", { position: O }), e.emit("navbarPosition", x[0], O), (l || T) && e.emit("navbarRole", x[0], {
		role: l ? "master" : "detail",
		detailRoot: !!D
	})), s.reloadCurrent || E) E ? (y = C.filter((e) => !e.classList.contains("page-master")), h && (S = W(y.map((e) => a.navbar.getElByPage(e)))), y.length > 1 && u && (f = y.length - 1, W(u).removeClass("page-master-stacked").trigger("page:masterunstack"), e.emit("pageMasterUnstack", u), h && (W(a.navbar.getElByPage(u)).removeClass("navbar-master-stacked"), e.emit("navbarMasterUnstack", a.navbar.getElByPage(u))))) : (y = C.eq(C.length - 1), h && (S = W(a.navbar.getElByPage(y))));
	else if (s.reloadPrevious) y = C.eq(C.length - 2), h && (S = W(a.navbar.getElByPage(y)));
	else if (s.reloadAll) y = C.filter((e) => e !== _[0]), h && (S = w.filter((e) => e !== x[0]));
	else {
		let t = [], n = [];
		if (C.length > 1) {
			let r = 0;
			for (r = 0; r < C.length - 1; r += 1) {
				if (u && C[r] === u) {
					C.eq(r).addClass("page-master-stacked"), C.eq(r).trigger("page:masterstack"), e.emit("pageMasterStack", C[r]), h && (W(a.navbar.getElByPage(u)).addClass("navbar-master-stacked"), e.emit("navbarMasterStack", a.navbar.getElByPage(u)));
					continue;
				}
				let i = a.navbar.getElByPage(C.eq(r));
				t.push(C[r]), e.pageCallback("beforeRemove", C[r], w && w[r], "previous", void 0, s), e.removePage(C[r]), h && i && (n.push(i), e.removeNavbar(i));
			}
		}
		y = g.children(".page").filter((e) => e !== _[0] && t.indexOf(e) < 0), h && (S = b.children(".navbar").filter((e) => e !== x[0] && n.indexOf(n) < 0)), t = [], n = [];
	}
	if (T && !s.reloadAll && ((y.length > 1 || E) && (y = y.filter((e) => !e.classList.contains("page-master"))), S && (S.length > 1 || E) && (S = S.filter((e) => !e.classList.contains("navbar-master")))), e.params.browserHistory && (s.browserHistory || s.replaceState) && !s.reloadPrevious) {
		let t = e.params.browserHistoryRoot || "";
		$[s.reloadCurrent || E && d || s.reloadAll || s.replaceState ? "replace" : "push"](o.id, { url: s.route.url }, t + e.params.browserHistorySeparator + s.route.url);
	}
	s.reloadPrevious || (e.currentPageEl = _[0], h && x.length ? e.currentNavbarEl = x[0] : delete e.currentNavbarEl, e.currentRoute = s.route);
	let k = s.route.url;
	s.history && (((s.reloadCurrent || E && d) && e.history.length) > 0 || s.replaceState ? (E && f > 0 && (e.history = e.history.slice(0, e.history.length - f), e.propsHistory = e.propsHistory.slice(0, e.propsHistory.length - f)), e.history[e.history.length - (s.reloadPrevious ? 2 : 1)] = k, e.propsHistory[e.propsHistory.length - (s.reloadPrevious ? 2 : 1)] = s.props || {}) : s.reloadPrevious ? (e.history[e.history.length - 2] = k, e.propsHistory[e.propsHistory.length - 2] = s.props || {}) : s.reloadAll ? (e.history = [k], e.propsHistory = [s.props || {}]) : (e.history.push(k), e.propsHistory.push(s.props || {}))), e.saveHistory();
	let A = _.parents(r).length > 0, j = _[0].f7Component;
	if (s.reloadPrevious ? (j && !A ? j.mount((e) => {
		W(e).insertBefore(y);
	}) : _.insertBefore(y), h && x.length && (x.find(".title-large").length && x.addClass("navbar-large"), S.length ? x.insertBefore(S) : (e.$navbarsEl.parents(r).length || e.$el.prepend(e.$navbarsEl), b.append(x)))) : (y.next(".page")[0] !== _[0] && (j && !A ? j.mount((e) => {
		g.append(e);
	}) : g.append(_[0])), h && x.length && (x.find(".title-large").length && x.addClass("navbar-large"), e.$navbarsEl.parents(r).length || e.$el.prepend(e.$navbarsEl), b.append(x[0]))), A ? s.route && s.route.route && s.route.route.keepAlive && !_[0].f7PageMounted && (_[0].f7PageMounted = !0, e.pageCallback("mounted", _, x, O, v ? O : "current", s, y)) : e.pageCallback("mounted", _, x, O, v ? O : "current", s, y), (s.reloadCurrent || E) && y.length > 0 ? (e.pageCallback("beforeOut", y, S, "current", void 0, s), e.pageCallback("afterOut", y, S, "current", void 0, s), e.pageCallback("beforeRemove", y, S, "current", void 0, s), e.removePage(y), h && S && S.length && e.removeNavbar(S)) : s.reloadAll ? y.each((t, n) => {
		let r = W(t), i = W(a.navbar.getElByPage(r));
		r.hasClass("page-current") && (e.pageCallback("beforeOut", y, S, "current", void 0, s), e.pageCallback("afterOut", y, S, "current", void 0, s)), e.pageCallback("beforeRemove", r, S && S.eq(n), "previous", void 0, s), e.removePage(r), h && i.length && e.removeNavbar(i);
	}) : s.reloadPrevious && (e.pageCallback("beforeRemove", y, S, "previous", void 0, s), e.removePage(y), h && S && S.length && e.removeNavbar(S)), s.route.route.tab && e.tabLoad(s.route.route.tab, J({}, s, {
		history: !1,
		browserHistory: !1
	})), c && o.checkMasterDetailBreakpoint(), e.pageCallback("init", _, x, O, v ? O : "current", s, y), s.reloadCurrent || s.reloadAll || E) return e.allowPageChange = !0, e.pageCallback("beforeIn", _, x, O, "current", s), _.removeAttr("aria-hidden"), h && x && x.removeAttr("aria-hidden"), e.pageCallback("afterIn", _, x, O, "current", s), s.reloadCurrent && s.clearPreviousHistory && e.clearPreviousHistory(), E && (e.setPagePosition(W(u), "previous"), u.f7Page && u.f7Page.navbarEl && e.setNavbarPosition(W(u.f7Page.navbarEl), "previous")), e;
	if (s.reloadPrevious) return e.allowPageChange = !0, e;
	e.pageCallback("beforeOut", y, S, "current", "previous", s), e.pageCallback("beforeIn", _, x, "next", "current", s);
	function M() {
		e.setPagePosition(_, "current", !1), e.setPagePosition(y, "previous", !y.hasClass("page-master")), h && (e.setNavbarPosition(x, "current", !1), e.setNavbarPosition(S, "previous", !S.hasClass("navbar-master"))), e.allowPageChange = !0, e.pageCallback("afterOut", y, S, "current", "previous", s), e.pageCallback("afterIn", _, x, "next", "current", s);
		let t = (e.params.preloadPreviousPage || e.params[`${a.theme}SwipeBack`]) && !l;
		t || (_.hasClass("smart-select-page") || _.hasClass("photo-browser-page") || _.hasClass("autocomplete-page") || _.hasClass("color-picker-page")) && (t = !0), t || _.attr("data-name") && _.attr("data-name") === "smart-select-page" || (e.pageCallback("beforeRemove", y, S, "previous", void 0, s), e.removePage(y), h && S.length && e.removeNavbar(S)), s.clearPreviousHistory && e.clearPreviousHistory(), e.emit("routeChanged", e.currentRoute, e.previousRoute, e), e.params.browserHistory && $.clearRouterQueue();
	}
	function N() {
		e.setPagePosition(y, "current", !1), e.setPagePosition(_, "next", !1), h && (e.setNavbarPosition(S, "current", !1), e.setNavbarPosition(x, "next", !1));
	}
	if (s.animate && !(l && a.width >= e.params.masterDetailBreakpoint)) {
		let t = e.params[`${e.app.theme}PageLoadDelay`], n = e.params.transition;
		s.transition && (n = s.transition), !n && e.currentRoute && e.currentRoute.route && (n = e.currentRoute.route.transition), !n && e.currentRoute && e.currentRoute.route.options && (n = e.currentRoute.route.options.transition), n && (_[0].f7PageTransition = n), t ? setTimeout(() => {
			N(), e.animate(y, _, S, x, "forward", n, () => {
				M();
			});
		}, t) : (N(), e.animate(y, _, S, x, "forward", n, () => {
			M();
		}));
	} else M();
	return e;
}
function Go(e, t, n, r) {
	if (t === void 0 && (t = {}), n === void 0 && (n = {}), !e.allowPageChange && !r) return e;
	let i = t, a = n, { url: o, content: s, el: c, pageName: l, component: u, componentUrl: d } = i;
	if (!a.reloadCurrent && a.route && a.route.route && a.route.route.parentPath && e.currentRoute.route && e.currentRoute.route.parentPath === a.route.route.parentPath) {
		if (a.route.url === e.url) return e.allowPageChange = !0, !1;
		let t = Object.keys(a.route.params).length === Object.keys(e.currentRoute.params).length;
		if (t && Object.keys(a.route.params).forEach((n) => {
			(!(n in e.currentRoute.params) || e.currentRoute.params[n] !== a.route.params[n]) && (t = !1);
		}), t) return a.route.route.tab ? e.tabLoad(a.route.route.tab, a) : !1;
		if (!t && a.route.route.tab && e.currentRoute.route.tab && e.currentRoute.parentPath === a.route.parentPath) return e.tabLoad(a.route.route.tab, a);
	}
	if (a.route && a.route.url && e.url === a.route.url && !(a.reloadCurrent || a.reloadPrevious) && !e.params.allowDuplicateUrls) return e.allowPageChange = !0, !1;
	!a.route && o && (a.route = e.parseRouteUrl(o), J(a.route, { route: {
		url: o,
		path: o
	} }));
	function f(t, n) {
		return Wo(e, t, J(a, n));
	}
	function p() {
		return e.allowPageChange = !0, e;
	}
	if ((o || d || u) && (e.allowPageChange = !1), s) Wo(e, e.getPageEl(s), a);
	else if (c) Wo(e, e.getPageEl(c), a);
	else if (l) Wo(e, e.$el.children(`.page[data-name="${l}"]`).eq(0), a);
	else if (u || d) try {
		e.pageComponentLoader({
			routerEl: e.el,
			component: u,
			componentUrl: d,
			options: a,
			resolve: f,
			reject: p
		});
	} catch (t) {
		throw e.allowPageChange = !0, t;
	}
	else o && (e.xhrAbortController &&= (e.xhrAbortController.abort(), !1), e.xhrRequest(o, a).then((t) => {
		Wo(e, e.getPageEl(t), a);
	}).catch(() => {
		e.allowPageChange = !0;
	}));
	return e;
}
function Ko(e, t) {
	t === void 0 && (t = {});
	let n = this;
	if (n.swipeBackActive) return n;
	let r, i, a, o, s, c, l;
	if (typeof e == "string" ? r = e : (r = e.url, i = e.route, a = e.name, o = e.path, s = e.query, c = e.params), a || o) return r = n.generateUrl({
		path: o,
		name: a,
		params: c,
		query: s
	}), r ? n.navigate(r, t) : n;
	let u = n.app;
	if (Vo(n, "navigate"), r === "#" || r === "") return n;
	let d = r.replace("./", "");
	if (d[0] !== "/" && d.indexOf("#") !== 0) {
		let e = n.currentRoute.parentPath || n.currentRoute.path;
		d = ((e ? `${e}/` : "/") + d).replace("///", "/").replace("//", "/");
	}
	if (l = i ? J(n.parseRouteUrl(d), { route: J({}, i) }) : n.findMatchingRoute(d), !l) return n;
	if (l.route && l.route.viewName) {
		let r = l.route.viewName, i = u.views[r];
		if (!i) throw Error(`Framework7: There is no View with "${r}" name that was specified in this route`);
		if (i !== n.view) return i.router.navigate(e, t);
	}
	if (l.route.redirect) return Ro.call(n, "forward", l, t);
	let f = {};
	if (l.route.options ? J(f, l.route.options, t) : J(f, t), f.openIn && (!n.params.ignoreOpenIn || n.params.ignoreOpenIn && n.history.length > 0)) return n.openIn(n, d, f);
	f.route = l;
	function p() {
		let e = !1;
		if ("popup popover sheet loginScreen actions customModal panel".split(" ").forEach((t) => {
			l.route[t] && !e && (e = !0, n.modalLoad(t, l, f, "forward"));
		}), l.route.keepAlive && l.route.keepAliveData && (Go(n, { el: l.route.keepAliveData.pageEl }, f, !1), e = !0), "url content component pageName el componentUrl".split(" ").forEach((t) => {
			l.route[t] && !e && (e = !0, Go(n, { [t]: l.route[t] }, f, !1));
		}), e) return;
		function t(e, t) {
			n.allowPageChange = !1;
			let r = !1;
			"popup popover sheet loginScreen actions customModal panel".split(" ").forEach((i) => {
				if (e[i]) {
					r = !0;
					let a = J({}, l, { route: e });
					n.allowPageChange = !0, n.modalLoad(i, a, J(f, t), "forward");
				}
			}), !r && Go(n, e, J(f, t), !0);
		}
		function r() {
			n.allowPageChange = !0;
		}
		l.route.async && (n.allowPageChange = !1, l.route.async.call(n, {
			router: n,
			to: f.route,
			from: n.currentRoute,
			resolve: t,
			reject: r,
			direction: "forward",
			app: u
		})), l.route.asyncComponent && Ho(n, l.route.asyncComponent, t, r);
	}
	function m() {
		n.allowPageChange = !0;
	}
	if (n.params.masterDetailBreakpoint > 0 && l.route.masterRoute) {
		let r = !0, i = !1;
		if (n.currentRoute && n.currentRoute.route && ((n.currentRoute.route.master === !0 || typeof n.currentRoute.route.master == "function" && n.currentRoute.route.master(u, n)) && (n.currentRoute.route === l.route.masterRoute || n.currentRoute.route.path === l.route.masterRoute.path) && (r = !1), n.currentRoute.route.masterRoute && (n.currentRoute.route.masterRoute === l.route.masterRoute || n.currentRoute.route.masterRoute.path === l.route.masterRoute.path) && (r = !1, i = !0)), r || i && t.reloadAll) return n.navigate({
			path: l.route.masterRoute.path,
			params: l.params || {}
		}, {
			animate: !1,
			reloadAll: t.reloadAll,
			reloadCurrent: t.reloadCurrent,
			reloadPrevious: t.reloadPrevious,
			browserHistory: !t.initial,
			history: !t.initial,
			once: { pageAfterIn() {
				n.navigate(e, J({}, t, {
					animate: !1,
					reloadAll: !1,
					reloadCurrent: !1,
					reloadPrevious: !1,
					history: !t.initial,
					browserHistory: !t.initial
				}));
			} }
		}), n;
	}
	return Bo.call(n, l, n.currentRoute, () => {
		l.route.modules ? u.loadModules(Array.isArray(l.route.modules) ? l.route.modules : [l.route.modules]).then(() => {
			p();
		}).catch(() => {
			m();
		}) : p();
	}, () => {
		m();
	}, "forward"), n;
}
//#endregion
//#region node_modules/framework7/modules/router/tab.js
function qo(e, t) {
	t === void 0 && (t = {});
	let n = this, r = J({
		animate: n.params.animate,
		browserHistory: !0,
		history: !0,
		parentPageEl: null,
		preload: !1,
		on: {}
	}, t), i, a;
	r.route && (!r.preload && r.route !== n.currentRoute && (a = n.previousRoute, n.currentRoute = r.route), r.preload ? (i = r.route, a = n.currentRoute) : (i = n.currentRoute, a ||= n.previousRoute), n.params.browserHistory && r.browserHistory && !r.reloadPrevious && $[n.params.browserHistoryTabs](n.view.id, { url: r.route.url }, (n.params.browserHistoryRoot || "") + n.params.browserHistorySeparator + r.route.url), r.history && (n.history[Math.max(n.history.length - 1, 0)] = r.route.url, n.saveHistory()));
	let o = W(r.parentPageEl || n.currentPageEl), s;
	s = o.length && o.find(`#${e.id}`).length ? o.find(`#${e.id}`).eq(0) : n.view.selector ? `${n.view.selector} #${e.id}` : `#${e.id}`;
	let { $newTabEl: c, $oldTabEl: l, animated: u, onTabsChanged: d } = n.app.tab.show({
		tabEl: s,
		animate: r.animate,
		tabRoute: r.route
	});
	if (c && c.parents(".page").length > 0 && r.route) {
		let e = c.parents(".page")[0].f7Page;
		e && r.route && (e.route = r.route);
	}
	function f(t) {
		n.removeThemeElements(c);
		let r = c;
		typeof t != "string" && (r = W(t)), r.trigger("tab:init tab:mounted", e), n.emit("tabInit tabMounted", c[0], e), l && l.length && (u ? d(() => {
			n.emit("routeChanged", n.currentRoute, n.previousRoute, n), n.params.unloadTabContent && n.tabRemove(l, c, e);
		}) : (n.emit("routeChanged", n.currentRoute, n.previousRoute, n), n.params.unloadTabContent && n.tabRemove(l, c, e)));
	}
	if (c[0].f7RouterTabLoaded) return !l || !l.length || (u ? d(() => {
		n.emit("routeChanged", n.currentRoute, n.previousRoute, n);
	}) : n.emit("routeChanged", n.currentRoute, n.previousRoute, n)), n;
	function p(e, t) {
		let { url: r, content: i, el: a, component: o, componentUrl: s } = e;
		function l(e) {
			n.allowPageChange = !0, e && (typeof e == "string" ? c.html(e) : (c.html(""), e.f7Component ? e.f7Component.mount((e) => {
				c.append(e);
			}) : c.append(e)), c[0].f7RouterTabLoaded = !0, f(e));
		}
		function u() {
			return n.allowPageChange = !0, n;
		}
		if (i) l(i);
		else if (a) l(a);
		else if (o || s) try {
			n.tabComponentLoader({
				tabEl: c[0],
				component: o,
				componentUrl: s,
				options: t,
				resolve: l,
				reject: u
			});
		} catch (e) {
			throw n.allowPageChange = !0, e;
		}
		else r && (n.xhrAbortController &&= (n.xhrAbortController.abort(), !1), n.xhrRequest(r, t).then((e) => {
			l(e);
		}).catch(() => {
			n.allowPageChange = !0;
		}));
	}
	let m;
	"url content component el componentUrl".split(" ").forEach((t) => {
		e[t] && (m = !0, p({ [t]: e[t] }, r));
	});
	function h(e, t) {
		p(e, J(r, t));
	}
	function g() {
		n.allowPageChange = !0;
	}
	return e.async ? e.async.call(n, {
		router: n,
		to: i,
		from: a,
		resolve: h,
		reject: g,
		app: n.app
	}) : e.asyncComponent ? Ho(n, e.asyncComponent, h, g) : m || (n.allowPageChange = !0), n;
}
function Jo(e, t, n) {
	let r = this, i;
	e[0] && (e[0].f7RouterTabLoaded = !1, delete e[0].f7RouterTabLoaded), e.children().each((e) => {
		e.f7Component && (i = !0, W(e).trigger("tab:beforeremove", n), e.f7Component.destroy());
	}), i || e.trigger("tab:beforeremove", n), r.emit("tabBeforeRemove", e[0], t[0], n), r.removeTabContent(e[0], n);
}
//#endregion
//#region node_modules/framework7/modules/router/modal.js
function Yo(e, t, n, r) {
	n === void 0 && (n = {});
	let i = this, a = i.app, o = e === "panel", s = o ? "panel" : "modal", c = J({
		animate: i.params.animate,
		browserHistory: !0,
		history: !0,
		on: {},
		once: {}
	}, n), l = J({}, t.route[e]), u = t.route, d = (e, t) => {
		let { on: n, once: r } = c, i;
		t === "open" && (i = n.modalOpen || r.modalOpen || n.panelOpen || r.panelOpen), t === "close" && (i = n.modalClose || r.modalClose || n.panelClose || r.panelClose), t === "closed" && (i = n.modalClosed || r.modalClosed || n.panelClosed || r.panelClosed), i && i(e);
	};
	function f() {
		let n = a[e].create(l);
		u.modalInstance = n;
		let r = n.el;
		function f() {
			n.close();
		}
		n.on(`${s}Open`, () => {
			r || (i.removeThemeElements(n.el), n.$el.trigger(`${e.toLowerCase()}:init ${e.toLowerCase()}:mounted`, t, n), i.emit(`${o ? "" : "modalInit"} ${e}Init ${e}Mounted`, n.el, t, n)), i.once("swipeBackMove", f), d(n, "open");
		}), n.on(`${s}Close`, () => {
			i.off("swipeBackMove", f), n.closeByRouter || i.back(), d(n, "close");
		}), n.on(`${s}Closed`, () => {
			n.$el.trigger(`${e.toLowerCase()}:beforeremove`, t, n), n.emit(`${o ? "" : "modalBeforeRemove "}${e}BeforeRemove`, n.el, t, n);
			let r = n.el.f7Component;
			d(n, "closed"), r && r.destroy(), Ua(() => {
				(r || l.component || l.asyncComponent || l.async) && i.removeModal(n.el), n.destroy(), delete n.route, delete u.modalInstance;
			});
		}), c.route && (i.params.browserHistory && c.browserHistory && $.push(i.view.id, {
			url: c.route.url,
			modal: e
		}, (i.params.browserHistoryRoot || "") + i.params.browserHistorySeparator + c.route.url), c.route !== i.currentRoute && (n.route = J(c.route, { modal: n }), i.currentRoute = n.route), c.history && !c.reloadCurrent && (i.history.push(c.route.url), i.saveHistory())), r && (i.removeThemeElements(n.el), n.$el.trigger(`${e.toLowerCase()}:init ${e.toLowerCase()}:mounted`, t, n), i.emit(`${s}Init ${e}Init ${e}Mounted`, n.el, t, n)), n.open(c.animate === !1 || c.animate === !0 ? c.animate : void 0);
	}
	function p(e, t) {
		let { url: n, content: r, component: o, componentUrl: s } = e;
		function c(e) {
			e && (typeof e == "string" ? l.content = e : e.f7Component ? e.f7Component.mount((e) => {
				l.el = e, a.$el.append(e);
			}) : l.el = e, f());
		}
		function u() {
			return i.allowPageChange = !0, i;
		}
		if (r) c(r);
		else if (o || s) try {
			i.modalComponentLoader({
				rootEl: a.el,
				component: o,
				componentUrl: s,
				options: t,
				resolve: c,
				reject: u
			});
		} catch (e) {
			throw i.allowPageChange = !0, e;
		}
		else n ? (i.xhrAbortController &&= (i.xhrAbortController.abort(), !1), i.xhrRequest(n, t).then((e) => {
			l.content = e, f();
		}).catch(() => {
			i.allowPageChange = !0;
		})) : f();
	}
	let m;
	"url content component el componentUrl template".split(" ").forEach((e) => {
		l[e] && !m && (m = !0, p({ [e]: l[e] }, c));
	}), !m && e === "actions" && f();
	function h(e, t) {
		p(e, J(c, t));
	}
	function g() {
		i.allowPageChange = !0;
	}
	return l.async && l.async.call(i, {
		router: i,
		to: c.route,
		from: i.currentRoute,
		resolve: h,
		reject: g,
		direction: r,
		app: a
	}), l.asyncComponent && Ho(i, l.asyncComponent, h, g), i;
}
function Xo(e) {
	J(e, { closeByRouter: !0 }), e.close();
}
//#endregion
//#region node_modules/framework7/modules/router/back.js
function Zo(e, t, n) {
	let r = X(), i = V(), a = W(t), o = e.app, s = e.view, c = J(!1, {
		animate: e.params.animate,
		browserHistory: !0,
		replaceState: !1
	}, n), l = e.params.masterDetailBreakpoint > 0, u = l && c.route && c.route.route && (c.route.route.master === !0 || typeof c.route.route.master == "function" && c.route.route.master(o, e)), d, f, p = e.dynamicNavbar, m = a, h = e.$el.children(".page-current"), g = h.length === 0 && c.preload, _ = l && h.hasClass("page-master");
	m.length && e.removeThemeElements(m);
	let v, y, b;
	if (p && (y = m.children(".navbar"), v = e.$navbarsEl, y.length === 0 && m[0] && m[0].f7Page && (y = m[0].f7Page.$navbarEl), b = v.find(".navbar-current")), e.allowPageChange = !1, m.length === 0 || h.length === 0 && !c.preload) return e.allowPageChange = !0, e;
	e.removeThemeElements(m), c.route && c.route.route && c.route.route.keepAlive && !c.route.route.keepAliveData && (c.route.route.keepAliveData = { pageEl: a[0] });
	let x, S;
	if (l) {
		let t = e.$el.children(".page").filter((e) => e !== m[0]);
		for (let e = 0; e < t.length; e += 1) if (!d && t[e].classList.contains("page-master")) {
			d = t[e];
			continue;
		}
		x = !u && d && e.history.indexOf(c.route.url) > e.history.indexOf(d.f7Page.route.url), !x && !u && d && d.f7Page && c.route.route.masterRoute && (x = c.route.route.masterRoute.path === d.f7Page.route.route.path);
	}
	x && d && d.f7Page && (S = e.history.indexOf(c.route.url) - e.history.indexOf(d.f7Page.route.url) === 1), m.addClass(`page-${g ? "current" : "previous"}${u ? " page-master" : ""}${x ? " page-master-detail" : ""}${S ? " page-master-detail-root" : ""}`).removeAttr("aria-hidden").trigger("page:unstack").trigger("page:position", { position: g ? "current" : "previous" }), e.emit("pageUnstack", m[0]), e.emit("pagePosition", m[0], g ? "current" : "previous"), (u || x) && (m.trigger("page:role", {
		role: u ? "master" : "detail",
		root: !!S
	}), e.emit("pageRole", m[0], {
		role: u ? "master" : "detail",
		detailRoot: !!S
	})), p && y.length > 0 && (y.addClass(`navbar-${g ? "current" : "previous"}${u ? " navbar-master" : ""}${x ? " navbar-master-detail" : ""}${S ? " navbar-master-detail-root" : ""}`).removeAttr("aria-hidden"), y.trigger("navbar:position", { position: g ? "current" : "previous" }), e.emit("navbarPosition", y[0], g ? "current" : "previous"), (u || S) && e.emit("navbarRole", y[0], {
		role: u ? "master" : "detail",
		detailRoot: !!S
	}));
	let C;
	if (c.force && h.prev(".page-previous").length >= 0) {
		e.history.indexOf(c.route.url) >= 0 ? (C = e.history.length - e.history.indexOf(c.route.url) - 1, e.history = e.history.slice(0, e.history.indexOf(c.route.url) + 2), e.propsHistory = e.propsHistory.slice(0, e.history.indexOf(c.route.url) + 2), s.history = e.history) : e.history[[e.history.length - 2]] ? e.propsHistory[e.propsHistory.length - 2] = c.props || {} : (e.history.unshift(e.url), e.propsHistory.unshift(c.props || {}));
		let t = h.prev(".page-previous"), n;
		p && (n = W(o.navbar.getElByPage(t))), t.length > 0 && (e.pageCallback("beforeRemove", t, n, "previous", void 0, c), t[0] === d && (f = !0), e.removePage(t), p && n.length && e.removeNavbar(n));
	}
	let w = m.parents(i).length > 0, T = m[0].f7Component;
	function E() {
		g && (!w && T ? T.mount((t) => {
			e.$el.append(t);
		}) : e.$el.append(m)), m.next(h).length === 0 && (!w && T ? T.mount((e) => {
			W(e).insertBefore(h);
		}) : m.insertBefore(h)), p && y.length && (y.find(".title-large").length && y.addClass("navbar-large"), y.insertBefore(b), b.length > 0 ? y.insertBefore(b) : (e.$navbarsEl.parents(i).length || e.$el.prepend(e.$navbarsEl), v.append(y))), w ? c.route && c.route.route && c.route.route.keepAlive && !m[0].f7PageMounted && (m[0].f7PageMounted = !0, e.pageCallback("mounted", m, y, "previous", "current", c, h)) : e.pageCallback("mounted", m, y, "previous", "current", c, h);
	}
	if (c.preload) {
		E(), c.route.route.tab && e.tabLoad(c.route.route.tab, J({}, c, {
			history: !1,
			browserHistory: !1,
			preload: !0
		})), u && (m.removeClass("page-master-stacked").trigger("page:masterunstack"), e.emit("pageMasterUnstack", m[0]), p && (W(o.navbar.getElByPage(m)).removeClass("navbar-master-stacked"), e.emit("navbarMasterUnstack", o.navbar.getElByPage(m)))), e.pageCallback("init", m, y, "previous", "current", c, h), g && (e.pageCallback("beforeIn", m, y, "current", void 0, c), e.pageCallback("afterIn", m, y, "current", void 0, c));
		let t = m.prevAll(".page-previous:not(.page-master)");
		return t.length > 0 && t.each((t) => {
			let n = W(t), r;
			p && (r = W(o.navbar.getElByPage(n))), e.pageCallback("beforeRemove", n, r, "previous", void 0), e.removePage(n), p && r.length && e.removeNavbar(r);
		}), e.allowPageChange = !0, e;
	}
	if (!(r.ie || r.edge || r.firefox && !r.ios) && e.params.browserHistory && c.browserHistory) if (c.replaceState) {
		let t = e.params.browserHistoryRoot || "";
		$.replace(s.id, { url: c.route.url }, t + e.params.browserHistorySeparator + c.route.url);
	} else C ? $.go(-C) : $.back();
	if (c.replaceState ? (e.history[e.history.length - 1] = c.route.url, e.propsHistory[e.propsHistory.length - 1] = c.props || {}) : (e.history.length === 1 && (e.history.unshift(e.url), e.propsHistory.unshift(c.props || {})), e.history.pop(), e.propsHistory.pop()), e.saveHistory(), e.currentPageEl = m[0], p && y.length ? e.currentNavbarEl = y[0] : delete e.currentNavbarEl, e.currentRoute = c.route, (r.ie || r.edge || r.firefox && !r.ios) && e.params.browserHistory && c.browserHistory) if (c.replaceState) {
		let t = e.params.browserHistoryRoot || "";
		$.replace(s.id, { url: c.route.url }, t + e.params.browserHistorySeparator + c.route.url);
	} else C ? $.go(-C) : $.back();
	E(), c.route.route.tab && e.tabLoad(c.route.route.tab, J({}, c, {
		history: !1,
		browserHistory: !1
	})), l && (_ || f) && s.checkMasterDetailBreakpoint(!1), e.pageCallback("init", m, y, "previous", "current", c, h), e.pageCallback("beforeOut", h, b, "current", "next", c), e.pageCallback("beforeIn", m, y, "previous", "current", c);
	function D() {
		e.setPagePosition(m, "current", !1), e.setPagePosition(h, "next", !0), p && (e.setNavbarPosition(y, "current", !1), e.setNavbarPosition(b, "next", !0)), e.pageCallback("afterOut", h, b, "current", "next", c), e.pageCallback("afterIn", m, y, "previous", "current", c), e.pageCallback("beforeRemove", h, b, "next", void 0, c), e.removePage(h), p && b.length && e.removeNavbar(b), e.allowPageChange = !0, e.emit("routeChanged", e.currentRoute, e.previousRoute, e), (e.params.preloadPreviousPage || e.params[`${o.theme}SwipeBack`]) && e.history[e.history.length - 2] && !u && e.back(e.history[e.history.length - 2], {
			preload: !0,
			props: e.propsHistory[e.propsHistory.length - 2] || {}
		}), e.params.browserHistory && $.clearRouterQueue();
	}
	function O() {
		e.setPagePosition(h, "current"), e.setPagePosition(m, "previous", !1), p && (e.setNavbarPosition(b, "current"), e.setNavbarPosition(y, "previous", !1));
	}
	if (c.animate && !(_ && o.width >= e.params.masterDetailBreakpoint)) {
		let t = e.params.transition;
		h[0] && h[0].f7PageTransition && (t = h[0].f7PageTransition, delete h[0].f7PageTransition), c.transition && (t = c.transition), !t && e.previousRoute && e.previousRoute.route && (t = e.previousRoute.route.transition), !t && e.previousRoute && e.previousRoute.route && e.previousRoute.route.options && (t = e.previousRoute.route.options.transition), O(), e.animate(h, m, b, y, "backward", t, () => {
			D();
		});
	} else D();
	return e;
}
function Qo(e, t, n, r) {
	if (!e.allowPageChange && !r) return e;
	let i = t, a = n, { url: o, content: s, el: c, pageName: l, component: u, componentUrl: d } = i;
	if (a.route.url && e.url === a.route.url && !(a.reloadCurrent || a.reloadPrevious) && !e.params.allowDuplicateUrls) return e.allowPageChange = !0, !1;
	!a.route && o && (a.route = e.parseRouteUrl(o));
	function f(t, n) {
		return Zo(e, t, J(a, n));
	}
	function p() {
		return e.allowPageChange = !0, e;
	}
	if ((o || d || u) && (e.allowPageChange = !1), s) Zo(e, e.getPageEl(s), a);
	else if (c) Zo(e, e.getPageEl(c), a);
	else if (l) Zo(e, e.$el.children(`.page[data-name="${l}"]`).eq(0), a);
	else if (u || d) try {
		e.pageComponentLoader({
			routerEl: e.el,
			component: u,
			componentUrl: d,
			options: a,
			resolve: f,
			reject: p
		});
	} catch (t) {
		throw e.allowPageChange = !0, t;
	}
	else o && (e.xhrAbortController &&= (e.xhrAbortController.abort(), !1), e.xhrRequest(o, a).then((t) => {
		Zo(e, e.getPageEl(t), a);
	}).catch(() => {
		e.allowPageChange = !0;
	}));
	return e;
}
function $o() {
	let e = this, t = X();
	if (e.swipeBackActive) return e;
	let n, r, i, a;
	typeof (arguments.length <= 0 ? void 0 : arguments[0]) == "object" ? r = (arguments.length <= 0 ? void 0 : arguments[0]) || {} : (n = arguments.length <= 0 ? void 0 : arguments[0], r = (arguments.length <= 1 ? void 0 : arguments[1]) || {});
	let { name: o, params: s, query: c } = r;
	if (o) return n = e.generateUrl({
		name: o,
		params: s,
		query: c
	}), n ? e.back(n, J({}, r, {
		name: null,
		params: null,
		query: null
	})) : e;
	let l = e.app;
	Vo(e, "back");
	let u = e.currentRoute.modal, d;
	if (u || "popup popover sheet loginScreen actions customModal panel".split(" ").forEach((t) => {
		e.currentRoute.route[t] && (u = !0, d = t);
	}), u && !r.preload) {
		let i = e.currentRoute.modal || e.currentRoute.route.modalInstance || l[d].get(), a = e.history[e.history.length - 2], o;
		if (i && i.$el) {
			let t = i.$el.prevAll(".modal-in");
			if (t.length && t[0].f7Modal) {
				let n = t[0];
				e.$el.parents(n).length || (o = n.f7Modal.route);
			}
		}
		if (o ||= e.findMatchingRoute(a), !o && a && (o = {
			url: a,
			path: a.split("?")[0],
			query: Ka(a),
			route: {
				path: a.split("?")[0],
				url: a
			}
		}), (!n || n.replace(/[# ]/g, "").trim().length === 0) && (!o || !i)) return e;
		let s = r.force && o && n;
		if (o && i) {
			let a = t.ie || t.edge || t.firefox && !t.ios, c = e.params.browserHistory && r.browserHistory !== !1, l = e.currentRoute && e.currentRoute.route && e.currentRoute.route.options && e.currentRoute.route.options.browserHistory === !1;
			c && !a && !l && $.back(), e.currentRoute = o, e.history.pop(), e.propsHistory.pop(), e.saveHistory(), c && a && !l && $.back(), e.modalRemove(i), s && e.navigate(n, { reloadCurrent: !0 });
		} else i && (e.modalRemove(i), n && e.navigate(n, { reloadCurrent: !0 }));
		return e;
	}
	let f = e.$el.children(".page-current").prevAll(".page-previous:not(.page-master)").eq(0), p;
	if (e.params.masterDetailBreakpoint > 0) {
		let t = [];
		e.$el.children(".page").each((e) => {
			t.push(e.className);
		});
		let n = e.$el.children(".page-current").prevAll(".page-master").eq(0);
		if (n.length) {
			let t = e.history[e.history.length - 2], i = e.findMatchingRoute(t);
			i && n[0].f7Page && i.route === n[0].f7Page.route.route && (f = n, r.preload || (p = l.width >= e.params.masterDetailBreakpoint));
		}
	}
	if (!r.force && f.length && !p) {
		let t = f[0].f7Page;
		if (e.params.browserHistory && t && e.history[e.history.length - 2] !== t.route.url) return e.back(e.history[e.history.length - 2], J(r, {
			force: !0,
			props: e.propsHistory[e.propsHistory.length - 2] || {}
		})), e;
		if (t) {
			let n = t.route;
			return Bo.call(e, n, e.currentRoute, () => {
				Qo(e, { el: f }, J(r, { route: n }));
			}, () => {}, "backward"), e;
		}
	}
	if (n === "#" && (n = void 0), n && n[0] !== "/" && n.indexOf("#") !== 0 && (n = ((e.path || "/") + n).replace("//", "/")), !n && e.history.length > 1 && (n = e.history[e.history.length - 2], i = e.propsHistory[e.propsHistory.length - 2] || {}), p && !r.force && e.history[e.history.length - 3]) return e.back(e.history[e.history.length - 3], J({}, r || {}, {
		force: !0,
		animate: !1,
		props: e.propsHistory[e.propsHistory.length - 3] || {}
	}));
	if (p && !r.force || (a = e.findMatchingRoute(n), a || n && (a = {
		url: n,
		path: n.split("?")[0],
		query: Ka(n),
		route: {
			path: n.split("?")[0],
			url: n
		}
	}), !a)) return e;
	if (a.route.redirect) return Ro.call(e, "backward", a, r);
	let m = {};
	a.route.options ? J(m, a.route.options, r, { props: i || {} }) : J(m, r, { props: i || {} }), m.route = a;
	function h() {
		let t = !1;
		if (a.route.keepAlive && a.route.keepAliveData && (Qo(e, { el: a.route.keepAliveData.pageEl }, m), t = !0), "url content component pageName el componentUrl".split(" ").forEach((n) => {
			a.route[n] && !t && (t = !0, Qo(e, { [n]: a.route[n] }, m));
		}), t) return;
		function n(t, n) {
			e.allowPageChange = !1, Qo(e, t, J(m, n), !0);
		}
		function r() {
			e.allowPageChange = !0;
		}
		a.route.async && (e.allowPageChange = !1, a.route.async.call(e, {
			router: e,
			to: a,
			from: e.currentRoute,
			resolve: n,
			reject: r,
			direction: "backward",
			app: l
		})), a.route.asyncComponent && Ho(e, a.route.asyncComponent, n, r);
	}
	function g() {
		e.allowPageChange = !0;
	}
	return m.preload ? h() : Bo.call(e, a, e.currentRoute, () => {
		a.route.modules ? l.loadModules(Array.isArray(a.route.modules) ? a.route.modules : [a.route.modules]).then(() => {
			h();
		}).catch(() => {
			g();
		}) : h();
	}, () => {
		g();
	}, "backward"), e;
}
//#endregion
//#region node_modules/framework7/modules/router/clear-previous-history.js
function es(e) {
	Vo(e, "clearPreviousPages");
	let t = e.app, n = e.dynamicNavbar;
	e.$el.children(".page").filter((t) => e.currentRoute && (e.currentRoute.modal || e.currentRoute.panel) ? !0 : t !== e.currentPageEl).each((r) => {
		let i = W(r), a = W(t.navbar.getElByPage(i));
		e.pageCallback("beforeRemove", i, a, "previous", void 0, {}), e.removePage(i), n && a.length && e.removeNavbar(a);
	});
}
function ts() {
	let e = this;
	Vo(e, "clearPreviousHistory");
	let t = e.history[e.history.length - 1];
	es(e), e.history = [t], e.view.history = [t], e.saveHistory();
}
//#endregion
//#region node_modules/framework7/modules/router/router-class.js
var ns = class extends Z {
	constructor(e, t) {
		super({}, [t === void 0 ? e : t]);
		let n = this;
		n.isAppRouter = t === void 0, n.isAppRouter ? J(!1, n, {
			app: e,
			params: e.params.view,
			routes: e.routes || [],
			cache: e.cache
		}) : J(!1, n, {
			app: e,
			view: t,
			viewId: t.id,
			id: t.params.routerId,
			params: t.params,
			routes: t.routes,
			history: t.history,
			propsHistory: [],
			scrollHistory: t.scrollHistory,
			cache: e.cache,
			dynamicNavbar: e.theme === "ios" && t.params.iosDynamicNavbar,
			initialPages: [],
			initialNavbars: []
		}), n.useModules(), n.allowPageChange = !0;
		let r = {}, i = {};
		return Object.defineProperty(n, "currentRoute", {
			enumerable: !0,
			configurable: !0,
			set(e) {
				e === void 0 && (e = {}), i = J({}, r), r = e, r && (n.url = r.url, n.emit("routeChange", e, i, n));
			},
			get() {
				return r;
			}
		}), Object.defineProperty(n, "previousRoute", {
			enumerable: !0,
			configurable: !0,
			get() {
				return i;
			},
			set(e) {
				i = e;
			}
		}), n;
	}
	mount() {
		let e = this, t = e.view;
		J(!1, e, {
			tempDom: V().createElement("div"),
			$el: t.$el,
			el: t.el,
			$navbarsEl: t.$navbarsEl,
			navbarsEl: t.navbarsEl
		}), e.emit("local::mount routerMount", e);
	}
	animatableNavElements(e, t, n, r, i) {
		let a = this, o = a.dynamicNavbar, s = a.params.iosAnimateNavbarBackIcon, c, l;
		function u(e, t) {
			let n = e.hasClass("sliding") || t.hasClass("sliding"), r = e.hasClass("subnavbar"), i = n ? !r : !0, a = e.find(".back .icon"), o;
			return n && s && e.hasClass("left") && a.length > 0 && a.next("span").length && (e = a.next("span"), o = !0), {
				$el: e,
				isIconLabel: o,
				leftOffset: e[0].f7NavbarLeftOffset,
				rightOffset: e[0].f7NavbarRightOffset,
				isSliding: n,
				isSubnavbar: r,
				needsOpacityTransition: i
			};
		}
		return o && (c = [], l = [], e.children(".navbar-inner").children(".left, .right, .title, .subnavbar").each((t) => {
			let a = W(t);
			a.hasClass("left") && r && i === "forward" || a.hasClass("title") && n || c.push(u(a, e.children(".navbar-inner")));
		}), t.hasClass("navbar-master") && a.params.masterDetailBreakpoint > 0 && a.app.width >= a.params.masterDetailBreakpoint || t.children(".navbar-inner").children(".left, .right, .title, .subnavbar").each((e) => {
			let a = W(e);
			a.hasClass("left") && n && !r && i === "forward" || a.hasClass("left") && n && i === "backward" || a.hasClass("title") && r || l.push(u(a, t.children(".navbar-inner")));
		}), [l, c].forEach((e) => {
			e.forEach((t) => {
				let n = t, { isSliding: r, $el: i } = t, a = e === l ? c : l;
				r && i.hasClass("title") && a && a.forEach((e) => {
					if (e.isIconLabel) {
						let t = e.$el[0];
						n.leftOffset += t && t.offsetLeft || 0;
					}
				});
			});
		})), {
			newNavEls: c,
			oldNavEls: l
		};
	}
	animate(e, t, n, r, i, a, o) {
		let s = this;
		if (s.params.animateCustom) {
			s.params.animateCustom.apply(s, [
				e,
				t,
				n,
				r,
				i,
				o
			]);
			return;
		}
		let c = s.dynamicNavbar, l = s.app.theme === "ios";
		if (a) {
			let l = `router-transition-custom router-transition-${a}-${i}`;
			(i === "forward" ? t : e).animationEnd(() => {
				s.$el.removeClass(l), c && s.$navbarsEl.length && (r && s.$navbarsEl.prepend(r), n && s.$navbarsEl.prepend(n)), o && o();
			}), c && (r && t && (s.setNavbarPosition(r, ""), r.removeClass("navbar-next navbar-previous navbar-current"), t.prepend(r)), n && e && (s.setNavbarPosition(n, ""), n.removeClass("navbar-next navbar-previous navbar-current"), e.prepend(n))), s.$el.addClass(l);
			return;
		}
		let u = `router-transition-${i} router-transition`, d, f, p, m, h, g, _;
		if (l && c) {
			s.params.masterDetailBreakpoint > 0 && s.app.width >= s.params.masterDetailBreakpoint && (n.hasClass("navbar-master") && r.hasClass("navbar-master-detail") || n.hasClass("navbar-master-detail") && r.hasClass("navbar-master")) || (g = n && n.hasClass("navbar-large"), _ = r && r.hasClass("navbar-large"), p = g && !n.hasClass("navbar-large-collapsed"), m = _ && !r.hasClass("navbar-large-collapsed"), h = p && !m || m && !p);
			let e = s.animatableNavElements(r, n, m, p, i);
			d = e.newNavEls, f = e.oldNavEls;
		}
		function v(e) {
			l && c && (e === 1 && (m && (r.addClass("router-navbar-transition-to-large"), n.addClass("router-navbar-transition-to-large")), p && (r.addClass("router-navbar-transition-from-large"), n.addClass("router-navbar-transition-from-large"))), d.forEach((t) => {
				let n = t.$el, r = i === "forward" ? t.rightOffset : t.leftOffset;
				t.isSliding && (t.isSubnavbar && _ ? n[0].style.setProperty("transform", `translate3d(${r * (1 - e)}px, calc(-1 * var(--f7-navbar-large-collapse-progress) * var(--f7-navbar-large-title-height)), 0)`, "important") : n.transform(`translate3d(${r * (1 - e)}px,0,0)`));
			}), f.forEach((t) => {
				let n = t.$el, r = i === "forward" ? t.leftOffset : t.rightOffset;
				t.isSliding && (t.isSubnavbar && g ? n.transform(`translate3d(${r * e}px, calc(-1 * var(--f7-navbar-large-collapse-progress) * var(--f7-navbar-large-title-height)), 0)`) : n.transform(`translate3d(${r * e}px,0,0)`));
			}));
		}
		function y() {
			s.dynamicNavbar && (r && (r.removeClass("router-navbar-transition-to-large router-navbar-transition-from-large"), r.addClass("navbar-no-title-large-transition"), Wa(() => {
				r.removeClass("navbar-no-title-large-transition");
			})), n && n.removeClass("router-navbar-transition-to-large router-navbar-transition-from-large"), r.hasClass("sliding") || r.children(".navbar-inner.sliding").length ? r.find(".title, .left, .right, .left .icon, .subnavbar").transform("") : r.find(".sliding").transform(""), n.hasClass("sliding") || n.children(".navbar-inner.sliding").length ? n.find(".title, .left, .right, .left .icon, .subnavbar").transform("") : n.find(".sliding").transform("")), s.$el.removeClass(u), o && o();
		}
		(i === "forward" ? t : l ? e : t).animationEnd(() => {
			y();
		}), c ? (v(0), Wa(() => {
			s.$el.addClass(u), h && (s.el._clientLeft = s.el.clientLeft), v(1);
		})) : s.$el.addClass(u);
	}
	removeModal(e) {
		this.removeEl(e);
	}
	removeTabContent(e) {
		W(e).html("");
	}
	removeNavbar(e) {
		this.removeEl(e);
	}
	removePage(e) {
		let t = W(e), n = t && t[0] && t[0].f7Page, r = this;
		if (n && n.route && n.route.route && n.route.route.keepAlive) {
			t.remove();
			return;
		}
		r.removeEl(e);
	}
	removeEl(e) {
		if (!e) return;
		let t = this, n = W(e);
		n.length !== 0 && (n.find(".tab").each((e) => {
			W(e).children().each((e) => {
				e.f7Component && (W(e).trigger("tab:beforeremove"), e.f7Component.destroy());
			});
		}), n[0].f7Component && n[0].f7Component.destroy && n[0].f7Component.destroy(), t.params.removeElements && (t.params.removeElementsWithTimeout ? setTimeout(() => {
			n.remove();
		}, t.params.removeElementsTimeout) : n.remove()));
	}
	getPageEl(e) {
		let t = this;
		if (typeof e == "string") t.tempDom.innerHTML = e;
		else {
			if (W(e).hasClass("page")) return e;
			t.tempDom.innerHTML = "", W(t.tempDom).append(e);
		}
		return t.findElement(".page", t.tempDom);
	}
	findElement(e, t) {
		let n = this, r = n.view, i = n.app, a = W(t), o = e, s = a.find(o).filter((e) => W(e).parents(".popup, .dialog, .popover, .actions-modal, .sheet-modal, .login-screen, .page").length === 0);
		if (s.length > 1 && (typeof r.selector == "string" && (s = a.find(`${r.selector} ${o}`)), s.length > 1 && (s = a.find(`.${i.params.viewMainClass} ${o}`))), s.length === 1 || (s = n.findElement(o, a), s && s.length === 1)) return s;
		if (s && s.length > 1) return W(s[0]);
	}
	flattenRoutes(e) {
		e === void 0 && (e = this.routes);
		let t = this, n = [];
		return e.forEach((e) => {
			let r = !1;
			if ("tabs" in e && e.tabs) {
				let i = e.tabs.map((t) => {
					let n = J({}, e, {
						path: `${e.path}/${t.path}`.replace("///", "/").replace("//", "/"),
						parentPath: e.path,
						tab: t
					});
					return delete n.tabs, delete n.routes, n;
				});
				r = !0, n = n.concat(t.flattenRoutes(i));
			}
			if ("detailRoutes" in e) {
				let r = e.detailRoutes.map((t) => {
					let n = J({}, t);
					return n.masterRoute = e, n.masterRoutePath = e.path, n;
				});
				n = n.concat(e, t.flattenRoutes(r));
			}
			if ("routes" in e) {
				let i = e.routes.map((t) => {
					let n = J({}, t);
					return n.path = `${e.path}/${n.path}`.replace("///", "/").replace("//", "/"), n;
				});
				n = r ? n.concat(t.flattenRoutes(i)) : n.concat(e, t.flattenRoutes(i));
			}
			!("routes" in e) && !("tabs" in e && e.tabs) && !("detailRoutes" in e) && n.push(e);
		}), n;
	}
	parseRouteUrl(e) {
		return e ? {
			query: Ka(e),
			hash: e.split("#")[1],
			params: {},
			url: e,
			path: e.split("#")[0].split("?")[0]
		} : {};
	}
	generateUrl(e) {
		if (e === void 0 && (e = {}), typeof e == "string") return e;
		let { name: t, path: n, params: r, query: i } = e;
		if (!t && !n) throw Error("Framework7: \"name\" or \"path\" parameter is required");
		let a = this, o = t ? a.findRouteByKey("name", t) : a.findRouteByKey("path", n);
		if (!o) throw Error(t ? `Framework7: route with name "${t}" not found` : `Framework7: route with path "${n}" not found`);
		let s = a.constructRouteUrl(o, {
			params: r,
			query: i
		});
		if (s === "") return "/";
		if (!s) throw Error(`Framework7: can't construct URL for route with name "${t}"`);
		return s;
	}
	constructRouteUrl(e, t) {
		let { params: n, query: r } = t === void 0 ? {} : t, { path: i } = e, a = Oo(i), o;
		try {
			o = a(n || {});
		} catch (e) {
			throw Error(`Framework7: error constructing route URL from passed params:\nRoute: ${i}\n${e.toString()}`);
		}
		return r && (typeof r == "string" ? o += `?${r}` : Object.keys(r).length && (o += `?${Ja(r)}`)), o;
	}
	findTabRouteUrl(e) {
		let t = this, n = W(e), r = t.currentRoute.route.parentPath, i = n.attr("id"), a = t.flattenRoutes(t.routes), o;
		return a.forEach((e) => {
			e.parentPath === r && e.tab && e.tab.id === i && (o = t.currentRoute.params && Object.keys(t.currentRoute.params).length > 0 ? t.constructRouteUrl(e, {
				params: t.currentRoute.params,
				query: t.currentRoute.query
			}) : e.path);
		}), o;
	}
	findRouteByKey(e, t) {
		let n = this, r = n.routes, i = n.flattenRoutes(r), a;
		return i.forEach((n) => {
			a || n[e] === t && (a = n);
		}), a;
	}
	findMatchingRoute(e) {
		if (!e) return;
		let t = this, n = t.routes, r = t.flattenRoutes(n), { path: i, query: a, hash: o, params: s } = t.parseRouteUrl(e), c;
		return r.forEach((t) => {
			if (c) return;
			let n = [], r = [t.path || "/"];
			t.alias && (typeof t.alias == "string" ? r.push(t.alias) : Array.isArray(t.alias) && t.alias.forEach((e) => {
				r.push(e);
			}));
			let l;
			if (r.forEach((e) => {
				l ||= Io(e, n).exec(i || "/");
			}), l) {
				n.forEach((e, t) => {
					if (typeof e.name == "number") return;
					let n = l[t + 1];
					n == null ? s[e.name] = n : s[e.name] = decodeURIComponent(n);
				});
				let r;
				t.parentPath && (r = (i || "/").split("/").slice(0, t.parentPath.split("/").length - 1).join("/")), c = {
					query: a,
					hash: o,
					params: s,
					url: e,
					path: i || "/",
					parentPath: r,
					route: t,
					name: t.name
				};
			}
		}), c;
	}
	replaceRequestUrlParams(e, t) {
		e === void 0 && (e = ""), t === void 0 && (t = {});
		let n = e;
		return typeof n == "string" && n.indexOf("{{") >= 0 && t && t.route && t.route.params && Object.keys(t.route.params).length && Object.keys(t.route.params).forEach((e) => {
			let r = RegExp(`{{${e}}}`, "g");
			n = n.replace(r, t.route.params[e] || "");
		}), n;
	}
	removeFromXhrCache(e) {
		let t = this.cache.xhr, n = !1;
		for (let r = 0; r < t.length; r += 1) t[r].url === e && (n = r);
		n !== !1 && t.splice(n, 1);
	}
	xhrRequest(e, t) {
		let n = this, r = n.params, { ignoreCache: i } = t, a = e, o = a.indexOf("?") >= 0;
		return r.passRouteQueryToRequest && t && t.route && t.route.query && Object.keys(t.route.query).length && (a += `${o ? "&" : "?"}${Ja(t.route.query)}`, o = !0), r.passRouteParamsToRequest && t && t.route && t.route.params && Object.keys(t.route.params).length && (a += `${o ? "&" : "?"}${Ja(t.route.params)}`, o = !0), a.indexOf("{{") >= 0 && (a = n.replaceRequestUrlParams(a, t)), r.xhrCacheIgnoreGetParameters && a.indexOf("?") >= 0 && (a = a.split("?")[0]), new Promise((e, o) => {
			if (r.xhrCache && !i && a.indexOf("nocache") < 0 && r.xhrCacheIgnore.indexOf(a) < 0) for (let t = 0; t < n.cache.xhr.length; t += 1) {
				let i = n.cache.xhr[t];
				if (i.url === a && Ga() - i.time < r.xhrCacheDuration) {
					e(i.content);
					return;
				}
			}
			n.xhrAbortController = new AbortController();
			let s;
			fetch(a, {
				signal: n.xhrAbortController.signal,
				method: "GET"
			}).then((e) => (s = e, e.text())).then((i) => {
				let { status: c } = s;
				n.emit("routerAjaxComplete", s), c !== "error" && c !== "timeout" && c >= 200 && c < 300 || c === 0 ? (r.xhrCache && i !== "" && (n.removeFromXhrCache(a), n.cache.xhr.push({
					url: a,
					time: Ga(),
					content: i
				})), n.emit("routerAjaxSuccess", s, t), e(i)) : (n.emit("routerAjaxError", s, t), o(s));
			}).catch((e) => {
				o(e);
			});
		});
	}
	setNavbarPosition(e, t, n) {
		let r = this;
		e.removeClass("navbar-previous navbar-current navbar-next"), t && e.addClass(`navbar-${t}`), n === !1 ? e.removeAttr("aria-hidden") : n === !0 && e.attr("aria-hidden", "true"), e.trigger("navbar:position", { position: t }), r.emit("navbarPosition", e[0], t);
	}
	setPagePosition(e, t, n) {
		let r = this;
		e.removeClass("page-previous page-current page-next"), e.addClass(`page-${t}`), n === !1 ? e.removeAttr("aria-hidden") : n === !0 && e.attr("aria-hidden", "true"), e.trigger("page:position", { position: t }), r.emit("pagePosition", e[0], t);
	}
	removeThemeElements(e) {
		let t = this.app.theme, n;
		t === "ios" ? n = ".md-only, .if-md, .if-not-ios, .not-ios" : t === "md" && (n = ".ios-only, .if-ios, .if-not-md, .not-md"), W(e).find(n).remove();
	}
	getPageData(e, t, n, r, i, a) {
		i === void 0 && (i = {});
		let o = this, s = W(e).eq(0), c = W(t).eq(0), l = s[0].f7Page || {}, u, d;
		if ((n === "next" && r === "current" || n === "current" && r === "previous") && (u = "forward"), (n === "current" && r === "next" || n === "previous" && r === "current") && (u = "backward"), l && !l.fromPage) {
			let e = W(a);
			e.length && (d = e[0].f7Page);
		}
		d = l.pageFrom || d, d && d.pageFrom && (d.pageFrom = null);
		let f = {
			app: o.app,
			view: o.view,
			router: o,
			$el: s,
			el: s[0],
			$pageEl: s,
			pageEl: s[0],
			$navbarEl: c,
			navbarEl: c[0],
			name: s.attr("data-name"),
			position: n,
			from: n,
			to: r,
			direction: u,
			route: l.route ? l.route : i,
			pageFrom: d
		};
		return s[0].f7Page = f, f;
	}
	pageCallback(e, t, n, r, i, a, o) {
		if (a === void 0 && (a = {}), !t) return;
		let s = this, c = W(t);
		if (!c.length) return;
		let l = W(n), { route: u } = a, d = s.params.restoreScrollTopOnBack && !(s.params.masterDetailBreakpoint > 0 && c.hasClass("page-master") && s.app.width >= s.params.masterDetailBreakpoint), f = c[0].f7Page && c[0].f7Page.route && c[0].f7Page.route.route && c[0].f7Page.route.route.keepAlive;
		e === "beforeRemove" && f && (e = "beforeUnmount");
		let p = `page${e[0].toUpperCase() + e.slice(1, e.length)}`, m = `page:${e.toLowerCase()}`, h = {};
		h = e === "beforeRemove" && c[0].f7Page ? J(c[0].f7Page, {
			from: r,
			to: i,
			position: r
		}) : s.getPageData(c[0], l[0], r, i, u, o), h.swipeBack = !!a.swipeBack;
		let { on: g = {}, once: _ = {} } = a.route ? a.route.route : {};
		a.on && J(g, a.on), a.once && J(_, a.once);
		function v() {
			c[0].f7RouteEventsAttached || (c[0].f7RouteEventsAttached = !0, g && Object.keys(g).length > 0 && (c[0].f7RouteEventsOn = g, Object.keys(g).forEach((e) => {
				g[e] = g[e].bind(s), c.on(za(e), g[e]);
			})), _ && Object.keys(_).length > 0 && (c[0].f7RouteEventsOnce = _, Object.keys(_).forEach((e) => {
				_[e] = _[e].bind(s), c.once(za(e), _[e]);
			})));
		}
		function y() {
			c[0].f7RouteEventsAttached && (c[0].f7RouteEventsOn && Object.keys(c[0].f7RouteEventsOn).forEach((e) => {
				c.off(za(e), c[0].f7RouteEventsOn[e]);
			}), c[0].f7RouteEventsOnce && Object.keys(c[0].f7RouteEventsOnce).forEach((e) => {
				c.off(za(e), c[0].f7RouteEventsOnce[e]);
			}), c[0].f7RouteEventsAttached = null, c[0].f7RouteEventsOn = null, c[0].f7RouteEventsOnce = null, delete c[0].f7RouteEventsAttached, delete c[0].f7RouteEventsOn, delete c[0].f7RouteEventsOnce);
		}
		if (e === "mounted" && v(), e === "init") {
			if (d && (r === "previous" || !r) && i === "current" && s.scrollHistory[h.route.url] && !c.hasClass("no-restore-scroll")) {
				let e = c.find(".page-content");
				e.length > 0 && (e = e.filter((e) => W(e).parents(".tab:not(.tab-active)").length === 0 && !W(e).is(".tab:not(.tab-active)"))), e.scrollTop(s.scrollHistory[h.route.url]);
			}
			if (v(), c[0].f7PageInitialized) {
				c.trigger("page:reinit", h), s.emit("pageReinit", h);
				return;
			}
			c[0].f7PageInitialized = !0;
		}
		if (d && e === "beforeOut" && r === "current" && i === "previous") {
			let e = c.find(".page-content");
			e.length > 0 && (e = e.filter((e) => W(e).parents(".tab:not(.tab-active)").length === 0 && !W(e).is(".tab:not(.tab-active)"))), s.scrollHistory[h.route.url] = e.scrollTop();
		}
		d && e === "beforeOut" && r === "current" && i === "next" && delete s.scrollHistory[h.route.url], c.trigger(m, h), s.emit(p, h), (e === "beforeRemove" || e === "beforeUnmount") && (y(), f || (c[0].f7Page && c[0].f7Page.navbarEl && delete c[0].f7Page.navbarEl.f7Page, c[0].f7Page = null));
	}
	saveHistory() {
		let e = this, t = H();
		e.view.history = e.history, e.params.browserHistory && e.params.browserHistoryStoreHistory && t.localStorage && (t.localStorage[`f7router-${e.view.id}-history`] = JSON.stringify(e.history));
	}
	restoreHistory() {
		let e = this, t = H();
		e.params.browserHistory && e.params.browserHistoryStoreHistory && t.localStorage && t.localStorage[`f7router-${e.view.id}-history`] && (e.history = JSON.parse(t.localStorage[`f7router-${e.view.id}-history`]), e.view.history = e.history);
	}
	clearHistory() {
		let e = this;
		e.history = [], e.view && (e.view.history = []), e.saveHistory();
	}
	updateCurrentUrl(e) {
		let t = this;
		Vo(t, "updateCurrentUrl"), t.history.length ? t.history[t.history.length - 1] = e : t.history.push(e);
		let { query: n, hash: r, params: i, url: a, path: o } = t.parseRouteUrl(e);
		if (t.currentRoute && J(t.currentRoute, {
			query: n,
			hash: r,
			params: i,
			url: a,
			path: o
		}), t.params.browserHistory) {
			let n = t.params.browserHistoryRoot || "";
			$.replace(t.view.id, { url: e }, n + t.params.browserHistorySeparator + e);
		}
		t.saveHistory(), t.emit("routeUrlUpdate", t.currentRoute, t);
	}
	getInitialUrl() {
		let e = this;
		if (e.initialUrl) return {
			initialUrl: e.initialUrl,
			historyRestored: e.historyRestored
		};
		let { app: t, view: n } = e, r = V(), i = H(), a = t.params.url && typeof t.params.url == "string" && typeof URL < "u" ? new URL(t.params.url) : r.location, o = e.params.url, s = a.href.split(a.origin)[1], c, { browserHistory: l, browserHistoryOnLoad: u, browserHistorySeparator: d } = e.params, { browserHistoryRoot: f } = e.params;
		return (i.cordova || i.Capacitor && i.Capacitor.isNative) && l && !d && !f && a.pathname.indexOf("index.html") && (console.warn("Framework7: wrong or not complete browserHistory configuration, trying to guess browserHistoryRoot"), f = a.pathname.split("index.html")[0]), !l || !u ? (o ||= s, a.search && o.indexOf("?") < 0 && (o += a.search), a.hash && o.indexOf("#") < 0 && (o += a.hash)) : (f && s.indexOf(f) >= 0 && (s = s.substring(s.indexOf(f) + f.length), s === "" && (s = "/")), o = d.length > 0 && s.indexOf(d) >= 0 ? s.substring(s.indexOf(d) + d.length) : s, e.restoreHistory(), e.history.indexOf(o) >= 0 ? e.history = e.history.slice(0, e.history.indexOf(o) + 1) : e.params.url === o ? e.history = [o] : $.state && $.state[n.id] && $.state[n.id].url === e.history[e.history.length - 1] ? o = e.history[e.history.length - 1] : e.history = [s.split(d)[0] || "/", o], e.history.length > 1 ? c = !0 : e.history = [], e.saveHistory()), e.initialUrl = o, e.historyRestored = c, {
			initialUrl: o,
			historyRestored: c
		};
	}
	init() {
		let e = this, { app: t, view: n } = e, r = V();
		e.mount();
		let { initialUrl: i, historyRestored: a } = e.getInitialUrl();
		(n && e.params.iosSwipeBack && t.theme === "ios" || n && e.params.mdSwipeBack && t.theme === "md") && Lo(e);
		let { browserHistory: o, browserHistoryOnLoad: s, browserHistoryAnimateOnLoad: c, browserHistoryInitialMatch: l } = e.params, u;
		if (e.history.length > 1) {
			let t = l ? i : e.history[0];
			u = e.findMatchingRoute(t), u ||= J(e.parseRouteUrl(t), { route: {
				url: t,
				path: t.split("?")[0]
			} });
		} else u = e.findMatchingRoute(i), u ||= J(e.parseRouteUrl(i), { route: {
			url: i,
			path: i.split("?")[0]
		} });
		if (e.$el.children(".page").length === 0 && i && e.params.loadInitialPage) e.navigate(i, {
			initial: !0,
			reloadCurrent: !0,
			browserHistory: !1,
			animate: !1,
			once: {
				modalOpen() {
					a && (e.params.preloadPreviousPage || e.params[`${t.theme}SwipeBack`]) && e.history.length > 1 && e.back({ preload: !0 });
				},
				pageAfterIn() {
					a && (e.params.preloadPreviousPage || e.params[`${t.theme}SwipeBack`]) && e.history.length > 1 && e.back({ preload: !0 });
				}
			}
		});
		else if (e.$el.children(".page").length) {
			let o;
			e.currentRoute = u, e.$el.children(".page").each((i) => {
				let a = W(i), s;
				e.setPagePosition(a, "current"), e.dynamicNavbar && (s = a.children(".navbar"), s.length > 0 ? (e.$navbarsEl.parents(r).length || e.$el.prepend(e.$navbarsEl), e.setNavbarPosition(s, "current"), e.$navbarsEl.append(s), s.children(".title-large").length && s.addClass("navbar-large"), a.children(".navbar").remove()) : (e.$navbarsEl.addClass("navbar-hidden"), s.children(".title-large").length && e.$navbarsEl.addClass("navbar-hidden navbar-large-hidden"))), e.currentRoute && e.currentRoute.route && (e.currentRoute.route.master === !0 || typeof e.currentRoute.route.master == "function" && e.currentRoute.route.master(t, e)) && e.params.masterDetailBreakpoint > 0 && (a.addClass("page-master"), a.trigger("page:role", { role: "master" }), s && s.length && s.addClass("navbar-master"), n.checkMasterDetailBreakpoint());
				let c = { route: e.currentRoute };
				e.currentRoute && e.currentRoute.route && e.currentRoute.route.options && J(c, e.currentRoute.route.options), e.currentPageEl = a[0], e.dynamicNavbar && s.length && (e.currentNavbarEl = s[0]), e.removeThemeElements(a), e.dynamicNavbar && s.length && e.removeThemeElements(s), c.route.route.tab && (o = !0, e.tabLoad(c.route.route.tab, J({}, c))), e.pageCallback("init", a, s, "current", void 0, c), e.pageCallback("beforeIn", a, s, "current", void 0, c), e.pageCallback("afterIn", a, s, "current", void 0, c);
			}), a && (l ? (e.params.preloadPreviousPage || e.params[`${t.theme}SwipeBack`]) && e.history.length > 1 && e.back({ preload: !0 }) : e.navigate(i, {
				initial: !0,
				browserHistory: !1,
				history: !1,
				animate: c,
				once: { pageAfterIn() {
					(e.params.preloadPreviousPage || e.params[`${t.theme}SwipeBack`]) && e.history.length > 2 && e.back({ preload: !0 });
				} }
			})), !a && !o && (e.history.push(i), e.saveHistory());
		}
		i && o && s && (!$.state || !$.state[n.id]) && $.initViewState(n.id, { url: i }), e.emit("local::init routerInit", e);
	}
	destroy() {
		let e = this;
		e.emit("local::destroy routerDestroy", e), Object.keys(e).forEach((t) => {
			e[t] = null, delete e[t];
		}), e = null;
	}
};
ns.prototype.navigate = Ko, ns.prototype.refreshPage = Uo, ns.prototype.tabLoad = qo, ns.prototype.tabRemove = Jo, ns.prototype.modalLoad = Yo, ns.prototype.modalRemove = Xo, ns.prototype.back = $o, ns.prototype.clearPreviousHistory = ts;
//#endregion
//#region node_modules/framework7/modules/router/router.js
var rs = {
	name: "router",
	static: { Router: ns },
	instance: { cache: {
		xhr: [],
		templates: [],
		components: []
	} },
	create() {
		let e = this;
		e.app ? e.params.router && (e.router = new ns(e.app, e)) : e.router = new ns(e);
	}
};
//#endregion
//#region node_modules/framework7/components/view/resizable-view.js
function is(e) {
	let t = e.app, n = Y();
	if (e.resizableInitialized) return;
	J(e, {
		resizable: !0,
		resizableWidth: null,
		resizableInitialized: !0
	});
	let r = W("html"), { $el: i } = e;
	if (!i) return;
	let a, o, s, c = {}, l, u, d, f;
	function p(e) {
		if (!e) return null;
		if (e.indexOf("%") >= 0 || e.indexOf("vw") >= 0) return parseInt(e, 10) / 100 * t.width;
		let n = parseInt(e, 10);
		return Number.isNaN(n) ? null : n;
	}
	function m() {
		return e.resizable && i.hasClass("view-resizable") && i.hasClass("view-master-detail");
	}
	function h(e) {
		if (!m()) return;
		c.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, c.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, s = !1, o = !0;
		let t = i.children(".page-master");
		d = p(t.css("min-width")), f = p(t.css("max-width"));
	}
	function g(n) {
		if (!o) return;
		n.f7PreventSwipePanel = !0;
		let p = n.type === "touchmove" ? n.targetTouches[0].pageX : n.pageX;
		s || (u = a[0].offsetLeft + a[0].offsetWidth, i.addClass("view-resizing"), r.css("cursor", "col-resize")), s = !0, n.preventDefault(), l = p - c.x;
		let m = u + l;
		d && !Number.isNaN(d) && (m = Math.max(m, d)), f && !Number.isNaN(f) && (m = Math.min(m, f)), m = Math.min(Math.max(m, 0), t.width), e.resizableWidth = m, r[0].style.setProperty("--f7-page-master-width", `${m}px`), i.trigger("view:resize", m), e.emit("local::resize viewResize", e, m);
	}
	function _() {
		if (W("html").css("cursor", ""), !o || !s) {
			o = !1, s = !1;
			return;
		}
		o = !1, s = !1, r[0].style.setProperty("--f7-page-master-width", `${e.resizableWidth}px`), i.removeClass("view-resizing");
	}
	function v() {
		e.resizableWidth && (d = p(a.css("min-width")), f = p(a.css("max-width")), d && !Number.isNaN(d) && e.resizableWidth < d && (e.resizableWidth = Math.max(e.resizableWidth, d)), f && !Number.isNaN(f) && e.resizableWidth > f && (e.resizableWidth = Math.min(e.resizableWidth, f)), e.resizableWidth = Math.min(Math.max(e.resizableWidth, 0), t.width), r[0].style.setProperty("--f7-page-master-width", `${e.resizableWidth}px`));
	}
	a = e.$el.children(".view-resize-handler"), a.length || (e.$el.append("<div class=\"view-resize-handler\"></div>"), a = e.$el.children(".view-resize-handler")), e.$resizeHandlerEl = a, i.addClass("view-resizable");
	let y = n.passiveListener ? { passive: !0 } : !1;
	e.$el.on(t.touchEvents.start, ".view-resize-handler", h, y), t.on("touchmove:active", g), t.on("touchend:passive", _), t.on("resize", v), e.on("beforeOpen", v), e.once("viewDestroy", () => {
		i.removeClass("view-resizable"), e.$resizeHandlerEl.remove(), e.$el.off(t.touchEvents.start, ".view-resize-handler", h, y), t.off("touchmove:active", g), t.off("touchend:passive", _), t.off("resize", v), e.off("beforeOpen", v);
	});
}
//#endregion
//#region node_modules/framework7/components/view/view-class.js
var as = class extends Z {
	constructor(e, t, n) {
		n === void 0 && (n = {}), super(n, [e]);
		let r = this, i = r.params.routerId, a = {
			routes: [],
			routesAdd: []
		};
		if (!i && !W(t).length) {
			let e = "Framework7: can't create a View instance because ";
			throw e += typeof t == "string" ? `the selector "${t}" didn't match any element` : "el must be an HTMLElement or Dom7 object", Error(e);
		}
		r.params = J({ el: t }, a, e.params.view, n), r.params.routes.length > 0 ? r.routes = r.params.routes : r.routes = [].concat(e.routes, r.params.routesAdd), J(!1, r, {
			app: e,
			name: r.params.name,
			main: r.params.main,
			history: [],
			scrollHistory: {}
		}), r.useModules(), e.views.push(r), r.main && (e.views.main = r), r.name && (e.views[r.name] = r), r.index = e.views.indexOf(r);
		let o;
		return o = r.name ? `view_${r.name}` : r.main ? "view_main" : `view_${r.index}`, r.id = o, r.params.init && (e.initialized ? r.init() : e.on("init", () => {
			r.init();
		})), r;
	}
	destroy() {
		let e = this, t = e.app;
		e.$el.trigger("view:beforedestroy"), e.emit("local::beforeDestroy viewBeforeDestroy", e), t.off("resize", e.checkMasterDetailBreakpoint), e.main ? (t.views.main = null, delete t.views.main) : e.name && (t.views[e.name] = null, delete t.views[e.name]), e.$el[0].f7View = null, delete e.$el[0].f7View, t.views.splice(t.views.indexOf(e), 1), e.params.router && e.router && e.router.destroy(), e.emit("local::destroy viewDestroy", e), Object.keys(e).forEach((t) => {
			e[t] = null, delete e[t];
		}), e = null;
	}
	checkMasterDetailBreakpoint(e) {
		let t = this, n = t.app, r = t.$el.hasClass("view-master-detail"), i = n.width >= t.params.masterDetailBreakpoint && t.$el.children(".page-master").length;
		e === void 0 && i || e === !0 ? (t.$el.addClass("view-master-detail"), r || (t.emit("local::masterDetailBreakpoint viewMasterDetailBreakpoint", t), t.$el.trigger("view:masterDetailBreakpoint"))) : (t.$el.removeClass("view-master-detail"), r && (t.emit("local::masterDetailBreakpoint viewMasterDetailBreakpoint", t), t.$el.trigger("view:masterDetailBreakpoint")));
	}
	initMasterDetail() {
		let e = this, t = e.app;
		e.checkMasterDetailBreakpoint = e.checkMasterDetailBreakpoint.bind(e), e.checkMasterDetailBreakpoint(), e.params.masterDetailResizable && is(e), t.on("resize", e.checkMasterDetailBreakpoint);
	}
	mount(e) {
		let t = this, n = t.app, r = t.params.el || e, i = W(r), a;
		a = typeof r == "string" ? r : (i.attr("id") ? `#${i.attr("id")}` : "") + (i.attr("class") ? `.${i.attr("class").replace(/ /g, ".").replace(".active", "")}` : "");
		let o;
		n.theme === "ios" && t.params.iosDynamicNavbar && (o = i.children(".navbars").eq(0), o.length === 0 && (o = W("<div class=\"navbars\"></div>"))), J(t, {
			$el: i,
			el: i[0],
			main: t.main || i.hasClass("view-main"),
			$navbarsEl: o,
			navbarsEl: o ? o[0] : void 0,
			selector: a
		}), t.main && (n.views.main = t), i && i[0] && (i[0].f7View = t), t.emit("local::mount viewMount", t);
	}
	init(e) {
		let t = this;
		t.mount(e), t.params.router && (t.params.masterDetailBreakpoint > 0 && t.initMasterDetail(), t.params.initRouterOnTabShow && t.$el.hasClass("tab") && !t.$el.hasClass("tab-active") ? t.$el.once("tab:show", () => {
			t.router.init();
		}) : t.router.init(), t.$el.trigger("view:init"), t.emit("local::init viewInit", t));
	}
};
as.use(rs);
//#endregion
//#region node_modules/framework7/modules/clicks/clicks.js
function os(e) {
	function t(t) {
		let n = H(), r = W(t.target), i = r.closest("a"), a = i.length > 0, o = a && i.attr("href");
		if (a && (i.is(e.params.clicks.externalLinks) || o && o.indexOf("javascript:") >= 0)) {
			let e = i.attr("target");
			o && n.cordova && n.cordova.InAppBrowser && (e === "_system" || e === "_blank") ? (t.preventDefault(), n.cordova.InAppBrowser.open(o, e)) : o && n.Capacitor && n.Capacitor.Plugins && n.Capacitor.Plugins.Browser && (e === "_system" || e === "_blank") && (t.preventDefault(), n.Capacitor.Plugins.Browser.open({ url: o }));
			return;
		}
		Object.keys(e.modules).forEach((n) => {
			let i = e.modules[n].clicks;
			i && (t.preventF7Router || Object.keys(i).forEach((n) => {
				let a = r.closest(n).eq(0);
				a.length > 0 && i[n].call(e, a, a.dataset(), t);
			}));
		});
		let s = {};
		if (a && (t.preventDefault(), s = i.dataset()), s.clickedEl = i[0], !t.preventF7Router && !(i.hasClass("prevent-router") || i.hasClass("router-prevent")) && (o && o.length > 0 && o[0] !== "#" || i.hasClass("back"))) {
			let t;
			if (s.view && s.view === "current" ? t = e.views.current : s.view ? t = W(s.view)[0].f7View : (t = r.parents(".view")[0] && r.parents(".view")[0].f7View, t && t.params.linksView && (!i.hasClass("back") || i.hasClass("back") && t.router.history.length === 1) && (typeof t.params.linksView == "string" ? t = W(t.params.linksView)[0].f7View : t.params.linksView instanceof as && (t = t.params.linksView))), t || e.views.main && (t = e.views.main), !t || !t.router) return;
			i[0].f7RouteProps && (s.props = i[0].f7RouteProps), i.hasClass("back") ? t.router.back(o, s) : t.router.navigate(o, s);
		}
	}
	e.on("click", t);
}
var ss = {
	name: "clicks",
	params: { clicks: { externalLinks: ".external" } },
	on: { init() {
		os(this);
	} }
}, cs = {
	name: "history",
	static: { history: $ },
	on: { init() {
		$.init(this);
	} }
}, ls = {
	registrations: [],
	register(e, t) {
		let n = this;
		return !("serviceWorker" in H().navigator) || !n.serviceWorker.container ? new Promise((e, t) => {
			t(/* @__PURE__ */ Error("Service worker is not supported"));
		}) : new Promise((r, i) => {
			n.serviceWorker.container.register(e, t ? { scope: t } : {}).then((e) => {
				ls.registrations.push(e), n.emit("serviceWorkerRegisterSuccess", e), r(e);
			}).catch((e) => {
				n.emit("serviceWorkerRegisterError", e), i(e);
			});
		});
	},
	unregister(e) {
		let t = this;
		if (!("serviceWorker" in H().navigator) || !t.serviceWorker.container) return new Promise((e, t) => {
			t(/* @__PURE__ */ Error("Service worker is not supported"));
		});
		let n;
		return n = e ? Array.isArray(e) ? e : [e] : ls.registrations, Promise.all(n.map((e) => new Promise((n, r) => {
			e.unregister().then(() => {
				ls.registrations.indexOf(e) >= 0 && ls.registrations.splice(ls.registrations.indexOf(e), 1), t.emit("serviceWorkerUnregisterSuccess", e), n();
			}).catch((n) => {
				t.emit("serviceWorkerUnregisterError", e, n), r(n);
			});
		})));
	}
}, us = {
	name: "sw",
	params: { serviceWorker: {
		path: void 0,
		scope: void 0
	} },
	create() {
		let e = this, t = H();
		J(e, { serviceWorker: {
			container: "serviceWorker" in t.navigator ? t.navigator.serviceWorker : void 0,
			registrations: ls.registrations,
			register: ls.register.bind(e),
			unregister: ls.unregister.bind(e)
		} });
	},
	on: { init() {
		let e = H();
		if (!("serviceWorker" in e.navigator)) return;
		let t = this;
		if (t.device.cordova || e.Capacitor && e.Capacitor.isNative || !t.serviceWorker.container) return;
		let n = t.params.serviceWorker.path, r = t.params.serviceWorker.scope;
		!n || Array.isArray(n) && !n.length || (Array.isArray(n) ? n : [n]).forEach((e) => {
			t.serviceWorker.register(e, r);
		});
	} }
};
//#endregion
//#region node_modules/framework7/modules/store/create-store.js
function ds(e) {
	e === void 0 && (e = {});
	let t = { __store: !0 }, n = { ...e.state || {} }, r = { ...e.actions || {} }, i = { ...e.getters || {} }, a = J({}, n), o = [], s = {}, c = {};
	Object.keys(i).forEach((e) => {
		s[e] = [], c[e] = [];
	});
	let l = (e) => i[e]({ state: t.state }), u = (e, t) => {
		s[e] || (s[e] = []), t.forEach((t) => {
			s[e].indexOf(t) < 0 && s[e].push(t);
		});
	}, d = (e, t) => {
		c[e] || (c[e] = []), c[e].push(t);
	}, f = (e) => {
		Object.keys(s).filter((t) => s[t].indexOf(e) >= 0).forEach((e) => {
			!c[e] || !c[e].length || c[e].forEach((t) => {
				t(l(e));
			});
		});
	}, p = (e) => {
		Object.keys(c).forEach((t) => {
			let n = c[t];
			n.indexOf(e) >= 0 && n.splice(n.indexOf(e), 1);
		});
	};
	t.__removeCallback = (e) => {
		p(e);
	};
	let m = function(e, t) {
		if (t === void 0 && (t = !0), e === "constructor") return;
		o = [];
		let n = l(e);
		u(e, o);
		let r = {
			value: n,
			onUpdated: (t) => {
				d(e, t);
			}
		};
		if (!t) return r;
		let i = (e) => {
			r.value = e;
		};
		return r.__callback = i, d(e, i), r;
	};
	return t.state = new Proxy(a, {
		set: (e, t, n) => (e[t] = n, f(t), !0),
		get: (e, t) => (o.push(t), e[t])
	}), t.getters = new Proxy(i, {
		set: () => !1,
		get: (e, t) => {
			if (e[t]) return m(t, !0);
		}
	}), t._gettersPlain = new Proxy(i, {
		set: () => !1,
		get: (e, t) => {
			if (e[t]) return m(t, !1);
		}
	}), t.dispatch = (e, n) => new Promise((i, a) => {
		if (!r[e]) throw a(), Error(`Framework7: Store action "${e}" is not found`);
		i(r[e]({
			state: t.state,
			dispatch: t.dispatch
		}, n));
	}), t;
}
//#endregion
//#region node_modules/framework7/modules/store/store.js
var fs = {
	name: "store",
	static: { createStore: ds },
	proto: { createStore: ds }
}, ps = () => {
	let e = H();
	return e.Capacitor && e.Capacitor.isNative && e.Capacitor.Plugins && e.Capacitor.Plugins.StatusBar;
}, ms = {
	hide() {
		let e = H();
		X().cordova && e.StatusBar && e.StatusBar.hide(), ps() && e.Capacitor.Plugins.StatusBar.hide();
	},
	show() {
		let e = H();
		X().cordova && e.StatusBar && e.StatusBar.show(), ps() && e.Capacitor.Plugins.StatusBar.show();
	},
	onClick() {
		let e = this, t;
		t = W(".popup.modal-in").length > 0 ? W(".popup.modal-in").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : W(".panel.panel-in").length > 0 ? W(".panel.panel-in").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : W(".views > .view.tab-active").length > 0 ? W(".views > .view.tab-active").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : W(".views").length > 0 ? W(".views").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : e.$el.children(".view").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content"), t && t.length > 0 && (t.hasClass("tab") && (t = t.parent(".tabs").children(".page-content.tab-active")), t.length > 0 && t.scrollTop(0, 300));
	},
	setTextColor(e) {
		let t = H();
		X().cordova && t.StatusBar && (e === "white" ? t.StatusBar.styleLightContent() : t.StatusBar.styleDefault()), ps() && (e === "white" ? t.Capacitor.Plugins.StatusBar.setStyle({ style: "DARK" }) : t.Capacitor.Plugins.StatusBar.setStyle({ style: "LIGHT" }));
	},
	setBackgroundColor(e) {
		let t = H();
		X().cordova && t.StatusBar && t.StatusBar.backgroundColorByHexString(e), ps() && t.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: e });
	},
	isVisible() {
		let e = H(), t = X();
		return new Promise((n) => {
			t.cordova && e.StatusBar && n(e.StatusBar.isVisible), ps() && e.Capacitor.Plugins.StatusBar.getInfo().then((e) => {
				n(e.visible);
			}), n(!1);
		});
	},
	overlaysWebView(e) {
		e === void 0 && (e = !0);
		let t = H();
		X().cordova && t.StatusBar && t.StatusBar.overlaysWebView(e), ps() && t.Capacitor.Plugins.StatusBar.setOverlaysWebView({ overlay: e });
	},
	init() {
		let e = this, t = H(), n = X(), r = e.params.statusbar;
		if (!r.enabled) return;
		let i = n.cordova && t.StatusBar, a = ps();
		(i || a) && (r.scrollTopOnClick && W(t).on("statusTap", ms.onClick.bind(e)), n.ios && (r.iosOverlaysWebView ? ms.overlaysWebView(!0) : ms.overlaysWebView(!1), r.iosTextColor === "white" ? ms.setTextColor("white") : ms.setTextColor("black")), n.android && (r.androidOverlaysWebView ? ms.overlaysWebView(!0) : ms.overlaysWebView(!1), r.androidTextColor === "white" ? ms.setTextColor("white") : ms.setTextColor("black"))), r.iosBackgroundColor && n.ios && ms.setBackgroundColor(r.iosBackgroundColor), r.androidBackgroundColor && n.android && ms.setBackgroundColor(r.androidBackgroundColor);
	}
}, hs = {
	name: "statusbar",
	params: { statusbar: {
		enabled: !0,
		scrollTopOnClick: !0,
		iosOverlaysWebView: !0,
		iosTextColor: "black",
		iosBackgroundColor: null,
		androidOverlaysWebView: !1,
		androidTextColor: "black",
		androidBackgroundColor: null
	} },
	create() {
		ao(this, { statusbar: ms });
	},
	on: { init() {
		let e = this;
		ms.init.call(e);
	} }
};
//#endregion
//#region node_modules/framework7/components/view/view.js
function gs(e) {
	let t = W(".popover.modal-in .view"), n = W(".popup.modal-in .view"), r = W(".panel.panel-in .view"), i = W(".views");
	i.length === 0 && (i = e.$el);
	let a = i.children(".view");
	if (a.length === 0 && (a = i.children(".tabs").children(".view")), a.length > 1 && a.hasClass("tab") && (a = i.children(".view.tab-active"), a.length === 0 && (a = i.children(".tabs").children(".view.tab-active"))), t.length > 0 && t[0].f7View) return t[0].f7View;
	if (n.length > 0 && n[0].f7View) return n[0].f7View;
	if (r.length > 0 && r[0].f7View) return r[0].f7View;
	if (a.length > 0) {
		if (a.length === 1 && a[0].f7View) return a[0].f7View;
		if (a.length > 1) return e.views.main;
	}
}
var _s = {
	name: "view",
	params: { view: {
		init: !0,
		initRouterOnTabShow: !1,
		name: void 0,
		main: !1,
		router: !0,
		linksView: null,
		xhrCache: !0,
		xhrCacheIgnore: [],
		xhrCacheIgnoreGetParameters: !1,
		xhrCacheDuration: 1e3 * 60 * 10,
		componentCache: !0,
		preloadPreviousPage: !0,
		allowDuplicateUrls: !1,
		reloadPages: !1,
		reloadDetail: !1,
		masterDetailBreakpoint: 0,
		masterDetailResizable: !1,
		removeElements: !0,
		removeElementsWithTimeout: !1,
		removeElementsTimeout: 0,
		restoreScrollTopOnBack: !0,
		unloadTabContent: !0,
		passRouteQueryToRequest: !0,
		passRouteParamsToRequest: !1,
		loadInitialPage: !0,
		iosSwipeBack: !0,
		iosSwipeBackAnimateShadow: !0,
		iosSwipeBackAnimateOpacity: !0,
		iosSwipeBackActiveArea: 30,
		iosSwipeBackThreshold: 0,
		mdSwipeBack: !1,
		mdSwipeBackAnimateShadow: !0,
		mdSwipeBackAnimateOpacity: !1,
		mdSwipeBackActiveArea: 30,
		mdSwipeBackThreshold: 0,
		browserHistory: !1,
		browserHistoryRoot: void 0,
		browserHistoryAnimate: !0,
		browserHistoryAnimateOnLoad: !1,
		browserHistorySeparator: "#!",
		browserHistoryOnLoad: !0,
		browserHistoryInitialMatch: !1,
		browserHistoryStoreHistory: !0,
		browserHistoryTabs: "replace",
		animate: !0,
		iosDynamicNavbar: !0,
		iosAnimateNavbarBackIcon: !0,
		iosPageLoadDelay: 0,
		mdPageLoadDelay: 0,
		routesBeforeEnter: null,
		routesBeforeLeave: null
	} },
	static: { View: as },
	create() {
		let e = this;
		J(e, { views: J([], {
			create(t, n) {
				return new as(e, t, n);
			},
			get(e) {
				let t = W(e);
				if (t.length && t[0].f7View) return t[0].f7View;
			}
		}) }), Object.defineProperty(e.views, "current", {
			enumerable: !0,
			configurable: !0,
			get() {
				return gs(e);
			}
		}), e.view = e.views;
	},
	on: {
		init() {
			let e = this;
			W(".view-init").each((t) => {
				if (t.f7View) return;
				let n = W(t).dataset();
				e.views.create(t, n);
			});
		},
		"modalOpen panelOpen": function(e) {
			let t = this;
			e.$el.find(".view-init").each((e) => {
				if (e.f7View) return;
				let n = W(e).dataset();
				t.views.create(e, n);
			});
		},
		"modalBeforeDestroy panelBeforeDestroy": function(e) {
			!e || !e.$el || e.$el.find(".view-init").each((e) => {
				let t = e.f7View;
				t && t.destroy();
			});
		}
	},
	vnode: { "view-init": {
		insert(e) {
			let t = this, n = e.elm;
			if (n.f7View) return;
			let r = W(n).dataset();
			t.views.create(n, r);
		},
		destroy(e) {
			let t = e.elm.f7View;
			t && t.destroy();
		}
	} }
}, vs = {
	size(e) {
		let t = this, n = W(e);
		if (n.hasClass("navbars")) {
			n = n.children(".navbar").each((e) => {
				t.navbar.size(e);
			});
			return;
		}
		let r = n.children(".navbar-inner");
		if (!r.length) return;
		let i = r.hasClass("navbar-inner-centered-title") || t.params.navbar[`${t.theme}CenterTitle`], a = t.theme === "ios" && !t.params.navbar[`${t.theme}CenterTitle`];
		if (!i && !a || n.parents(".tab:not(.tab-active)").length > 0 || n.parents(".popup:not(.modal-in)").length > 0) return;
		t.theme !== "ios" && t.params.navbar[`${t.theme}CenterTitle`] && r.addClass("navbar-inner-centered-title"), t.theme === "ios" && !t.params.navbar.iosCenterTitle && r.addClass("navbar-inner-left-title");
		let o = n.parents(".view").eq(0), s = t.rtl ? r.children(".right") : r.children(".left"), c = t.rtl ? r.children(".left") : r.children(".right"), l = r.children(".title"), u = r.children(".subnavbar"), d = s.length === 0, f = c.length === 0, p = d ? 0 : s.outerWidth(!0), m = f ? 0 : c.outerWidth(!0), h = l.outerWidth(!0), g = r.styles(), _ = r[0].offsetWidth - parseInt(g.paddingLeft, 10) - parseInt(g.paddingRight, 10), v = n.hasClass("navbar-previous"), y = r.hasClass("sliding"), b, x;
		o.length > 0 && o[0].f7View && (b = o[0].f7View.router, x = b && b.dynamicNavbar);
		let S, C;
		f && (S = _ - h), d && (S = 0), !d && !f && (S = (_ - m - h + p) / 2);
		let w = (_ - h) / 2;
		_ - p - m > h ? (w < p && (w = p), w + h > _ - m && (w = _ - m - h), C = w - S) : C = 0;
		let T = t.rtl ? -1 : 1;
		if (x && t.theme === "ios") {
			if (l.hasClass("sliding") || l.length > 0 && y) {
				let e = -(S + C) * T, t = (_ - S - C - h) * T;
				if (v && b && b.params.iosAnimateNavbarBackIcon) {
					let t = n.parent().find(".navbar-current").children(".left.sliding").find(".back .icon ~ span");
					t.length > 0 && (e += t[0].offsetLeft);
				}
				l[0].f7NavbarLeftOffset = e, l[0].f7NavbarRightOffset = t;
			}
			if (!d && (s.hasClass("sliding") || y)) {
				if (t.rtl) s[0].f7NavbarLeftOffset = -(_ - s[0].offsetWidth) / 2 * T, s[0].f7NavbarRightOffset = p * T;
				else if (s[0].f7NavbarLeftOffset = -p, s[0].f7NavbarRightOffset = (_ - s[0].offsetWidth) / 2, b && b.params.iosAnimateNavbarBackIcon && s.find(".back .icon").length > 0 && s.find(".back .icon ~ span").length) {
					let e = s[0].f7NavbarLeftOffset, t = s[0].f7NavbarRightOffset;
					s[0].f7NavbarLeftOffset = 0, s[0].f7NavbarRightOffset = 0, s.find(".back .icon ~ span")[0].f7NavbarLeftOffset = e, s.find(".back .icon ~ span")[0].f7NavbarRightOffset = t - s.find(".back .icon")[0].offsetWidth;
				}
			}
			!f && (c.hasClass("sliding") || y) && (t.rtl ? (c[0].f7NavbarLeftOffset = -m * T, c[0].f7NavbarRightOffset = (_ - c[0].offsetWidth) / 2 * T) : (c[0].f7NavbarLeftOffset = -(_ - c[0].offsetWidth) / 2, c[0].f7NavbarRightOffset = m)), u.length && (u.hasClass("sliding") || y) && (u[0].f7NavbarLeftOffset = t.rtl ? u[0].offsetWidth : -u[0].offsetWidth, u[0].f7NavbarRightOffset = -u[0].f7NavbarLeftOffset);
		}
		if (i) {
			let e = C;
			t.rtl && d && f && l.length > 0 && (e = -e), l.css({ left: `${e}px` });
		}
	},
	hide(e, t, n, r) {
		t === void 0 && (t = !0), n === void 0 && (n = !1), r === void 0 && (r = !1);
		let i = this, a = W(e), o = a.hasClass("navbar") && a.parent(".navbars").length && !r;
		if (o && (a = a.parents(".navbars")), !a.length || a.hasClass("navbar-hidden")) return;
		let s = `navbar-hidden${t ? " navbar-transitioning" : ""}`;
		(o ? a.find(".navbar-current .title-large").length : a.find(".title-large").length) && (s += " navbar-large-hidden"), n && (s += " navbar-hidden-statusbar"), a.transitionEnd(() => {
			a.removeClass("navbar-transitioning");
		}), a.addClass(s), o ? a.children(".navbar").each((e) => {
			W(e).trigger("navbar:hide"), i.emit("navbarHide", e);
		}) : (a.trigger("navbar:hide"), i.emit("navbarHide", a[0]));
	},
	show(e, t, n) {
		e === void 0 && (e = ".navbar-hidden"), t === void 0 && (t = !0), n === void 0 && (n = !1);
		let r = this, i = W(e), a = i.hasClass("navbar") && i.parent(".navbars").length && !n;
		a && (i = i.parents(".navbars")), i.length && i.hasClass("navbar-hidden") && (t && (i.addClass("navbar-transitioning"), i.transitionEnd(() => {
			i.removeClass("navbar-transitioning");
		})), i.removeClass("navbar-hidden navbar-large-hidden navbar-hidden-statusbar"), a ? i.children(".navbar").each((e) => {
			W(e).trigger("navbar:show"), r.emit("navbarShow", e);
		}) : (i.trigger("navbar:show"), r.emit("navbarShow", i[0])));
	},
	getElByPage(e) {
		let t, n, r;
		if (e.$navbarEl || e.$el ? (r = e, t = e.$el) : (t = W(e), t.length > 0 && (r = t[0].f7Page)), r && r.$navbarEl && r.$navbarEl.length > 0 ? n = r.$navbarEl : t && (n = t.children(".navbar")), !(!n || n && n.length === 0)) return n[0];
	},
	getPageByEl(e) {
		let t = W(e);
		if (t.parents(".page").length) return t.parents(".page")[0];
		let n;
		return t.parents(".view").find(".page").each((e) => {
			e && e.f7Page && e.f7Page.navbarEl && t[0] === e.f7Page.navbarEl && (n = e);
		}), n;
	},
	collapseLargeTitle(e) {
		let t = this, n = W(e);
		if (n.hasClass("navbars") && (n = n.find(".navbar"), n.length > 1 && (n = W(e).find(".navbar-large.navbar-current")), n.length > 1 || !n.length)) return;
		let r = W(t.navbar.getPageByEl(n));
		n.addClass("navbar-large-collapsed"), r.eq(0).addClass("page-with-navbar-large-collapsed").trigger("page:navbarlargecollapsed"), t.emit("pageNavbarLargeCollapsed", r[0]), n.trigger("navbar:collapse"), t.emit("navbarCollapse", n[0]);
	},
	expandLargeTitle(e) {
		let t = this, n = W(e);
		if (n.hasClass("navbars") && (n = n.find(".navbar-large"), n.length > 1 && (n = W(e).find(".navbar-large.navbar-current")), n.length > 1 || !n.length)) return;
		let r = W(t.navbar.getPageByEl(n));
		n.removeClass("navbar-large-collapsed"), r.eq(0).removeClass("page-with-navbar-large-collapsed").trigger("page:navbarlargeexpanded"), t.emit("pageNavbarLargeExpanded", r[0]), n.trigger("navbar:expand"), t.emit("navbarExpand", n[0]);
	},
	toggleLargeTitle(e) {
		let t = this, n = W(e);
		n.hasClass("navbars") && (n = n.find(".navbar-large"), n.length > 1 && (n = W(e).find(".navbar-large.navbar-current")), n.length > 1 || !n.length) || (n.hasClass("navbar-large-collapsed") ? t.navbar.expandLargeTitle(n) : t.navbar.collapseLargeTitle(n));
	},
	initNavbarOnScroll(e, t, n, r, i) {
		let a = this, o = Y(), s = W(e), c = W(t), l = c.find(".title-large"), u = l.length || c.hasClass(".navbar-large"), d = 44, f = a.params.navbar.snapPageScrollToLargeTitle, p = a.params.navbar.snapPageScrollToTransparentNavbar, m, h, g, _, v, y, b, x, S, C;
		(r || n && u) && (S = c.css("--f7-navbar-large-title-height"), S && S.indexOf("px") >= 0 ? (S = parseInt(S, 10), Number.isNaN(S) && l.length ? S = l[0].offsetHeight : Number.isNaN(S) && (a.theme === "ios" ? S = 52 : a.theme === "md" && (S = 88))) : l.length ? S = l[0].offsetHeight : a.theme === "ios" ? S = 52 : a.theme === "md" && (S = 88)), n && u && (d += S);
		let w, T, E, D;
		function O() {
			s.find(".page-content").each((e) => {
				e.f7ScrollableDistance = e.scrollHeight - e.offsetHeight;
			});
		}
		function k() {
			c.hasClass("with-searchbar-expandable-enabled") || !T || h < 0 || (h >= S / 2 && h < S ? W(T).scrollTop(S, 100) : h < S && W(T).scrollTop(0, 200));
		}
		function A() {
			c.hasClass("with-searchbar-expandable-enabled") || !T || h < 0 || (h >= C / 2 && h < C ? W(T).scrollTop(C, 100) : h < C && W(T).scrollTop(0, 200));
		}
		function j() {
			let e = c.hasClass("navbar-hidden") || c.parent(".navbars").hasClass("navbar-hidden");
			if (c.hasClass("with-searchbar-expandable-enabled") || e) return;
			C ||= t.offsetHeight;
			let n = h / C, r = c.hasClass("navbar-transparent-visible");
			if (n = Math.max(Math.min(n, 1), 0), r && n === 1 || !r && n === 0) {
				c.find(".navbar-bg, .title").css("opacity", "");
				return;
			}
			if (r && n === 0) {
				c.trigger("navbar:transparenthide"), a.emit("navbarTransparentHide", c[0]), c.removeClass("navbar-transparent-visible"), c.find(".navbar-bg, .title").css("opacity", "");
				return;
			}
			if (!r && n === 1) {
				c.trigger("navbar:transparentshow"), a.emit("navbarTransparentShow", c[0]), c.addClass("navbar-transparent-visible"), c.find(".navbar-bg, .title").css("opacity", "");
				return;
			}
			c.find(".navbar-bg, .title").css("opacity", n), p && (o.touch ? D &&= (clearTimeout(D), D = null, setTimeout(() => {
				A(), clearTimeout(D), D = null;
			}, 70)) : (clearTimeout(E), E = setTimeout(() => {
				A();
			}, 300)));
		}
		let M = null, N = null;
		function P(e) {
			if (c.hasClass("navbar-hidden") || c.parent(".navbars").hasClass("navbar-hidden")) return;
			let t = c.hasClass("navbar-large-transparent") || c.hasClass("navbar-large") && c.hasClass("navbar-transparent");
			M = N;
			let n = Math.min(S, e.f7ScrollableDistance || S);
			N = Math.min(Math.max(h / n, 0), 1);
			let r = M > 0 && M < 1;
			if (c.hasClass("with-searchbar-expandable-enabled")) return;
			x = c.hasClass("navbar-large-collapsed");
			let i = c.find(".navbar-bg");
			N === 0 && x ? a.navbar.expandLargeTitle(c[0]) : N === 1 && !x && a.navbar.collapseLargeTitle(c[0]), N === 0 && x || N === 0 && r || N === 1 && !x || N === 1 && r ? (a.theme === "md" && c.find(".navbar-inner").css("overflow", ""), c.find(".title").css("opacity", ""), c.find(".title-large-text, .subnavbar").css("transform", ""), c.find(".title-large-text").css("opacity", ""), t && i.css("opacity", ""), i.css("transform", "")) : N > 0 && N < 1 && (a.theme === "md" && c.find(".navbar-inner").css("overflow", "visible"), c.find(".title").css("opacity", -.5 + N * 1.5), c.find(".title-large-text, .subnavbar").css("transform", `translate3d(0px, ${-1 * N * S}px, 0)`), c.find(".title-large-text").css("opacity", 1 - N * 2), t && i.css("opacity", N), i.css("transform", `translate3d(0px, ${-1 * N * S}px, 0)`)), f && (o.touch ? D &&= (clearTimeout(D), D = null, setTimeout(() => {
				k(), clearTimeout(D), D = null;
			}, 70)) : (clearTimeout(E), E = setTimeout(() => {
				k();
			}, 300)));
		}
		function F() {
			s.hasClass("page-with-card-opened") || (g = T.scrollHeight, _ = T.offsetHeight, v = h + _ >= g, b = c.hasClass("navbar-hidden") || c.parent(".navbars").hasClass("navbar-hidden"), v ? a.params.navbar.showOnPageScrollEnd && (y = "show") : y = m > h ? a.params.navbar.showOnPageScrollTop || h <= d ? "show" : "hide" : h > d ? "hide" : "show", y === "show" && b ? (a.navbar.show(c, !0, !0), b = !1) : y === "hide" && !b && (a.navbar.hide(c, !0, !1, !0), b = !0), m = h);
		}
		function ee(e) {
			T = this, !(e && e.target && e.target !== T) && (h = T.scrollTop, w = h, r ? P(T) : i && j(), !s.hasClass("page-previous") && n && F());
		}
		function te() {
			w = !1;
		}
		function I() {
			clearTimeout(D), D = null, D = setTimeout(() => {
				w !== !1 && (i && !r ? A() : k(), clearTimeout(D), D = null);
			}, 70);
		}
		s.on("scroll", ".page-content", ee, !0), o.touch && (r && f || i && p) && (a.on("touchstart:passive", te), a.on("touchend:passive", I)), O(), (r || i) && s.find(".page-content").each((e) => {
			e.scrollTop > 0 && ee.call(e);
		}), a.on("resize", O), s[0].f7DetachNavbarScrollHandlers = function() {
			a.off("resize", O), delete s[0].f7DetachNavbarScrollHandlers, s.off("scroll", ".page-content", ee, !0), o.touch && (r && f || i && p) && (a.off("touchstart:passive", te), a.off("touchend:passive", I));
		};
	}
}, ys = {
	name: "navbar",
	create() {
		ao(this, { navbar: vs });
	},
	params: { navbar: {
		scrollTopOnTitleClick: !0,
		iosCenterTitle: !0,
		mdCenterTitle: !1,
		hideOnPageScroll: !1,
		showOnPageScrollEnd: !0,
		showOnPageScrollTop: !0,
		collapseLargeTitleOnScroll: !0,
		snapPageScrollToLargeTitle: !0,
		snapPageScrollToTransparentNavbar: !0
	} },
	on: {
		"panelBreakpoint panelCollapsedBreakpoint panelResize viewResize resize viewMasterDetailBreakpoint": function() {
			let e = this;
			W(".navbar").each((t) => {
				e.navbar.size(t);
			});
		},
		pageBeforeRemove(e) {
			e.$el[0].f7DetachNavbarScrollHandlers && e.$el[0].f7DetachNavbarScrollHandlers();
		},
		pageBeforeIn(e) {
			let t = this;
			if (t.theme !== "ios") return;
			let n, r = e.$el.parents(".view")[0].f7View, i = t.navbar.getElByPage(e);
			if (n = i ? W(i).parents(".navbars") : e.$el.parents(".view").children(".navbars"), e.$el.hasClass("no-navbar") || r.router.dynamicNavbar && !i) {
				let r = !!(e.pageFrom && e.router.history.length > 0);
				t.navbar.hide(n, r);
			} else t.navbar.show(n);
		},
		pageReinit(e) {
			let t = this, n = W(t.navbar.getElByPage(e));
			!n || n.length === 0 || t.navbar.size(n);
		},
		pageInit(e) {
			let t = this, n = W(t.navbar.getElByPage(e));
			if (!n || n.length === 0) return;
			t.navbar.size(n);
			let r;
			n.find(".title-large").length > 0 && n.addClass("navbar-large"), n.hasClass("navbar-large") && (t.params.navbar.collapseLargeTitleOnScroll && (r = !0), e.$el.addClass("page-with-navbar-large"));
			let i;
			!r && n.hasClass("navbar-transparent") && (i = !0);
			let a;
			(t.params.navbar.hideOnPageScroll || e.$el.find(".hide-navbar-on-scroll").length || e.$el.hasClass("hide-navbar-on-scroll") || e.$el.find(".hide-bars-on-scroll").length || e.$el.hasClass("hide-bars-on-scroll")) && (a = !(e.$el.find(".keep-navbar-on-scroll").length || e.$el.hasClass("keep-navbar-on-scroll") || e.$el.find(".keep-bars-on-scroll").length || e.$el.hasClass("keep-bars-on-scroll"))), (r || a || i) && t.navbar.initNavbarOnScroll(e.el, n[0], a, r, i);
		},
		"panelOpen panelSwipeOpen modalOpen": function(e) {
			let t = this;
			e.$el.find(".navbar:not(.navbar-previous)").each((e) => {
				t.navbar.size(e);
			});
		},
		tabShow(e) {
			let t = this;
			W(e).find(".navbar:not(.navbar-previous)").each((e) => {
				t.navbar.size(e);
			});
		}
	},
	clicks: { ".navbar .title": function(e, t, n) {
		if (!this.params.navbar.scrollTopOnTitleClick || W(n.target).closest("a, button").length > 0) return;
		let r, i = e.parents(".navbar"), a = i.parents(".navbars");
		r = i.parents(".page-content"), r.length === 0 && (i.parents(".page").length > 0 && (r = i.parents(".page").find(".page-content")), r.length === 0 && a.length && a.nextAll(".page-current").length > 0 && (r = a.nextAll(".page-current").find(".page-content")), r.length === 0 && i.nextAll(".page-current").length > 0 && (r = i.nextAll(".page-current").find(".page-content"))), r && r.length > 0 && (r.hasClass("tab") && (r = r.parent(".tabs").children(".page-content.tab-active")), r.length > 0 && r.scrollTop(0, 300));
	} },
	vnode: { navbar: { postpatch(e) {
		this.navbar.size(e.elm);
	} } }
}, bs = {
	setHighlight(e) {
		let t = this, n = W(e);
		if (t.theme === "ios" && !n.hasClass("tabbar-highlight") || n.length === 0 || !(n.hasClass("tabbar") || n.hasClass("tabbar-icons"))) return;
		let r = n.find(".tab-link-highlight"), i = n.find(".tab-link").length;
		if (i === 0) {
			r.remove();
			return;
		}
		r.length === 0 ? (n.children(".toolbar-inner").append("<span class=\"tab-link-highlight\"></span>"), r = n.find(".tab-link-highlight")) : r.next().length && n.children(".toolbar-inner").append(r);
		let a = n.find(".tab-link-active"), o, s;
		if (n.hasClass("tabbar-scrollable") && a && a[0]) o = `${a[0].offsetWidth}px`, s = `${a[0].offsetLeft}px`;
		else {
			let e = a.index();
			o = `${100 / i}%`, s = `${(t.rtl ? -e : e) * 100}%`;
		}
		Wa(() => {
			r.css("width", o).transform(`translate3d(${s},0,0)`);
		});
	},
	init(e) {
		this.toolbar.setHighlight(e);
	},
	hide(e, t) {
		t === void 0 && (t = !0);
		let n = this, r = W(e);
		if (r.hasClass("toolbar-hidden")) return;
		let i = `toolbar-hidden${t ? " toolbar-transitioning" : ""}`;
		r.transitionEnd(() => {
			r.removeClass("toolbar-transitioning");
		}), r.addClass(i), r.trigger("toolbar:hide"), n.emit("toolbarHide", r[0]);
	},
	show(e, t) {
		t === void 0 && (t = !0);
		let n = this, r = W(e);
		r.hasClass("toolbar-hidden") && (t && (r.addClass("toolbar-transitioning"), r.transitionEnd(() => {
			r.removeClass("toolbar-transitioning");
		})), r.removeClass("toolbar-hidden"), r.trigger("toolbar:show"), n.emit("toolbarShow", r[0]));
	},
	initToolbarOnScroll(e) {
		let t = this, n = W(e), r = n.parents(".view").children(".toolbar");
		if (r.length === 0 && (r = n.find(".toolbar")), r.length === 0 && (r = n.parents(".views").children(".tabbar, .tabbar-icons")), r.length === 0) return;
		let i, a, o, s, c, l, u;
		function d(e) {
			if (n.hasClass("page-with-card-opened") || n.hasClass("page-previous")) return;
			let d = this;
			e && e.target && e.target !== d || (a = d.scrollTop, o = d.scrollHeight, s = d.offsetHeight, c = a + s >= o, u = r.hasClass("toolbar-hidden"), c ? t.params.toolbar.showOnPageScrollEnd && (l = "show") : l = i > a ? t.params.toolbar.showOnPageScrollTop || a <= 44 ? "show" : "hide" : a > 44 ? "hide" : "show", l === "show" && u ? (t.toolbar.show(r), u = !1) : l === "hide" && !u && (t.toolbar.hide(r), u = !0), i = a);
		}
		n.on("scroll", ".page-content", d, !0), n[0].f7ScrollToolbarHandler = d;
	}
}, xs = {
	name: "toolbar",
	create() {
		ao(this, { toolbar: bs });
	},
	params: { toolbar: {
		hideOnPageScroll: !1,
		showOnPageScrollEnd: !0,
		showOnPageScrollTop: !0
	} },
	on: {
		pageBeforeRemove(e) {
			e.$el[0].f7ScrollToolbarHandler && e.$el.off("scroll", ".page-content", e.$el[0].f7ScrollToolbarHandler, !0);
		},
		pageBeforeIn(e) {
			let t = this, n = e.$el.parents(".view").children(".toolbar");
			n.length === 0 && (n = e.$el.parents(".views").children(".tabbar, .tabbar-icons")), n.length === 0 && (n = e.$el.find(".toolbar")), n.length !== 0 && (e.$el.hasClass("no-toolbar") ? t.toolbar.hide(n) : t.toolbar.show(n));
		},
		pageInit(e) {
			let t = this;
			if (e.$el.find(".tabbar, .tabbar-icons").each((e) => {
				t.toolbar.init(e);
			}), t.params.toolbar.hideOnPageScroll || e.$el.find(".hide-toolbar-on-scroll").length || e.$el.hasClass("hide-toolbar-on-scroll") || e.$el.find(".hide-bars-on-scroll").length || e.$el.hasClass("hide-bars-on-scroll")) {
				if (e.$el.find(".keep-toolbar-on-scroll").length || e.$el.hasClass("keep-toolbar-on-scroll") || e.$el.find(".keep-bars-on-scroll").length || e.$el.hasClass("keep-bars-on-scroll")) return;
				t.toolbar.initToolbarOnScroll(e.el);
			}
		},
		init() {
			let e = this;
			e.$el.find(".tabbar, .tabbar-icons").each((t) => {
				e.toolbar.init(t);
			});
		}
	},
	vnode: { tabbar: { insert(e) {
		this.toolbar.init(e.elm);
	} } }
}, Ss = {
	name: "subnavbar",
	on: { pageInit(e) {
		e.$navbarEl && e.$navbarEl.length && e.$navbarEl.find(".subnavbar").length && e.$el.addClass("page-with-subnavbar"), e.$el.find(".subnavbar").filter((t) => W(t).parents(".page")[0] === e.$el[0]).length && e.$el.addClass("page-with-subnavbar");
	} }
}, Cs = class {
	constructor(e, t, n, r) {
		let i = this;
		if (!t) return;
		let { left: a, top: o, width: s, height: c } = t[0].getBoundingClientRect(), l = {
			x: n - a,
			y: r - o
		}, u = Math.max((c ** 2 + s ** 2) ** .5, 48), d = !1, f = e.params.touch.touchRippleInsetElements || "";
		if (f && t.is(f) && (d = !0), d && (u = Math.max(Math.min(s, c), 48)), !d && t.css("overflow") === "hidden") {
			let e = ((l.x - s / 2) ** 2 + (l.y - c / 2) ** 2) ** .5;
			i.rippleTransform = `translate3d(0px, 0px, 0) scale(${(u / 2 + e) / (u / 2) * 2})`;
		} else i.rippleTransform = `translate3d(${-l.x + s / 2}px, ${-l.y + c / 2}px, 0) scale(1)`;
		return d && t.addClass("ripple-inset"), i.$rippleWaveEl = W(`<div class="ripple-wave${d ? " ripple-wave-inset" : ""}" style="width: ${u}px; height: ${u}px; margin-top:-${u / 2}px; margin-left:-${u / 2}px; left:${l.x}px; top:${l.y}px; --f7-ripple-transform: ${i.rippleTransform}"></div>`), t.prepend(i.$rippleWaveEl), i.$rippleWaveEl.animationEnd(() => {
			i.$rippleWaveEl && (i.$rippleWaveEl.hasClass("ripple-wave-out") || (i.$rippleWaveEl.addClass("ripple-wave-in"), i.shouldBeRemoved && i.out()));
		}), i;
	}
	destroy() {
		let e = this;
		e.$rippleWaveEl && e.$rippleWaveEl.remove(), Object.keys(e).forEach((t) => {
			e[t] = null, delete e[t];
		}), e = null;
	}
	out() {
		let e = this, { $rippleWaveEl: t } = this;
		clearTimeout(e.removeTimeout), t.addClass("ripple-wave-out"), e.removeTimeout = setTimeout(() => {
			e.destroy();
		}, 300), t.animationEnd(() => {
			clearTimeout(e.removeTimeout), e.destroy();
		});
	}
	remove() {
		let e = this;
		e.shouldBeRemoved || (e.removeTimeout = setTimeout(() => {
			e.destroy();
		}, 400), e.shouldBeRemoved = !0, e.$rippleWaveEl.hasClass("ripple-wave-in") && e.out());
	}
}, ws = {
	name: "touch-ripple",
	static: { TouchRipple: Cs },
	create() {
		let e = this;
		e.touchRipple = { create() {
			return new Cs(...arguments);
		} };
	}
}, Ts = [], Es = [];
function Ds() {
	Es.length !== 0 && Es.shift().open();
}
var Os = class extends Z {
	constructor(e, t) {
		super(t, [e]);
		let n = this, r = {};
		n.useModulesParams(r), n.params = J(r, t), n.opened = !1;
		let i = n.params.containerEl ? W(n.params.containerEl).eq(0) : e.$el;
		return i.length || (i = e.$el), n.$containerEl = i, n.containerEl = i[0], n.useModules(), this;
	}
	onOpen() {
		let e = this;
		e.opened = !0, Ts.push(e), W("html").addClass(`with-modal-${e.type.toLowerCase()}`), e.$el.trigger(`modal:open ${e.type.toLowerCase()}:open`), e.emit(`local::open modalOpen ${e.type}Open`, e);
	}
	onOpened() {
		let e = this;
		e.$el.trigger(`modal:opened ${e.type.toLowerCase()}:opened`), e.emit(`local::opened modalOpened ${e.type}Opened`, e);
	}
	onClose() {
		let e = this;
		e.opened = !1, !(!e.type || !e.$el) && (Ts.splice(Ts.indexOf(e), 1), W("html").removeClass(`with-modal-${e.type.toLowerCase()}`), e.$el.trigger(`modal:close ${e.type.toLowerCase()}:close`), e.emit(`local::close modalClose ${e.type}Close`, e));
	}
	onClosed() {
		let e = this;
		!e.type || !e.$el || (e.$el.removeClass("modal-out"), e.$el.hide(), e.params.backdrop && (e.params.backdropUnique || e.forceBackdropUnique) && e.$backdropEl && e.$backdropEl.remove(), e.$el.trigger(`modal:closed ${e.type.toLowerCase()}:closed`), e.emit(`local::closed modalClosed ${e.type}Closed`, e));
	}
	open(e, t) {
		let n = this, r = V(), i = n.app, a = n.$el, o = n.$backdropEl, s = n.type, c = !0;
		if (e === void 0 ? n.params.animate !== void 0 && (c = n.params.animate) : c = e, (!a || a.hasClass("modal-in")) && (e === !1 && a[0] && s !== "dialog" && (a[0].style.display = "block"), !t)) return n;
		if (s === "dialog" && i.params.modal.queueDialogs) {
			let e;
			if (W(".dialog.modal-in").length > 0 ? e = !0 : Ts.length > 0 && Ts.forEach((t) => {
				t.type === "dialog" && (e = !0);
			}), e) return Es.push(n), n;
		}
		let l = a.parent(), u = a.parents(r).length > 0;
		l.is(n.$containerEl) || (n.$containerEl.append(a), n.once(`${s}Closed`, () => {
			u ? l.append(a) : a.remove();
		})), a.show(), n.params.backdrop && (n.params.backdropUnique || n.forceBackdropUnique) && n.$backdropEl && n.$backdropEl.insertBefore(a), n._clientLeft = a[0].clientLeft;
		function d() {
			a.hasClass("modal-out") ? n.onClosed() : a.hasClass("modal-in") && n.onOpened();
		}
		return c ? (o && (o.removeClass("not-animated"), o.addClass("backdrop-in")), a.animationEnd(() => {
			d();
		}), a.transitionEnd(() => {
			d();
		}), a.removeClass("modal-out not-animated").addClass("modal-in"), n.onOpen()) : (o && o.addClass("backdrop-in not-animated"), a.removeClass("modal-out").addClass("modal-in not-animated"), n.onOpen(), n.onOpened()), n;
	}
	close(e) {
		let t = this, n = t.$el, r = t.$backdropEl, i = !0;
		if (e === void 0 ? t.params.animate !== void 0 && (i = t.params.animate) : i = e, !n || !n.hasClass("modal-in")) return Es.indexOf(t) >= 0 && Es.splice(Es.indexOf(t), 1), t;
		if (r) {
			let e = !0;
			t.type === "popup" && t.$el.prevAll(".popup.modal-in").add(t.$el.nextAll(".popup.modal-in")).each((n) => {
				let r = n.f7Modal;
				r && r.params.closeByBackdropClick && r.params.backdrop && r.backdropEl === t.backdropEl && (e = !1);
			}), e && (r[i ? "removeClass" : "addClass"]("not-animated"), r.removeClass("backdrop-in"));
		}
		n[i ? "removeClass" : "addClass"]("not-animated");
		function a() {
			n.hasClass("modal-out") ? t.onClosed() : n.hasClass("modal-in") && t.onOpened();
		}
		return i ? (n.animationEnd(() => {
			a();
		}), n.transitionEnd(() => {
			a();
		}), n.removeClass("modal-in").addClass("modal-out"), t.onClose()) : (n.addClass("not-animated").removeClass("modal-in").addClass("modal-out"), t.onClose(), t.onClosed()), t.type === "dialog" && Ds(), t;
	}
	destroy() {
		let e = this;
		e.destroyed ||= (e.emit(`local::beforeDestroy modalBeforeDestroy ${e.type}BeforeDestroy`, e), e.$el && (e.$el.trigger(`modal:beforedestroy ${e.type.toLowerCase()}:beforedestroy`), e.$el.length && e.$el[0].f7Modal && delete e.$el[0].f7Modal), Ba(e), !0);
	}
}, ks = class extends Os {
	constructor(e, t) {
		let n = J({
			backdrop: !0,
			closeByBackdropClick: !0,
			on: {}
		}, t);
		super(e, n);
		let r = this;
		r.params = n;
		let i;
		if (i = r.params.el ? W(r.params.el) : W(r.params.content), i && i.length > 0 && i[0].f7Modal) return i[0].f7Modal;
		if (i.length === 0) return r.destroy();
		let a;
		r.params.backdrop && (a = e.$el.children(".custom-modal-backdrop"), a.length === 0 && (a = W("<div class=\"custom-modal-backdrop\"></div>"), e.$el.append(a)));
		function o(e) {
			!r || r.destroyed || a && e.target === a[0] && r.close();
		}
		return r.on("customModalOpened", () => {
			r.params.closeByBackdropClick && r.params.backdrop && e.on("click", o);
		}), r.on("customModalClose", () => {
			r.params.closeByBackdropClick && r.params.backdrop && e.off("click", o);
		}), J(r, {
			app: e,
			$el: i,
			el: i[0],
			$backdropEl: a,
			backdropEl: a && a[0],
			type: "customModal"
		}), i[0].f7Modal = r, r;
	}
}, As = {
	name: "modal",
	static: {
		Modal: Os,
		CustomModal: ks
	},
	create() {
		let e = this;
		e.customModal = { create(t) {
			return new ks(e, t);
		} };
	},
	params: { modal: { queueDialogs: !0 } }
}, js = class extends Os {
	constructor(e, t) {
		let n = J({
			title: e.params.dialog.title,
			text: void 0,
			content: "",
			buttons: [],
			verticalButtons: !1,
			onClick: void 0,
			cssClass: void 0,
			destroyOnClose: !1,
			on: {}
		}, t);
		n.closeByBackdropClick === void 0 && (n.closeByBackdropClick = e.params.dialog.closeByBackdropClick), n.backdrop === void 0 && (n.backdrop = e.params.dialog.backdrop), super(e, n);
		let r = this, i = X(), a = V(), { title: o, text: s, content: c, buttons: l, verticalButtons: u, cssClass: d, backdrop: f } = n;
		r.params = n;
		let p;
		if (r.params.el) p = W(r.params.el);
		else {
			let e = ["dialog"];
			l.length === 0 && e.push("dialog-no-buttons"), l.length > 0 && e.push(`dialog-buttons-${l.length}`), u && e.push("dialog-buttons-vertical"), d && e.push(d);
			let t = "";
			l.length > 0 && (t = Q("div", { class: "dialog-buttons" }, l.map((e) => Q("span", { class: `dialog-button${e.strong ? " dialog-button-strong" : ""}${e.color ? ` color-${e.color}` : ""}${e.cssClass ? ` ${e.cssClass}` : ""}` }, e.text)))), p = W(Q("div", { class: e.join(" ") }, Q("div", { class: "dialog-inner" }, o && Q("div", { class: "dialog-title" }, o), s && Q("div", { class: "dialog-text" }, s), c), t));
		}
		if (p && p.length > 0 && p[0].f7Modal) return p[0].f7Modal;
		if (p.length === 0) return r.destroy();
		let m;
		f && (m = e.$el.children(".dialog-backdrop"), m.length === 0 && (m = W("<div class=\"dialog-backdrop\"></div>"), e.$el.append(m)));
		function h(e) {
			let t = W(this).index(), n = l[t];
			n.onClick && n.onClick(r, e), r.params.onClick && r.params.onClick(r, t), n.close !== !1 && r.close();
		}
		let g;
		function _(e) {
			let t = e.keyCode;
			l.forEach((n, i) => {
				n.keyCodes && n.keyCodes.indexOf(t) >= 0 && (a.activeElement && a.activeElement.blur(), n.onClick && n.onClick(r, e), r.params.onClick && r.params.onClick(r, i), n.close !== !1 && r.close());
			});
		}
		l && l.length > 0 && (r.on("open", () => {
			p.find(".dialog-button").each((e, t) => {
				l[t].keyCodes && (g = !0), W(e).on("click", h);
			}), g && !i.ios && !i.android && !i.cordova && !i.capacitor && W(a).on("keydown", _);
		}), r.on("close", () => {
			p.find(".dialog-button").each((e) => {
				W(e).off("click", h);
			}), g && !i.ios && !i.android && !i.cordova && !i.capacitor && W(a).off("keydown", _), g = !1;
		})), J(r, {
			app: e,
			$el: p,
			el: p[0],
			$backdropEl: m,
			backdropEl: m && m[0],
			type: "dialog",
			setProgress(t, n) {
				return e.progressbar.set(p.find(".progressbar"), t, n), r;
			},
			setText(e) {
				let t = p.find(".dialog-text");
				return t.length === 0 && (t = W("<div class=\"dialog-text\"></div>"), o === void 0 ? p.find(".dialog-inner").prepend(t) : t.insertAfter(p.find(".dialog-title"))), t.html(e), r.params.text = e, r;
			},
			setTitle(e) {
				let t = p.find(".dialog-title");
				return t.length === 0 && (t = W("<div class=\"dialog-title\"></div>"), p.find(".dialog-inner").prepend(t)), t.html(e), r.params.title = e, r;
			}
		});
		function v(e) {
			let t = e.target;
			W(t).closest(r.el).length === 0 && r.params.closeByBackdropClick && r.backdropEl && r.backdropEl === t && r.close();
		}
		return r.on("opened", () => {
			r.params.closeByBackdropClick && e.on("click", v);
		}), r.on("close", () => {
			r.params.closeByBackdropClick && e.off("click", v);
		}), p[0].f7Modal = r, r.params.destroyOnClose && r.once("closed", () => {
			setTimeout(() => {
				r.destroy();
			}, 0);
		}), r;
	}
}, Ms = {
	name: "dialog",
	params: { dialog: {
		title: void 0,
		buttonOk: "OK",
		buttonCancel: "Cancel",
		usernamePlaceholder: "Username",
		passwordPlaceholder: "Password",
		preloaderTitle: "Loading... ",
		progressTitle: "Loading... ",
		backdrop: !0,
		closeByBackdropClick: !1,
		destroyPredefinedDialogs: !0,
		keyboardActions: !0,
		autoFocus: !0
	} },
	static: { Dialog: js },
	create() {
		let e = this;
		function t() {
			return e.params.dialog.title || e.name;
		}
		let n = e.params.dialog.destroyPredefinedDialogs, r = e.params.dialog.keyboardActions, i = e.params.dialog.autoFocus ? { on: { opened(e) {
			e.$el.find("input").eq(0).focus();
		} } } : {}, a = e.theme === "ios";
		e.dialog = J(go({
			app: e,
			constructor: js,
			defaultSelector: ".dialog.modal-in"
		}), {
			alert() {
				var i = [...arguments];
				let [o, s, c] = i;
				return i.length === 2 && typeof i[1] == "function" && ([o, c, s] = i), new js(e, {
					title: s === void 0 ? t() : s,
					text: o,
					buttons: [{
						text: e.params.dialog.buttonOk,
						strong: a,
						onClick: c,
						keyCodes: r ? [13, 27] : null
					}],
					destroyOnClose: n
				}).open();
			},
			prompt() {
				var o = [...arguments];
				let [s, c, l, u, d] = o;
				return typeof o[1] == "function" && ([s, l, u, d, c] = o), d ??= "", new js(e, {
					title: c === void 0 ? t() : c,
					text: s,
					content: `<div class="dialog-input-field input"><input type="text" class="dialog-input" value="${d}"></div>`,
					buttons: [{
						text: e.params.dialog.buttonCancel,
						keyCodes: r ? [27] : null,
						color: null
					}, {
						text: e.params.dialog.buttonOk,
						strong: a,
						keyCodes: r ? [13] : null
					}],
					onClick(e, t) {
						let n = e.$el.find(".dialog-input").val();
						t === 0 && u && u(n), t === 1 && l && l(n);
					},
					destroyOnClose: n,
					...i
				}).open();
			},
			confirm() {
				var i = [...arguments];
				let [o, s, c, l] = i;
				return typeof i[1] == "function" && ([o, c, l, s] = i), new js(e, {
					title: s === void 0 ? t() : s,
					text: o,
					buttons: [{
						text: e.params.dialog.buttonCancel,
						onClick: l,
						keyCodes: r ? [27] : null,
						color: null
					}, {
						text: e.params.dialog.buttonOk,
						strong: a,
						onClick: c,
						keyCodes: r ? [13] : null
					}],
					destroyOnClose: n
				}).open();
			},
			login() {
				var o = [...arguments];
				let [s, c, l, u] = o;
				return typeof o[1] == "function" && ([s, l, u, c] = o), new js(e, {
					title: c === void 0 ? t() : c,
					text: s,
					content: `
              <div class="dialog-input-field dialog-input-double input">
                <input type="text" name="dialog-username" placeholder="${e.params.dialog.usernamePlaceholder}" class="dialog-input">
              </div>
              <div class="dialog-input-field dialog-input-double input">
                <input type="password" name="dialog-password" placeholder="${e.params.dialog.passwordPlaceholder}" class="dialog-input">
              </div>`,
					buttons: [{
						text: e.params.dialog.buttonCancel,
						keyCodes: r ? [27] : null,
						color: null
					}, {
						text: e.params.dialog.buttonOk,
						strong: a,
						keyCodes: r ? [13] : null
					}],
					onClick(e, t) {
						let n = e.$el.find("[name=\"dialog-username\"]").val(), r = e.$el.find("[name=\"dialog-password\"]").val();
						t === 0 && u && u(n, r), t === 1 && l && l(n, r);
					},
					destroyOnClose: n,
					...i
				}).open();
			},
			password() {
				var o = [...arguments];
				let [s, c, l, u] = o;
				return typeof o[1] == "function" && ([s, l, u, c] = o), new js(e, {
					title: c === void 0 ? t() : c,
					text: s,
					content: `
              <div class="dialog-input-field input">
                <input type="password" name="dialog-password" placeholder="${e.params.dialog.passwordPlaceholder}" class="dialog-input">
              </div>`,
					buttons: [{
						text: e.params.dialog.buttonCancel,
						keyCodes: r ? [27] : null,
						color: null
					}, {
						text: e.params.dialog.buttonOk,
						strong: a,
						keyCodes: r ? [13] : null
					}],
					onClick(e, t) {
						let n = e.$el.find("[name=\"dialog-password\"]").val();
						t === 0 && u && u(n), t === 1 && l && l(n);
					},
					destroyOnClose: n,
					...i
				}).open();
			},
			preloader(t, r) {
				let i = {
					iosPreloaderContent: Ra,
					mdPreloaderContent: La
				}[`${e.theme}PreloaderContent`] || "";
				return new js(e, {
					title: t ?? e.params.dialog.preloaderTitle,
					content: `<div class="preloader${r ? ` color-${r}` : ""}">${i}</div>`,
					cssClass: "dialog-preloader",
					destroyOnClose: n
				}).open();
			},
			progress() {
				var t = [...arguments];
				let [r, i, a] = t;
				t.length === 2 ? typeof t[0] == "number" ? [i, a, r] = t : typeof t[0] == "string" && typeof t[1] == "string" && ([r, a, i] = t) : t.length === 1 && typeof t[0] == "number" && ([i, r, a] = t);
				let o = i === void 0, s = new js(e, {
					title: r === void 0 ? e.params.dialog.progressTitle : r,
					cssClass: "dialog-progress",
					content: `
              <div class="progressbar${o ? "-infinite" : ""}${a ? ` color-${a}` : ""}">
                ${o ? "" : "<span></span>"}
              </div>
            `,
					destroyOnClose: n
				});
				return o || s.setProgress(i), s.open();
			}
		});
	}
}, Ns = class extends Os {
	constructor(e, t) {
		let n = J({ on: {} }, e.params.popup, t);
		super(e, n);
		let r = this, i = H(), a = V(), o = Y(), s = X();
		r.params = n;
		let c;
		if (c = r.params.el ? W(r.params.el).eq(0) : W(r.params.content).filter((e) => e.nodeType === 1).eq(0), c && c.length > 0 && c[0].f7Modal) return c[0].f7Modal;
		if (c.length === 0) return r.destroy();
		let l;
		r.params.backdrop && r.params.backdropEl ? l = W(r.params.backdropEl) : r.params.backdrop && (r.params.backdropUnique ? (l = W("<div class=\"popup-backdrop popup-backdrop-unique\"></div>"), r.$containerEl.append(l)) : l = r.$containerEl.children(".popup-backdrop"), l.length === 0 && (l = W("<div class=\"popup-backdrop\"></div>"), r.$containerEl.append(l))), J(r, {
			app: e,
			push: c.hasClass("popup-push") || r.params.push,
			$el: c,
			el: c[0],
			$backdropEl: l,
			backdropEl: l && l[0],
			type: "popup",
			$htmlEl: W("html")
		}), r.params.push && c.addClass("popup-push");
		function u(e) {
			let t = e.target, n = W(t);
			if (!(!s.desktop && s.cordova && (i.Keyboard && i.Keyboard.isVisible || i.cordova.plugins && i.cordova.plugins.Keyboard && i.cordova.plugins.Keyboard.isVisible)) && n.closest(r.el).length === 0 && r.params && r.params.closeByBackdropClick && r.params.backdrop && r.backdropEl && r.backdropEl === t) {
				let e = !0;
				r.$el.nextAll(".popup.modal-in").each((t) => {
					let n = t.f7Modal;
					n && n.params.closeByBackdropClick && n.params.backdrop && n.backdropEl === r.backdropEl && (e = !1);
				}), e && r.close();
			}
		}
		function d(e) {
			e.keyCode === 27 && r.params.closeOnEscape && r.close();
		}
		let f, p;
		function m(t) {
			return (e.height - t * 2) / e.height;
		}
		let h = !0, g = !1, _, v, y, b, x, S = !1, C, w, T, E, D, O;
		function k(e) {
			g || !h || !r.params.swipeToClose || !e.isTrusted || r.params.swipeHandler && W(e.target).closest(r.params.swipeHandler).length === 0 || W(e.target).closest(".sortable-handler").length > 0 || (g = !0, S = !1, _ = {
				x: e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX,
				y: e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY
			}, b = Ga(), y = void 0, !r.params.swipeHandler && e.type === "touchstart" && (C = W(e.target).closest(".page-content")[0]));
		}
		function A(t) {
			if (!g || !t.isTrusted) return;
			if (v = {
				x: t.type === "touchmove" ? t.targetTouches[0].pageX : t.pageX,
				y: t.type === "touchmove" ? t.targetTouches[0].pageY : t.pageY
			}, y === void 0 && (y = !!(y || Math.abs(v.x - _.x) > Math.abs(v.y - _.y))), y) {
				g = !1, S = !1;
				return;
			}
			x = _.y - v.y, p && f && x > 0 && (x = 0);
			let n = x < 0 ? "to-bottom" : "to-top";
			if (c.transition(0), typeof r.params.swipeToClose == "string" && n !== r.params.swipeToClose) {
				c.transform(""), c.transition("");
				return;
			}
			if (S) r.emit("local::swipeMove popupSwipeMove", r), r.$el.trigger("popup:swipemove");
			else {
				if (p && f && (D = c[0].offsetHeight, O = c.prevAll(".popup.modal-in").eq(0), O.length === 0 && (O = e.$el.children(".view, .views"))), C && (w = C.scrollTop, E = C.scrollHeight, T = C.offsetHeight, E !== T && !(n === "to-bottom" && w === 0) && !(n === "to-top" && w === E - T))) {
					c.transform(""), c.transition(""), g = !1, S = !1;
					return;
				}
				S = !0, r.emit("local::swipeStart popupSwipeStart", r), r.$el.trigger("popup:swipestart");
			}
			if (t.preventDefault(), p && f) {
				let e = 1 - Math.abs(x / D), t = 1 - (1 - m(f)) * e;
				O.hasClass("popup") ? O.hasClass("popup-push") ? O.transition(0).forEach((n) => {
					n.style.setProperty("transform", `translate3d(0, calc(-1 * ${e} * (var(--f7-popup-push-offset) + 10px)) , 0px) scale(${t})`, "important");
				}) : O.transition(0).forEach((e) => {
					e.style.setProperty("transform", `translate3d(0, 0px , 0px) scale(${t})`, "important");
				}) : O.transition(0).forEach((e) => {
					e.style.setProperty("transform", `translate3d(0,0,0) scale(${t})`, "important");
				});
			}
			c.transition(0).transform(`translate3d(0,${-x}px,0)`);
		}
		function j(e) {
			if (!e.isTrusted || (g = !1, !S)) return;
			r.emit("local::swipeEnd popupSwipeEnd", r), r.$el.trigger("popup:swipeend"), S = !1, h = !1, c.transition(""), p && f && O.transition("").transform("");
			let t = x <= 0 ? "to-bottom" : "to-top";
			if (typeof r.params.swipeToClose == "string" && t !== r.params.swipeToClose) {
				c.transform(""), h = !0;
				return;
			}
			let n = Math.abs(x), i = (/* @__PURE__ */ new Date()).getTime() - b;
			if (i < 300 && n > 20 || i >= 300 && n > 100) {
				Ua(() => {
					t === "to-bottom" ? c.addClass("swipe-close-to-bottom") : c.addClass("swipe-close-to-top"), c.transform(""), r.emit("local::swipeclose popupSwipeClose", r), r.$el.trigger("popup:swipeclose"), r.close(), h = !0;
				});
				return;
			}
			h = !0, c.transform("");
		}
		let M = o.passiveListener ? { passive: !0 } : !1;
		r.params.swipeToClose && (c.on(e.touchEvents.start, k, M), e.on("touchmove", A), e.on("touchend:passive", j), r.once("popupDestroy", () => {
			c.off(e.touchEvents.start, k, M), e.off("touchmove", A), e.off("touchend:passive", j);
		}));
		let N, P = () => {
			let t = p;
			r.push && (p = r.push && (e.width < 630 || e.height < 630 || c.hasClass("popup-tablet-fullscreen"))), p && !t ? F() : p && t ? r.$htmlEl[0].style.setProperty("--f7-popup-push-scale", m(f)) : !p && t && (r.$htmlEl.removeClass("with-modal-popup-push"), r.$htmlEl[0].style.removeProperty("--f7-popup-push-scale"));
		}, F = () => {
			e.off("resize", P), r.push && (p = r.push && (e.width < 630 || e.height < 630 || c.hasClass("popup-tablet-fullscreen"))), p && (f = parseInt(c.css("--f7-popup-push-offset"), 10), Number.isNaN(f) && (f = 0), f ||= e.theme === "ios" ? 44 : 48, r.$htmlEl[0].style.setProperty("--f7-popup-push-offset", `${f}px`), c.addClass("popup-push"), r.$htmlEl.addClass("with-modal-popup-push"), r.$htmlEl[0].style.setProperty("--f7-popup-push-scale", m(f))), e.on("resize", P);
		};
		return r.on("open", () => {
			N = !1, r.params.closeOnEscape && W(a).on("keydown", d), c.prevAll(".popup.modal-in").addClass("popup-behind"), F();
		}), r.on("opened", () => {
			c.removeClass("swipe-close-to-bottom swipe-close-to-top"), r.params.closeByBackdropClick && e.on("click", u);
		}), r.on("close", () => {
			N = r.$el.prevAll(".popup-push.modal-in").length > 0, r.params.closeOnEscape && W(a).off("keydown", d), r.params.closeByBackdropClick && e.off("click", u), c.prevAll(".popup.modal-in").eq(0).removeClass("popup-behind"), p && f && !N && (r.$htmlEl.removeClass("with-modal-popup-push"), r.$htmlEl.addClass("with-modal-popup-push-closing")), e.off("resize", P);
		}), r.on("closed", () => {
			c.removeClass("popup-behind"), p && f && !N && (r.$htmlEl.removeClass("with-modal-popup-push-closing"), r.$htmlEl[0].style.removeProperty("--f7-popup-push-scale"), r.$htmlEl[0].style.removeProperty("--f7-popup-push-offset"));
		}), c[0].f7Modal = r, r;
	}
}, Ps = {
	name: "popup",
	params: { popup: {
		backdrop: !0,
		backdropEl: void 0,
		backdropUnique: !1,
		closeByBackdropClick: !0,
		closeOnEscape: !1,
		swipeToClose: !1,
		swipeHandler: null,
		push: !1,
		containerEl: null
	} },
	static: { Popup: Ns },
	create() {
		let e = this;
		e.popup = go({
			app: e,
			constructor: Ns,
			defaultSelector: ".popup.modal-in",
			parentSelector: ".popup"
		});
	},
	clicks: {
		".popup-open": function(e, t) {
			t === void 0 && (t = {}), this.popup.open(t.popup, t.animate, e);
		},
		".popup-close": function(e, t) {
			t === void 0 && (t = {}), this.popup.close(t.popup, t.animate, e);
		}
	}
}, Fs = class extends Os {
	constructor(e, t) {
		let n = J({ on: {} }, t);
		super(e, n);
		let r = this;
		r.params = n;
		let i;
		return i = r.params.el ? W(r.params.el).eq(0) : W(r.params.content).filter((e) => e.nodeType === 1).eq(0), i && i.length > 0 && i[0].f7Modal ? i[0].f7Modal : i.length === 0 ? r.destroy() : (J(r, {
			app: e,
			$el: i,
			el: i[0],
			type: "loginScreen"
		}), i[0].f7Modal = r, r);
	}
}, Is = {
	name: "loginScreen",
	static: { LoginScreen: Fs },
	create() {
		let e = this;
		e.loginScreen = go({
			app: e,
			constructor: Fs,
			defaultSelector: ".login-screen.modal-in"
		});
	},
	clicks: {
		".login-screen-open": function(e, t) {
			t === void 0 && (t = {}), this.loginScreen.open(t.loginScreen, t.animate, e);
		},
		".login-screen-close": function(e, t) {
			t === void 0 && (t = {}), this.loginScreen.close(t.loginScreen, t.animate, e);
		}
	}
}, Ls = class extends Os {
	constructor(e, t) {
		let n = J({ on: {} }, e.params.popover, t);
		super(e, n);
		let r = this, i = X(), a = H(), o = V();
		r.params = n;
		let s;
		if (s = r.params.el ? W(r.params.el).eq(0) : W(r.params.content).filter((e) => e.nodeType === 1).eq(0), s && s.length > 0 && s[0].f7Modal) return s[0].f7Modal;
		let c = W(r.params.targetEl).eq(0);
		if (s.length === 0) return r.destroy();
		let l, u = r.params.backdrop && e.$el.find(".popover.modal-in").filter((e) => e !== s[0]).length > 0;
		r.params.backdrop && r.params.backdropEl ? l = W(r.params.backdropEl) : r.params.backdrop && (r.params.backdropUnique || u ? (l = W("<div class=\"popover-backdrop popover-backdrop-unique\"></div>"), l[0].f7PopoverRef = r, r.$containerEl.append(l)) : l = r.$containerEl.children(".popover-backdrop"), l.length === 0 && (l = W("<div class=\"popover-backdrop\"></div>"), r.$containerEl.append(l)));
		let d;
		s.find(".popover-arrow").length === 0 && r.params.arrow ? (d = W("<div class=\"popover-arrow\"></div>"), s.prepend(d)) : d = s.find(".popover-arrow");
		let f = r.open;
		J(r, {
			app: e,
			$el: s,
			el: s[0],
			$targetEl: c,
			targetEl: c[0],
			$arrowEl: d,
			arrowEl: d[0],
			$backdropEl: l,
			backdropEl: l && l[0],
			type: "popover",
			forceBackdropUnique: u,
			open() {
				var e = [...arguments];
				let [t, n] = e;
				return typeof e[0] == "boolean" && ([n, t] = e), t && (r.$targetEl = W(t), r.targetEl = r.$targetEl[0]), f.call(r, n);
			}
		});
		function p() {
			r.resize();
		}
		r.on("popoverOpen", () => {
			r.resize(), e.on("resize", p), W(a).on("keyboardDidShow keyboardDidHide", p), r.on("popoverClose popoverBeforeDestroy", () => {
				e.off("resize", p), W(a).off("keyboardDidShow keyboardDidHide", p);
			});
		});
		let m = null;
		function h(e) {
			m = e.target;
		}
		function g(e) {
			let t = e.target, n = W(t);
			if (!(!i.desktop && i.cordova && (a.Keyboard && a.Keyboard.isVisible || a.cordova.plugins && a.cordova.plugins.Keyboard && a.cordova.plugins.Keyboard.isVisible)) && n.closest(r.el).length === 0) {
				if (r.params.closeByBackdropClick && r.params.backdrop && r.backdropEl && r.backdropEl === t && m === t) r.close();
				else if (r.params.closeByOutsideClick && m === t) {
					let e = n.hasClass("popover-backdrop-unique") && t.f7PopoverRef !== r || n.hasClass("popover-backdrop") && t !== r.backdropEl, i = t.closest(".popover") && t.closest(".popover") !== r.$el[0];
					!e && !i && r.close();
				}
			}
		}
		function _(e) {
			e.keyCode === 27 && r.params.closeOnEscape && r.close();
		}
		return r.params.closeOnEscape && (r.on("popoverOpen", () => {
			W(o).on("keydown", _);
		}), r.on("popoverClose", () => {
			W(o).off("keydown", _);
		})), r.on("popoverOpened", () => {
			(r.params.closeByOutsideClick || r.params.closeByBackdropClick) && (e.on("touchstart", h), e.on("click", g));
		}), r.on("popoverClose", () => {
			(r.params.closeByOutsideClick || r.params.closeByBackdropClick) && (e.off("touchstart", h), e.off("click", g));
		}), s[0].f7Modal = r, r;
	}
	resize() {
		let e = this, { app: t, $el: n, $targetEl: r, $arrowEl: i } = e, { targetX: a, targetY: o, verticalPosition: s } = e.params;
		n.css({
			left: "",
			top: ""
		});
		let [c, l] = [n.width(), n.height()], u = 0, d, f, p = i.length > 0, m = t.theme === "ios" ? 13 : 24;
		p && (i.removeClass("on-left on-right on-top on-bottom").css({
			left: "",
			top: ""
		}), u = i.width() / 2), n.removeClass("popover-on-left popover-on-right popover-on-top popover-on-bottom popover-on-middle").css({
			left: "",
			top: ""
		});
		let h, g, _, v, y = parseInt(W("html").css("--f7-safe-area-top"), 10), b = parseInt(W("html").css("--f7-safe-area-left"), 10), x = parseInt(W("html").css("--f7-safe-area-right"), 10);
		if (Number.isNaN(y) && (y = 0), Number.isNaN(b) && (b = 0), Number.isNaN(x) && (x = 0), r && r.length > 0) {
			h = r.outerWidth(), g = r.outerHeight();
			let e = r.offset();
			_ = e.left - t.left, v = e.top - t.top;
			let n = r.parents(".page");
			n.length > 0 && (v -= n[0].scrollTop);
		} else a !== void 0 && o !== "undefined" && (_ = a, v = o, h = e.params.targetWidth || 0, g = e.params.targetHeight || 0);
		let [S, C, w] = [
			0,
			0,
			0
		], T = s === "auto" ? !1 : s, E = T || "top";
		T === "top" || !T && l + u < v - y ? C = v - l - u : T === "bottom" || !T && l + u < t.height - v - g ? (E = "bottom", C = v + g + u) : (E = "middle", C = g / 2 + v - l / 2, w = C, C = Math.max(5, Math.min(C, t.height - l - 5)), w -= C), E === "top" || E === "bottom" ? (S = h / 2 + _ - c / 2, w = S, S = Math.max(5, Math.min(S, t.width - c - 5)), b && (S = Math.max(S, b)), x && S + c > t.width - 5 - x && (S = t.width - 5 - x - c), w -= S, p && (E === "top" && i.addClass("on-bottom"), E === "bottom" && i.addClass("on-top"), d = c / 2 - u + w, d = Math.max(Math.min(d, c - u * 2 - m), m), i.css({ left: `${d}px` }))) : E === "middle" && (S = _ - c - u, p && i.addClass("on-right"), (S < 5 || S + c + x > t.width || S < b) && (S < 5 && (S = _ + h + u), S + c + x > t.width && (S = t.width - c - 5 - x), S < b && (S = b), p && i.removeClass("on-right").addClass("on-left")), p && (f = l / 2 - u + w, f = Math.max(Math.min(f, l - u * 2 - m), m), i.css({ top: `${f}px` })));
		let D;
		D = _ < t.width / 2 ? "right" : "left", n.addClass(`popover-on-${E} popover-on-${D}`), n.css({
			top: `${C}px`,
			left: `${S}px`
		});
	}
}, Rs = {
	name: "popover",
	params: { popover: {
		verticalPosition: "auto",
		arrow: !0,
		backdrop: !0,
		backdropEl: void 0,
		backdropUnique: !1,
		closeByBackdropClick: !0,
		closeByOutsideClick: !0,
		closeOnEscape: !1,
		containerEl: null
	} },
	static: { Popover: Ls },
	create() {
		let e = this;
		e.popover = J(go({
			app: e,
			constructor: Ls,
			defaultSelector: ".popover.modal-in"
		}), { open(t, n, r) {
			let i = W(t);
			if (i.length > 1) {
				let e = W(n).parents(".page");
				e.length && i.each((t) => {
					let n = W(t);
					n.parents(e)[0] === e[0] && (i = n);
				});
			}
			i.length > 1 && (i = i.eq(i.length - 1));
			let a = i[0].f7Modal, o = i.dataset();
			return a ||= new Ls(e, Object.assign({
				el: i,
				targetEl: n
			}, o)), a.open(n, r);
		} });
	},
	clicks: {
		".popover-open": function(e, t) {
			t === void 0 && (t = {}), this.popover.open(t.popover, e, t.animate);
		},
		".popover-close": function(e, t) {
			t === void 0 && (t = {}), this.popover.close(t.popover, t.animate, e);
		}
	}
}, zs = class extends Os {
	constructor(e, t) {
		let n = J({ on: {} }, e.params.actions, t);
		super(e, n);
		let r = this, i = X(), a = H(), o = V();
		r.params = n;
		let s;
		r.params.buttons && (s = r.params.buttons, Array.isArray(s[0]) || (s = [s])), r.groups = s;
		let c;
		if (r.params.el ? c = W(r.params.el).eq(0) : r.params.content ? c = W(r.params.content).filter((e) => e.nodeType === 1).eq(0) : r.params.buttons && (r.params.convertToPopover && (r.popoverHtml = r.renderPopover()), r.actionsHtml = r.render()), c && c.length > 0 && c[0].f7Modal) return c[0].f7Modal;
		if (c && c.length === 0 && !(r.actionsHtml || r.popoverHtml)) return r.destroy();
		let l;
		r.params.backdrop && r.params.backdropEl ? l = W(r.params.backdropEl) : r.params.backdrop && (r.params.backdropUnique ? (l = W("<div class=\"popup-backdrop popup-backdrop-unique\"></div>"), r.$containerEl.append(l)) : l = r.$containerEl.children(".actions-backdrop"), l.length === 0 && (l = W("<div class=\"actions-backdrop\"></div>"), r.$containerEl.append(l)));
		let u = r.open, d = r.close, f;
		function p(e) {
			let t = W(this), n, i;
			if (t.hasClass("list-button") || t.hasClass("item-link") ? (n = t.parents("li").index(), i = t.parents(".list").index()) : (n = t.index(), i = t.parents(".actions-group").index()), s !== void 0) {
				let t = s[i][n];
				t.onClick && t.onClick(r, e), r.params.onClick && r.params.onClick(r, e), t.close !== !1 && r.close();
			}
		}
		r.open = function(t) {
			let n = !1, { targetEl: a, targetX: o, targetY: s, targetWidth: c, targetHeight: l } = r.params;
			return r.params.convertToPopover && (a || o !== void 0 && s !== void 0) && (r.params.forceToPopover || i.ios && i.ipad || e.width >= 768 || i.desktop) && (n = !0), n && r.popoverHtml ? (f = e.popover.create({
				containerEl: r.params.containerEl,
				content: r.popoverHtml,
				backdrop: r.params.backdrop,
				targetEl: a,
				targetX: o,
				targetY: s,
				targetWidth: c,
				targetHeight: l,
				on: {
					open() {
						r.$el ||= f.$el, r.$el.trigger(`modal:open ${r.type.toLowerCase()}:open`), r.emit(`local::open modalOpen ${r.type}Open`, r);
					},
					opened() {
						r.$el ||= f.$el, r.$el.trigger(`modal:opened ${r.type.toLowerCase()}:opened`), r.emit(`local::opened modalOpened ${r.type}Opened`, r);
					},
					close() {
						r.$el ||= f.$el, r.$el.trigger(`modal:close ${r.type.toLowerCase()}:close`), r.emit(`local::close modalClose ${r.type}Close`, r);
					},
					closed() {
						r.$el ||= f.$el, r.$el.trigger(`modal:closed ${r.type.toLowerCase()}:closed`), r.emit(`local::closed modalClosed ${r.type}Closed`, r);
					}
				}
			}), f.open(t), f.once("popoverOpened", () => {
				f.$el.find(".list-button, .item-link").each((e) => {
					W(e).on("click", p);
				});
			}), f.once("popoverClosed", () => {
				f.$el.find(".list-button, .item-link").each((e) => {
					W(e).off("click", p);
				}), Ua(() => {
					f.destroy(), f = void 0;
				});
			})) : (r.$el = r.actionsHtml ? W(r.actionsHtml) : r.$el, r.$el[0].f7Modal = r, r.groups && (r.$el.find(".actions-button").each((e) => {
				W(e).on("click", p);
			}), r.once("actionsClosed", () => {
				r.$el.find(".actions-button").each((e) => {
					W(e).off("click", p);
				});
			})), r.el = r.$el[0], u.call(r, t)), r;
		}, r.close = function(e) {
			return f ? f.close(e) : d.call(r, e), r;
		}, J(r, {
			app: e,
			$el: c,
			el: c ? c[0] : void 0,
			$backdropEl: l,
			backdropEl: l && l[0],
			type: "actions"
		});
		function m(e) {
			let t = e.target, n = W(t);
			!i.desktop && i.cordova && (a.Keyboard && a.Keyboard.isVisible || a.cordova.plugins && a.cordova.plugins.Keyboard && a.cordova.plugins.Keyboard.isVisible) || n.closest(r.el).length === 0 && (r.params.closeByBackdropClick && r.params.backdrop && r.backdropEl && r.backdropEl === t || r.params.closeByOutsideClick) && r.close();
		}
		function h(e) {
			e.keyCode === 27 && r.params.closeOnEscape && r.close();
		}
		return r.params.closeOnEscape && (r.on("open", () => {
			W(o).on("keydown", h);
		}), r.on("close", () => {
			W(o).off("keydown", h);
		})), r.on("opened", () => {
			(r.params.closeByBackdropClick || r.params.closeByOutsideClick) && e.on("click", m);
		}), r.on("close", () => {
			(r.params.closeByBackdropClick || r.params.closeByOutsideClick) && e.off("click", m);
		}), c && (c[0].f7Modal = r), r;
	}
	render() {
		let e = this;
		if (e.params.render) return e.params.render.call(e, e);
		let { groups: t } = e, n = e.params.cssClass;
		return Q("div", { class: `actions-modal${e.params.grid ? " actions-grid" : ""} ${n || ""}` }, t.map((e) => Q("div", { class: "actions-group" }, e.map((e) => {
			let t = [`actions-${e.label ? "label" : "button"}`], { color: n, bg: r, strong: i, disabled: a, label: o, text: s, icon: c } = e;
			return n && t.push(`color-${n}`), r && t.push(`bg-color-${r}`), i && t.push("actions-button-strong"), a && t.push("disabled"), o ? Q("div", { class: t.join(" ") }, s) : Q("div", { class: t.join(" ") }, c && Q("div", { class: "actions-button-media" }, c), Q("div", { class: "actions-button-text" }, s));
		}))));
	}
	renderPopover() {
		let e = this;
		if (e.params.renderPopover) return e.params.renderPopover.call(e, e);
		let { groups: t } = e, n = e.params.cssClass;
		return Q("div", { class: `popover popover-from-actions ${n || ""}` }, Q("div", { class: "popover-inner" }, t.map((e) => Q("div", { class: "list" }, Q("ul", null, e.map((e) => {
			let t = [], { color: n, bg: r, strong: i, disabled: a, label: o, text: s, icon: c } = e;
			return n && t.push(`color-${n}`), r && t.push(`bg-color-${r}`), i && t.push("popover-from-actions-strong"), a && t.push("disabled"), o ? (t.push("popover-from-actions-label"), `<li class="${t.join(" ")}">${s}</li>`) : c ? (t.push("item-link item-content"), Q("li", null, Q("a", { class: t.join(" ") }, Q("div", { class: "item-media" }, c), Q("div", { class: "item-inner" }, Q("div", { class: "item-title" }, s))))) : (t.push("list-button"), Q("li", null, Q("a", { class: t.join(" ") }, s)));
		}))))));
	}
}, Bs = {
	name: "actions",
	params: { actions: {
		convertToPopover: !0,
		forceToPopover: !1,
		backdrop: !0,
		backdropEl: void 0,
		backdropUnique: !1,
		cssClass: null,
		closeByBackdropClick: !0,
		closeOnEscape: !1,
		render: null,
		renderPopover: null,
		containerEl: null
	} },
	static: { Actions: zs },
	create() {
		let e = this;
		e.actions = go({
			app: e,
			constructor: zs,
			defaultSelector: ".actions-modal.modal-in"
		});
	},
	clicks: {
		".actions-open": function(e, t) {
			t === void 0 && (t = {}), this.actions.open(t.actions, t.animate, e);
		},
		".actions-close": function(e, t) {
			t === void 0 && (t = {}), this.actions.close(t.actions, t.animate, e);
		}
	}
}, Vs = class extends Os {
	constructor(e, t) {
		let n = J({ on: {} }, e.params.sheet, t);
		super(e, n);
		let r = this, i = H(), a = V(), o = Y(), s = X();
		r.params = n, r.params.backdrop === void 0 && (r.params.backdrop = e.theme !== "ios");
		let c;
		if (c = r.params.el ? W(r.params.el).eq(0) : W(r.params.content).filter((e) => e.nodeType === 1).eq(0), c && c.length > 0 && c[0].f7Modal) return c[0].f7Modal;
		if (c.length === 0) return r.destroy();
		let l;
		r.params.backdrop && r.params.backdropEl ? l = W(r.params.backdropEl) : r.params.backdrop && (r.params.backdropUnique ? (l = W("<div class=\"sheet-backdrop sheet-backdrop-unique\"></div>"), r.$containerEl.append(l)) : l = r.$containerEl.children(".sheet-backdrop"), l.length === 0 && (l = W("<div class=\"sheet-backdrop\"></div>"), r.$containerEl.append(l))), J(r, {
			app: e,
			push: c.hasClass("sheet-modal-push") || r.params.push,
			$el: c,
			el: c[0],
			$backdropEl: l,
			backdropEl: l && l[0],
			type: "sheet",
			$htmlEl: W("html")
		}), r.params.push && c.addClass("sheet-modal-push");
		let u;
		function d() {
			let e = W(r.params.scrollToEl).eq(0);
			if (e.length === 0 || (u = e.parents(".page-content"), u.length === 0)) return;
			let t = parseInt(u.css("padding-top"), 10), n = parseInt(u.css("padding-bottom"), 10), i = u[0].offsetHeight - t - c.height(), a = u[0].scrollHeight - t - c.height(), o = u.scrollTop(), s, l = e.offset().top - t + e[0].offsetHeight;
			if (l > i) {
				let e = o + l - i;
				e + i > a && (s = e + i - a + n, i === a && (s = c.height()), u.css({ "padding-bottom": `${s}px` })), u.scrollTop(e, 300);
			}
		}
		function f() {
			u && u.length > 0 && u.css({ "padding-bottom": "" });
		}
		function p(e) {
			let t = e.target, n = W(t);
			!s.desktop && s.cordova && (i.Keyboard && i.Keyboard.isVisible || i.cordova.plugins && i.cordova.plugins.Keyboard && i.cordova.plugins.Keyboard.isVisible) || n.closest(r.el).length === 0 && (r.params.closeByBackdropClick && r.params.backdrop && r.backdropEl && r.backdropEl === t || r.params.closeByOutsideClick) && r.close();
		}
		function m(e) {
			e.keyCode === 27 && r.params.closeOnEscape && r.close();
		}
		let h;
		function g(t) {
			return (e.height - t * 2) / e.height;
		}
		let _ = r.params.breakpoints && r.params.breakpoints.length > 0, v = !1, y, b, x, S, C, w = !1, T, E, D, O, k, A, j, M, N, P, F, ee, te, I = [], L, ne = !0;
		function re(e) {
			v || !(r.params.swipeToClose || r.params.swipeToStep) || !e.isTrusted || r.params.swipeHandler && W(e.target).closest(r.params.swipeHandler).length === 0 || W(e.target).closest(".sortable-handler").length > 0 || (v = !0, w = !1, y = {
				x: e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX,
				y: e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY
			}, S = Ga(), x = void 0, T = c.hasClass("sheet-modal-top"), !r.params.swipeHandler && e.type === "touchstart" && (P = W(e.target).closest(".page-content")[0]));
		}
		function ie(t) {
			if (!v || !t.isTrusted) return;
			if (b = {
				x: t.type === "touchmove" ? t.targetTouches[0].pageX : t.pageX,
				y: t.type === "touchmove" ? t.targetTouches[0].pageY : t.pageY
			}, x === void 0 && (x = !!(x || Math.abs(b.x - y.x) > Math.abs(b.y - y.y))), x) {
				v = !1, w = !1;
				return;
			}
			C = y.y - b.y;
			let n = C < 0 ? "to-bottom" : "to-top";
			if (!w) {
				if (P && !c.hasClass("modal-in-swipe-step") && (F = P.scrollTop, ee = P.scrollHeight, te = P.offsetHeight, ee !== te && !(n === "to-bottom" && F === 0) && !(n === "to-top" && F === ee - te))) {
					c.transform(""), v = !1, w = !1;
					return;
				}
				r.push && h && (M = e.$el.children(".view, .views")), k = c[0].offsetHeight, D = qa(c[0], "y"), T ? (A = r.params.swipeToClose ? -k : -E, j = 0) : (A = 0, j = r.params.swipeToClose ? k : _ ? I[0] : E), w = !0;
			}
			if (O = D - C, O = Math.min(Math.max(O, A), j), t.preventDefault(), _) {
				let e = T ? 1 + O / k : 1 - O / k;
				e = Math.abs(e), e = Math.min(Math.max(e, 0), 1), se(e), oe(e);
			}
			if (r.push && h && !_) {
				let e = (O - D) / k;
				r.params.swipeToStep && (e = T ? O / E : 1 - (E - O) / E), e = Math.abs(e), e = Math.min(Math.max(e, 0), 1);
				let t = 1 - e, n = 1 - (1 - g(h)) * t;
				M.transition(0).forEach((e) => {
					e.style.setProperty("transform", `translate3d(0,0,0) scale(${n})`, "important");
				}), r.params.swipeToStep && M.css("border-radius", `${N * t}px`);
			}
			if (c.transition(0).transform(`translate3d(0,${O}px,0)`), r.params.swipeToStep) {
				let e;
				e = T ? 1 - O / E : (E - O) / E, e = Math.min(Math.max(e, 0), 1), c.trigger("sheet:stepprogress", e), r.emit("local::stepProgress sheetStepProgress", r, e);
			}
		}
		function ae() {
			if (v = !1, !w) return;
			w = !1, c.transform("").transition(""), r.push && h && (M.transition(""), _ || (M.transform(""), M.css("border-radius", "")));
			let e = C < 0 ? "to-bottom" : "to-top", n = Math.abs(C);
			if (n === 0 || O === D) return;
			let i = (/* @__PURE__ */ new Date()).getTime() - S;
			if (!r.params.swipeToStep && !_) {
				if (e !== (T ? "to-top" : "to-bottom")) return;
				(i < 300 && n > 20 || i >= 300 && n > k / 2) && r.close();
				return;
			}
			let a = T ? "to-bottom" : "to-top", o = T ? "to-top" : "to-bottom", s = Math.abs(O), l = Math.abs(E);
			if (i < 300 && n > 10 && _) e === a && L !== void 0 && (L === t.breakpoints.length - 1 ? r.setBreakpoint(1) : (L = Math.min(I.length - 1, L + 1), r.setBreakpoint(t.breakpoints[L]))), e === o && (L === 0 ? r.close() : (L = L === void 0 ? t.breakpoints.length - 1 : Math.max(0, L - 1), r.setBreakpoint(t.breakpoints[L])));
			else if (i < 300 && n > 10) {
				e === a && s < l && (c.removeClass("modal-in-swipe-step"), c.trigger("sheet:stepprogress", 1), r.emit("local::stepProgress sheetStepProgress", r, 1), r.emit("local::_swipeStep", !1), c.trigger("sheet:stepopen"), r.emit("local::stepOpen sheetStepOpen", r), r.push && h && (r.$htmlEl[0].style.setProperty("--f7-sheet-push-scale", g(h)), M.css("border-radius", ""))), e === o && s > l && (r.params.swipeToClose ? r.close() : (c.addClass("modal-in-swipe-step"), c.trigger("sheet:stepprogress", 0), r.emit("local::stepProgress sheetStepProgress", r, 0), r.emit("local::_swipeStep", !0), c.trigger("sheet:stepclose"), r.emit("local::stepClose sheetStepClose", r), r.push && h && (r.$htmlEl[0].style.removeProperty("--f7-sheet-push-scale"), M.css("border-radius", "0px")))), e === o && s <= l && (c.addClass("modal-in-swipe-step"), c.trigger("sheet:stepprogress", 0), r.emit("local::stepProgress sheetStepProgress", r, 0), r.emit("local::_swipeStep", !0), c.trigger("sheet:stepclose"), r.emit("local::stepClose sheetStepClose", r), r.push && h && (r.$htmlEl[0].style.removeProperty("--f7-sheet-push-scale"), M.css("border-radius", "0px")));
				return;
			}
			if (i >= 300 && _) {
				let e = [
					k,
					...I,
					0
				], n = e.reduce((e, t) => Math.abs(t - O) < Math.abs(e - O) ? t : e), i = e.indexOf(n);
				n === 0 ? r.setBreakpoint(1) : i === 0 ? r.close() : (L = i - 1, r.setBreakpoint(t.breakpoints[L]));
			} else if (i >= 300) {
				let e = !c.hasClass("modal-in-swipe-step");
				e ? e && (s > l + (k - l) / 2 ? r.params.swipeToClose && r.close() : s > l / 2 && (c.addClass("modal-in-swipe-step"), c.trigger("sheet:stepprogress", 0), r.emit("local::stepProgress sheetStepProgress", r, 0), r.emit("local::_swipeStep", !0), c.trigger("sheet:stepclose"), r.emit("local::stepClose sheetStepClose", r), r.push && h && (r.$htmlEl[0].style.removeProperty("--f7-sheet-push-scale"), M.css("border-radius", "0px")))) : s < l / 2 ? (c.removeClass("modal-in-swipe-step"), c.trigger("sheet:stepprogress", 1), r.emit("local::stepProgress sheetStepProgress", r, 1), r.emit("local::_swipeStep", !1), c.trigger("sheet:stepopen"), r.emit("local::stepOpen sheetStepOpen", r), r.push && h && (r.$htmlEl[0].style.setProperty("--f7-sheet-push-scale", g(h)), M.css("border-radius", ""))) : s - l > (k - l) / 2 && r.params.swipeToClose && r.close();
			}
		}
		let oe = (e) => {
			let { pushBreakpoint: n } = t;
			if (!(n == null || !r.push || !h)) if (e >= n) r.$htmlEl.addClass("with-modal-sheet-push").removeClass("with-modal-sheet-push-closing"), M.transition("").forEach((e) => {
				e.style.setProperty("transform", `translate3d(0,0,0) scale(${g(h)})`, "important");
			}), M.css("border-radius", `${N * 1}px`);
			else {
				let i = [
					0,
					...t.breakpoints,
					1
				], a = i[i.indexOf(n) - 1];
				if (e <= a) M.transition("").css("transform", ""), M.css("border-radius", ""), r.$htmlEl.removeClass("with-modal-sheet-push"), e === a && r.$htmlEl.addClass("with-modal-sheet-push-closing");
				else {
					let t = (e - a) / (n - a);
					r.$htmlEl.addClass("with-modal-sheet-push").removeClass("with-modal-sheet-push-closing"), M.transition(0).forEach((e) => {
						e.style.setProperty("transform", `translate3d(0,0,0) scale(${1 - (1 - g(h)) * t})`, "important");
					}), M.css("border-radius", `${N * t}px`);
				}
			}
		}, se = (e) => {
			let { backdrop: n, backdropBreakpoint: r } = t;
			if (!(!r || !n || !l.length)) if (e >= r) ne || l.transition("").css({
				opacity: "",
				pointerEvents: ""
			}), ne = !0;
			else {
				let n = [
					0,
					...t.breakpoints,
					1
				], i = n[n.indexOf(r) - 1];
				if (e <= i) ne && l.transition("").css({
					opacity: 0,
					pointerEvents: "none"
				}), ne = !1;
				else {
					let t = (e - i) / (r - i);
					l.transition(0).css({
						opacity: t,
						pointerEvents: "auto"
					});
				}
			}
		};
		r.calcBreakpoints = () => {
			if (!_) return;
			let e = c[0].offsetHeight, t = c.hasClass("sheet-modal-top");
			I = [], r.params.breakpoints.forEach((n) => {
				I.push((e - e * n) * (t ? -1 : 1));
			});
		}, r.setBreakpoint = (e) => {
			if (!_) return r;
			if (e === 1) r.opened || r.open(), c.removeClass("modal-in-breakpoint"), L = void 0, se(e), oe(e), c.trigger("sheet:breakpoint", e), r.emit("local::breakpoint sheetBreakpoint", r, e);
			else if (e === 0) c.trigger("sheet:breakpoint", e), r.emit("local::breakpoint sheetBreakpoint", r, e), r.close();
			else {
				let n = t.breakpoints.indexOf(e);
				if (n < 0) return r;
				r.opened || r.open(), se(e), oe(e), c.trigger("sheet:breakpoint", e), r.emit("local::breakpoint sheetBreakpoint", r, e), L = n, c[0].style.setProperty("--f7-sheet-breakpoint", `${I[n]}px`), c.addClass("modal-in-breakpoint");
			}
			return r;
		};
		let ce = () => {
			r.calcBreakpoints(), L !== void 0 && r.setBreakpoint(t.breakpoints[L]);
		};
		r.setSwipeStep = function(e) {
			e === void 0 && (e = !0);
			let t = c.find(".sheet-modal-swipe-step").eq(0);
			t.length && (E = c.hasClass("sheet-modal-top") ? -(t.offset().top - c.offset().top + t[0].offsetHeight) : c[0].offsetHeight - (t.offset().top - c.offset().top + t[0].offsetHeight), c[0].style.setProperty("--f7-sheet-swipe-step", `${E}px`), e || (c.addClass("modal-in-swipe-step"), r.emit("local::_swipeStep", !0)));
		};
		function le() {
			_ ? ce() : r.setSwipeStep(!0);
		}
		let ue = o.passiveListener ? { passive: !0 } : !1;
		return (r.params.swipeToClose || r.params.swipeToStep || _) && (c.on(e.touchEvents.start, re, ue), e.on("touchmove", ie), e.on("touchend:passive", ae), r.once("sheetDestroy", () => {
			c.off(e.touchEvents.start, re, ue), e.off("touchmove", ie), e.off("touchend:passive", ae);
		})), r.on("open", () => {
			r.params.closeOnEscape && W(a).on("keydown", m), c.prevAll(".popup.modal-in").addClass("popup-behind"), e.on("resize", le), r.params.scrollToEl && d(), r.push && (h = parseInt(c.css("--f7-sheet-push-offset"), 10), Number.isNaN(h) && (h = 0), h ||= e.theme === "ios" ? 44 : 48, r.$htmlEl[0].style.setProperty("--f7-sheet-push-offset", `${h}px`), c.addClass("sheet-modal-push"), _ || r.$htmlEl.addClass("with-modal-sheet-push"), !r.params.swipeToStep && !_ ? r.$htmlEl[0].style.setProperty("--f7-sheet-push-scale", g(h)) : (M = e.$el.children(".view, .views"), N = e.theme === "ios" ? 10 : 16, M.css("border-radius", "0px"))), _ ? (r.calcBreakpoints(), r.setBreakpoint(t.breakpoints[0])) : r.params.swipeToStep && r.setSwipeStep(!1);
		}), r.on("opened", () => {
			(r.params.closeByOutsideClick || r.params.closeByBackdropClick) && e.on("click", p);
		}), r.on("close", () => {
			L = void 0, (r.params.swipeToStep || _) && (c.removeClass("modal-in-swipe-step modal-in-breakpoint"), r.emit("local::_swipeStep", !1)), e.off("resize", le), r.params.closeOnEscape && W(a).off("keydown", m), r.params.scrollToEl && f(), (r.params.closeByOutsideClick || r.params.closeByBackdropClick) && e.off("click", p), c.prevAll(".popup.modal-in").eq(0).removeClass("popup-behind"), r.push && h && (r.$htmlEl.removeClass("with-modal-sheet-push"), r.$htmlEl.addClass("with-modal-sheet-push-closing"), M && (M.transform(""), M.css("border-radius", "")));
		}), r.on("closed", () => {
			r.push && h && (r.$htmlEl.removeClass("with-modal-sheet-push-closing"), r.$htmlEl[0].style.removeProperty("--f7-sheet-push-scale"), r.$htmlEl[0].style.removeProperty("--f7-sheet-push-offset"));
		}), r.stepOpen = function() {
			c.removeClass("modal-in-swipe-step"), r.emit("local::_swipeStep", !1), r.push && (h || (h = parseInt(c.css("--f7-sheet-push-offset"), 10), Number.isNaN(h) && (h = 0)), h && r.$htmlEl[0].style.setProperty("--f7-sheet-push-scale", g(h)));
		}, r.stepClose = function() {
			c.addClass("modal-in-swipe-step"), r.emit("local::_swipeStep", !0), r.push && r.$htmlEl[0].style.removeProperty("--f7-sheet-push-scale");
		}, r.stepToggle = function() {
			c.toggleClass("modal-in-swipe-step"), r.emit("local::_swipeStep", c.hasClass("modal-in-swipe-step"));
		}, c[0].f7Modal = r, r;
	}
}, Hs = {
	name: "sheet",
	params: { sheet: {
		push: !1,
		backdrop: void 0,
		backdropEl: void 0,
		backdropUnique: !1,
		closeByBackdropClick: !0,
		closeByOutsideClick: !1,
		closeOnEscape: !1,
		swipeToClose: !1,
		swipeToStep: !1,
		breakpoints: [],
		backdropBreakpoint: 0,
		pushBreakpoint: 0,
		swipeHandler: null,
		containerEl: null
	} },
	static: { Sheet: Vs },
	create() {
		let e = this;
		e.sheet = J({}, go({
			app: e,
			constructor: Vs,
			defaultSelector: ".sheet-modal.modal-in"
		}), {
			stepOpen(t) {
				let n = e.sheet.get(t);
				if (n && n.stepOpen) return n.stepOpen();
			},
			stepClose(t) {
				let n = e.sheet.get(t);
				if (n && n.stepClose) return n.stepClose();
			},
			stepToggle(t) {
				let n = e.sheet.get(t);
				if (n && n.stepToggle) return n.stepToggle();
			},
			setBreakpoint(t, n) {
				let r = e.sheet.get(t);
				if (r && r.setBreakpoint) return r.setBreakpoint(n);
			}
		});
	},
	clicks: {
		".sheet-open": function(e, t) {
			t === void 0 && (t = {});
			let n = this;
			W(".sheet-modal.modal-in").length > 0 && t.sheet && W(t.sheet)[0] !== W(".sheet-modal.modal-in")[0] && n.sheet.close(".sheet-modal.modal-in"), n.sheet.open(t.sheet, t.animate, e);
		},
		".sheet-close": function(e, t) {
			t === void 0 && (t = {}), this.sheet.close(t.sheet, t.animate, e);
		}
	}
}, Us = class extends Os {
	constructor(e, t) {
		let n = J({ on: {} }, e.params.toast, t);
		super(e, n);
		let r = this, i = H();
		r.app = e, r.params = n;
		let { closeButton: a, closeTimeout: o } = r.params, s;
		if (s = r.params.el ? W(r.params.el) : W(r.render()), s && s.length > 0 && s[0].f7Modal) return s[0].f7Modal;
		if (s.length === 0) return r.destroy();
		J(r, {
			$el: s,
			el: s[0],
			type: "toast"
		}), s[0].f7Modal = r, a && (s.find(".toast-button").on("click", () => {
			r.emit("local::closeButtonClick toastCloseButtonClick", r), r.close();
		}), r.on("beforeDestroy", () => {
			s.find(".toast-button").off("click");
		}));
		let c;
		return r.on("open", () => {
			W(".toast.modal-in").each((t) => {
				let n = e.toast.get(t);
				t !== r.el && n && n.close();
			}), o && (c = Ua(() => {
				r.close();
			}, o));
		}), r.on("close", () => {
			i.clearTimeout(c);
		}), r.params.destroyOnClose && r.once("closed", () => {
			setTimeout(() => {
				r.destroy();
			}, 0);
		}), r;
	}
	render() {
		let e = this;
		if (e.params.render) return e.params.render.call(e, e);
		let { position: t, horizontalPosition: n, cssClass: r, icon: i, text: a, closeButton: o, closeButtonColor: s, closeButtonText: c } = e.params;
		return Q("div", { class: `toast toast-${t} ${t === "top" || t === "bottom" ? `toast-horizontal-${n}` : ""} ${r || ""} ${i ? "toast-with-icon" : ""}` }, Q("div", { class: "toast-content" }, i && Q("div", { class: "toast-icon" }, i), Q("div", { class: "toast-text" }, a), o && !i && Q("a", { class: `toast-button button ${s ? `color-${s}` : ""}` }, c)));
	}
}, Ws = {
	name: "toast",
	static: { Toast: Us },
	create() {
		let e = this;
		e.toast = J({}, go({
			app: e,
			constructor: Us,
			defaultSelector: ".toast.modal-in"
		}), { show(t) {
			return J(t, { destroyOnClose: !0 }), new Us(e, t).open();
		} });
	},
	params: { toast: {
		icon: null,
		text: null,
		position: "bottom",
		horizontalPosition: "left",
		closeButton: !1,
		closeButtonColor: null,
		closeButtonText: "Ok",
		closeTimeout: null,
		cssClass: null,
		render: null,
		containerEl: null
	} }
}, Gs = {
	init(e) {
		let t = this, n = {
			iosPreloaderContent: Ra,
			mdPreloaderContent: La
		}, r = W(e);
		r.length === 0 || r.children(".preloader-inner").length > 0 || r.children(".preloader-inner-line").length > 0 || r.append(n[`${t.theme}PreloaderContent`]);
	},
	visible: !1,
	show(e) {
		e === void 0 && (e = "white");
		let t = this;
		if (Gs.visible) return;
		let n = {
			iosPreloaderContent: Ra,
			mdPreloaderContent: La
		}[`${t.theme}PreloaderContent`] || "";
		W("html").addClass("with-modal-preloader"), t.$el.append(`
      <div class="preloader-backdrop"></div>
      <div class="preloader-modal">
        <div class="preloader color-${e}">${n}</div>
      </div>
    `), Gs.visible = !0;
	},
	showIn(e, t) {
		t === void 0 && (t = "white");
		let n = this, r = {
			iosPreloaderContent: Ra,
			mdPreloaderContent: La
		}[`${n.theme}PreloaderContent`] || "";
		W(e || "html").addClass("with-modal-preloader"), W(e || n.$el).append(`
      <div class="preloader-backdrop"></div>
      <div class="preloader-modal">
        <div class="preloader color-${t}">${r}</div>
      </div>
    `);
	},
	hide() {
		let e = this;
		Gs.visible &&= (W("html").removeClass("with-modal-preloader"), e.$el.find(".preloader-backdrop, .preloader-modal").remove(), !1);
	},
	hideIn(e) {
		let t = this;
		W(e || "html").removeClass("with-modal-preloader"), W(e || t.$el).find(".preloader-backdrop, .preloader-modal").remove();
	}
}, Ks = {
	name: "preloader",
	create() {
		ao(this, { preloader: Gs });
	},
	on: {
		photoBrowserOpen(e) {
			let t = this;
			e.$el.find(".preloader").each((e) => {
				t.preloader.init(e);
			});
		},
		tabMounted(e) {
			let t = this;
			W(e).find(".preloader").each((e) => {
				t.preloader.init(e);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".preloader").each((e) => {
				t.preloader.init(e);
			});
		}
	},
	vnode: { preloader: { insert(e) {
		let t = this, n = e.elm;
		t.preloader.init(n);
	} } }
}, qs = {
	set() {
		let e = this;
		var t = [...arguments];
		let [n, r, i] = t;
		if (typeof t[0] == "number" && ([r, i] = t, n = e.$el), r == null) return n;
		r ||= 0;
		let a = W(n || e.$el);
		if (a.length === 0) return n;
		let o = Math.min(Math.max(r, 0), 100), s;
		if (s = a.hasClass("progressbar") ? a.eq(0) : a.children(".progressbar"), s.length === 0 || s.hasClass("progressbar-infinite")) return s;
		let c = s.children("span");
		return c.length === 0 && (c = W("<span></span>"), s.append(c)), c.transition(i === void 0 ? "" : i).transform(`translate3d(${(-100 + o) * (e.rtl ? -1 : 1)}%,0,0)`), s[0];
	},
	show() {
		let e = this;
		var t = [...arguments];
		let [n, r, i] = t, a = "determined";
		t.length === 2 ? (typeof t[0] == "string" || typeof t[0] == "object") && typeof t[1] == "string" ? ([n, i, r] = t, a = "infinite") : typeof t[0] == "number" && typeof t[1] == "string" && ([r, i] = t, n = e.$el) : t.length === 1 ? typeof t[0] == "number" ? (n = e.$el, r = t[0]) : typeof t[0] == "string" && (a = "infinite", n = e.$el, i = t[0]) : t.length === 0 && (a = "infinite", n = e.$el);
		let o = W(n);
		if (o.length === 0) return;
		let s;
		return o.hasClass("progressbar") || o.hasClass("progressbar-infinite") ? s = o : (s = o.children(".progressbar:not(.progressbar-out), .progressbar-infinite:not(.progressbar-out)"), s.length === 0 && (s = W(`
          <span class="progressbar${a === "infinite" ? "-infinite" : ""}${i ? ` color-${i}` : ""} progressbar-in">
            ${a === "infinite" ? "" : "<span></span>"}
          </span>`), o.append(s))), r !== void 0 && e.progressbar.set(s, r), s[0];
	},
	hide(e, t) {
		t === void 0 && (t = !0);
		let n = this, r = W(e || n.$el);
		if (r.length === 0) return;
		let i;
		return i = r.hasClass("progressbar") || r.hasClass("progressbar-infinite") ? r : r.children(".progressbar, .progressbar-infinite"), i.length === 0 || !i.hasClass("progressbar-in") || i.hasClass("progressbar-out") || i.removeClass("progressbar-in").addClass("progressbar-out").animationEnd(() => {
			t && i.remove();
		}), i;
	}
}, Js = {
	name: "progressbar",
	create() {
		ao(this, { progressbar: qs });
	},
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".progressbar").each((e) => {
				let n = W(e);
				t.progressbar.set(n, n.attr("data-progress"));
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".progressbar").each((e) => {
				let n = W(e);
				t.progressbar.set(n, n.attr("data-progress"));
			});
		}
	},
	vnode: { progressbar: {
		insert(e) {
			let t = this, n = e.elm;
			t.progressbar.set(n, n.getAttribute("data-progress"));
		},
		update(e) {
			let t = this, n = e.elm;
			t.progressbar.set(n, n.getAttribute("data-progress"));
		}
	} }
}, Ys = {
	init() {
		let e = this, t = V(), n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S;
		function C(t, a) {
			r = !1, n = !0, S = !1, i = t.type === "touchstart" ? t.targetTouches[0].pageY : t.pageY, o = W(t.target).closest("li").eq(0), m = o.index(), c = o.parents(".sortable");
			let l = o.parents(".list-group");
			l.length && l.parents(c).length && (c = l), s = c.children("ul").children("li:not(.disallow-sorting):not(.no-sorting)"), e.panel && (e.panel.allowOpen = !1), e.swipeout && (e.swipeout.allow = !1), a && (o.addClass("sorting"), c.addClass("sortable-sorting"), S = !0);
		}
		function w(t) {
			if (!n || !o) return;
			let m = t.type === "touchmove" ? t.targetTouches[0].pageY : t.pageY;
			if (!r) {
				h = o.parents(".page"), g = o.parents(".page-content");
				let e = parseInt(g.css("padding-top"), 10), t = parseInt(g.css("padding-bottom"), 10);
				x = g[0].scrollTop, v = h.offset().top + e, _ = h.height() - e - t, o.addClass("sorting"), c.addClass("sortable-sorting"), y = o[0].offsetTop, u = o[0].offsetTop, d = o.parent().height() - y - o.height(), l = o[0].offsetHeight, b = o.offset().top;
			}
			r = !0, t.preventDefault(), t.f7PreventSwipePanel = !0, a = m - i;
			let S = g[0].scrollTop - x, C = Math.min(Math.max(a + S, -u), d);
			o.transform(`translate3d(0,${C}px,0)`);
			let w = !0;
			a + S + 44 < -u && (w = !1), a + S - 44 > d && (w = !1), p = void 0, f = void 0;
			let T;
			w && (b + a + l + 44 > v + _ && (T = b + a + l + 44 - (v + _)), b + a < v + 44 && (T = b + a - v - 44), T && (g[0].scrollTop += T)), s.each((t) => {
				let n = W(t);
				if (n[0] === o[0]) return;
				let r = n[0].offsetTop, i = n.height(), a = y + C, s, u = n[0].f7Translate;
				a >= r - i / 2 && o.index() < n.index() ? (s = -l, n.transform(`translate3d(0, ${s}px,0)`), f = n, p = void 0) : a <= r + i / 2 && o.index() > n.index() ? (s = l, n[0].f7Translate = s, n.transform(`translate3d(0, ${s}px,0)`), f = void 0, p ||= n) : (s = void 0, n.transform("translate3d(0, 0%,0)")), u !== s && (n.trigger("sortable:move"), e.emit("sortableMove", n[0], c[0])), n[0].f7Translate = s;
			});
		}
		function T() {
			if (!n || !r) {
				n && !r && (e.panel && (e.panel.allowOpen = !0), e.swipeout && (e.swipeout.allow = !0), S && (o.removeClass("sorting"), c.removeClass("sortable-sorting"))), n = !1, r = !1;
				return;
			}
			e.panel && (e.panel.allowOpen = !0), e.swipeout && (e.swipeout.allow = !0), s.transform(""), o.removeClass("sorting"), c.removeClass("sortable-sorting");
			let t;
			f ? t = f.index() : p && (t = p.index());
			let i = c.dataset().sortableMoveElements;
			if (i === void 0 && (i = e.params.sortable.moveElements), i && (f && o.insertAfter(f), p && o.insertBefore(p)), (f || p) && c.hasClass("virtual-list")) {
				m = o[0].f7VirtualListIndex, m === void 0 && (m = o.attr("data-virtual-list-index")), p ? (t = p[0].f7VirtualListIndex, t === void 0 && (t = p.attr("data-virtual-list-index"))) : (t = f[0].f7VirtualListIndex, t === void 0 && (t = f.attr("data-virtual-list-index"))), t = t === null ? void 0 : parseInt(t, 10);
				let e = c[0].f7VirtualList;
				m &&= parseInt(m, 10), t &&= parseInt(t, 10), e && e.moveItem(m, t);
			}
			t !== void 0 && !Number.isNaN(t) && t !== m && (o.trigger("sortable:sort", {
				from: m,
				to: t
			}), e.emit("sortableSort", o[0], {
				from: m,
				to: t,
				el: o[0]
			}, c[0])), p = void 0, f = void 0, n = !1, r = !1;
		}
		let E = Y().passiveListener ? {
			passive: !1,
			capture: !1
		} : !1;
		W(t).on(e.touchEvents.start, ".list.sortable .sortable-handler", C, E), e.on("touchmove:active", w), e.on("touchend:passive", T), W(t).on("taphold", ".sortable-tap-hold", (e, t) => {
			C(t, !0);
		});
	},
	enable(e) {
		e === void 0 && (e = ".list.sortable");
		let t = this, n = W(e);
		n.length !== 0 && (n.addClass("sortable-enabled"), n.trigger("sortable:enable"), t.emit("sortableEnable", n[0]));
	},
	disable(e) {
		e === void 0 && (e = ".list.sortable");
		let t = this, n = W(e);
		n.length !== 0 && (n.removeClass("sortable-enabled"), n.trigger("sortable:disable"), t.emit("sortableDisable", n[0]));
	},
	toggle(e) {
		e === void 0 && (e = ".list.sortable");
		let t = this, n = W(e);
		n.length !== 0 && (n.hasClass("sortable-enabled") ? t.sortable.disable(n) : t.sortable.enable(n));
	}
}, Xs = {
	name: "sortable",
	params: { sortable: { moveElements: !0 } },
	create() {
		ao(this, { sortable: Ys });
	},
	on: { init() {
		let e = this;
		e.params.sortable && e.sortable.init();
	} },
	clicks: {
		".sortable-enable": function(e, t) {
			t === void 0 && (t = {}), this.sortable.enable(t.sortable);
		},
		".sortable-disable": function(e, t) {
			t === void 0 && (t = {}), this.sortable.disable(t.sortable);
		},
		".sortable-toggle": function(e, t) {
			t === void 0 && (t = {}), this.sortable.toggle(t.sortable);
		}
	}
}, Zs = {
	init() {
		let e = this, t = V(), n = {}, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C;
		function w(t) {
			e.swipeout.allow && (i = !1, r = !0, a = void 0, n.x = t.type === "touchstart" ? t.targetTouches[0].pageX : t.pageX, n.y = t.type === "touchstart" ? t.targetTouches[0].pageY : t.pageY, o = (/* @__PURE__ */ new Date()).getTime(), c = W(this));
		}
		function T(t) {
			if (!r) return;
			let o = t.type === "touchmove" ? t.targetTouches[0].pageX : t.pageX, w = t.type === "touchmove" ? t.targetTouches[0].pageY : t.pageY;
			if (a === void 0 && (a = !!(a || Math.abs(w - n.y) > Math.abs(o - n.x))), a) {
				r = !1;
				return;
			}
			if (!i) {
				if (W(".list.sortable-opened").length > 0) return;
				l = c.find(".swipeout-content"), u = c.find(".swipeout-actions-right"), d = c.find(".swipeout-actions-left"), f = null, p = null, _ = null, v = null, x = null, b = null, d.length > 0 && (f = d.outerWidth(), _ = d.children("a"), b = d.find(".swipeout-overswipe")), u.length > 0 && (p = u.outerWidth(), v = u.children("a"), x = u.find(".swipeout-overswipe")), h = c.hasClass("swipeout-opened"), h && (g = c.find(".swipeout-actions-left.swipeout-actions-opened").length > 0 ? "left" : "right"), c.removeClass("swipeout-transitioning"), e.params.swipeout.noFollow || (c.find(".swipeout-actions-opened").removeClass("swipeout-actions-opened"), c.removeClass("swipeout-opened"));
			}
			if (i = !0, t.cancelable && t.preventDefault(), s = o - n.x, m = s, h && (g === "right" ? m -= p : m += f), m > 0 && d.length === 0 || m < 0 && u.length === 0) {
				if (!h) {
					r = !1, i = !1, l.transform(""), v && v.length > 0 && v.transform(""), _ && _.length > 0 && _.transform("");
					return;
				}
				m = 0;
			}
			m < 0 ? y = "to-left" : m > 0 ? y = "to-right" : y ||= "to-left";
			let T, E;
			if (t.f7PreventSwipePanel = !0, e.params.swipeout.noFollow) {
				h ? (g === "right" && s > 0 && e.swipeout.close(c), g === "left" && s < 0 && e.swipeout.close(c)) : (s < 0 && u.length > 0 && e.swipeout.open(c, "right"), s > 0 && d.length > 0 && e.swipeout.open(c, "left")), r = !1, i = !1;
				return;
			}
			if (S = !1, C = !1, u.length > 0) {
				let t = m;
				if (E = t / p, t < -p) {
					let n = t / -p;
					t = -p - (-t - p) ** .8, m = t, x.length > 0 && n > e.params.swipeout.overswipeRatio && (C = !0);
				}
				y !== "to-left" && (E = 0, t = 0), v.each((n) => {
					let r = W(n);
					n.f7SwipeoutButtonOffset === void 0 && (r[0].f7SwipeoutButtonOffset = n.offsetLeft), T = n.f7SwipeoutButtonOffset, x.length > 0 && r.hasClass("swipeout-overswipe") && y === "to-left" && (r.css({ left: `${C ? -T : 0}px` }), C ? (r.hasClass("swipeout-overswipe-active") || (c.trigger("swipeout:overswipeenter"), e.emit("swipeoutOverswipeEnter", c[0])), r.addClass("swipeout-overswipe-active")) : (r.hasClass("swipeout-overswipe-active") && (c.trigger("swipeout:overswipeexit"), e.emit("swipeoutOverswipeExit", c[0])), r.removeClass("swipeout-overswipe-active"))), r.transform(`translate3d(${t - T * (1 + Math.max(E, -1))}px,0,0)`);
				});
			}
			if (d.length > 0) {
				let t = m;
				if (E = t / f, t > f) {
					let n = t / p;
					t = f + (t - f) ** .8, m = t, b.length > 0 && n > e.params.swipeout.overswipeRatio && (S = !0);
				}
				y !== "to-right" && (t = 0, E = 0), _.each((n, r) => {
					let i = W(n);
					n.f7SwipeoutButtonOffset === void 0 && (i[0].f7SwipeoutButtonOffset = f - n.offsetLeft - n.offsetWidth), T = n.f7SwipeoutButtonOffset, b.length > 0 && i.hasClass("swipeout-overswipe") && y === "to-right" && (i.css({ left: `${S ? T : 0}px` }), S ? (i.hasClass("swipeout-overswipe-active") || (c.trigger("swipeout:overswipeenter"), e.emit("swipeoutOverswipeEnter", c[0])), i.addClass("swipeout-overswipe-active")) : (i.hasClass("swipeout-overswipe-active") && (c.trigger("swipeout:overswipeexit"), e.emit("swipeoutOverswipeExit", c[0])), i.removeClass("swipeout-overswipe-active"))), _.length > 1 && i.css("z-index", _.length - r), i.transform(`translate3d(${t + T * (1 - Math.min(E, 1))}px,0,0)`);
				});
			}
			c.trigger("swipeout", E), e.emit("swipeout", c[0], E), l.transform(`translate3d(${m}px,0,0)`);
		}
		function E() {
			if (!r || !i) {
				r = !1, i = !1;
				return;
			}
			r = !1, i = !1;
			let t = (/* @__PURE__ */ new Date()).getTime() - o, n = y === "to-left" ? u : d, a = y === "to-left" ? p : f, g, b, x;
			if (g = t < 300 && (s < -10 && y === "to-left" || s > 10 && y === "to-right") || t >= 300 && Math.abs(m) > a / 2 ? "open" : "close", t < 300 && (Math.abs(m) === 0 && (g = "close"), Math.abs(m) === a && (g = "open")), g === "open") {
				Zs.el = c[0], c.trigger("swipeout:open"), e.emit("swipeoutOpen", c[0]), c.addClass("swipeout-opened swipeout-transitioning");
				let t = y === "to-left" ? -a : a;
				if (l.transform(`translate3d(${t}px,0,0)`), n.addClass("swipeout-actions-opened"), b = y === "to-left" ? v : _, b) for (x = 0; x < b.length; x += 1) W(b[x]).transform(`translate3d(${t}px,0,0)`);
				C && u.find(".swipeout-overswipe").trigger("click", "f7Overswipe"), S && d.find(".swipeout-overswipe").trigger("click", "f7Overswipe");
			} else c.trigger("swipeout:close"), e.emit("swipeoutClose", c[0]), Zs.el = void 0, c.addClass("swipeout-transitioning").removeClass("swipeout-opened"), l.transform(""), n.removeClass("swipeout-actions-opened");
			let w;
			_ && _.length > 0 && _ !== b && _.each((e) => {
				let t = W(e);
				w = e.f7SwipeoutButtonOffset, w === void 0 && (t[0].f7SwipeoutButtonOffset = f - e.offsetLeft - e.offsetWidth), t.transform(`translate3d(${w}px,0,0)`);
			}), v && v.length > 0 && v !== b && v.each((e) => {
				let t = W(e);
				w = e.f7SwipeoutButtonOffset, w === void 0 && (t[0].f7SwipeoutButtonOffset = e.offsetLeft), t.transform(`translate3d(${-w}px,0,0)`);
			}), l.transitionEnd(() => {
				h && g === "open" || !h && g === "close" || (c.trigger(g === "open" ? "swipeout:opened" : "swipeout:closed"), e.emit(g === "open" ? "swipeoutOpened" : "swipeoutClosed", c[0]), c.removeClass("swipeout-transitioning"), h && g === "close" && (u.length > 0 && v.transform(""), d.length > 0 && _.transform("")));
			});
		}
		let D = Y().passiveListener ? { passive: !0 } : !1;
		e.on("touchstart", (t) => {
			if (Zs.el) {
				let n = W(t.target);
				W(Zs.el).is(n[0]) || n.parents(".swipeout").is(Zs.el) || n.hasClass("modal-in") || (n.attr("class") || "").indexOf("-backdrop") > 0 || n.hasClass("actions-modal") || n.parents(".actions-modal.modal-in, .dialog.modal-in").length > 0 || e.swipeout.close(Zs.el);
			}
		}), W(t).on(e.touchEvents.start, "li.swipeout", w, D), e.on("touchmove:active", T), e.on("touchend:passive", E);
	},
	allow: !0,
	el: void 0,
	open() {
		let e = this;
		var t = [...arguments];
		let [n, r, i] = t;
		typeof t[1] == "function" && ([n, i, r] = t);
		let a = W(n).eq(0);
		if (a.length === 0 || !a.hasClass("swipeout") || a.hasClass("swipeout-opened")) return;
		r ||= a.find(".swipeout-actions-right").length > 0 ? "right" : "left";
		let o = a.find(`.swipeout-actions-${r}`), s = a.find(".swipeout-content");
		if (o.length === 0) return;
		a.trigger("swipeout:open").addClass("swipeout-opened").removeClass("swipeout-transitioning"), e.emit("swipeoutOpen", a[0]), o.addClass("swipeout-actions-opened");
		let c = o.children("a"), l = o.outerWidth(), u = r === "right" ? -l : l;
		c.length > 1 && c.each((e, t) => {
			let n = W(e);
			r === "right" ? n.transform(`translate3d(${-e.offsetLeft}px,0,0)`) : n.css("z-index", c.length - t).transform(`translate3d(${l - e.offsetWidth - e.offsetLeft}px,0,0)`);
		}), a.addClass("swipeout-transitioning"), s.transitionEnd(() => {
			a.trigger("swipeout:opened"), e.emit("swipeoutOpened", a[0]), i && i.call(a[0]);
		}), Wa(() => {
			c.transform(`translate3d(${u}px,0,0)`), s.transform(`translate3d(${u}px,0,0)`);
		}), Zs.el = a[0];
	},
	close(e, t) {
		let n = this, r = W(e).eq(0);
		if (r.length === 0 || !r.hasClass("swipeout-opened")) return;
		let i = r.find(".swipeout-actions-opened").hasClass("swipeout-actions-right") ? "right" : "left", a = r.find(".swipeout-actions-opened").removeClass("swipeout-actions-opened"), o = a.children("a"), s = a.outerWidth();
		n.swipeout.allow = !1, r.trigger("swipeout:close"), n.emit("swipeoutClose", r[0]), r.removeClass("swipeout-opened").addClass("swipeout-transitioning");
		let c;
		function l() {
			n.swipeout.allow = !0, !r.hasClass("swipeout-opened") && (r.removeClass("swipeout-transitioning"), o.transform(""), r.trigger("swipeout:closed"), n.emit("swipeoutClosed", r[0]), t && t.call(r[0]), c && clearTimeout(c));
		}
		r.find(".swipeout-content").transform("").transitionEnd(l), c = setTimeout(l, 500), o.each((e) => {
			let t = W(e);
			i === "right" ? t.transform(`translate3d(${-e.offsetLeft}px,0,0)`) : t.transform(`translate3d(${s - e.offsetWidth - e.offsetLeft}px,0,0)`), t.css({ left: "0px" }).removeClass("swipeout-overswipe-active");
		}), Zs.el && Zs.el === r[0] && (Zs.el = void 0);
	},
	delete(e, t) {
		let n = this, r = W(e).eq(0);
		r.length !== 0 && (Zs.el = void 0, r.trigger("swipeout:delete"), n.emit("swipeoutDelete", r[0]), r.css({ height: `${r.outerHeight()}px` }), r.transitionEnd(() => {
			if (r.trigger("swipeout:deleted"), n.emit("swipeoutDeleted", r[0]), t && t.call(r[0]), r.parents(".virtual-list").length > 0) {
				let e = r.parents(".virtual-list")[0].f7VirtualList, t = r[0].f7VirtualListIndex;
				e && t !== void 0 && e.deleteItem(t);
			} else n.params.swipeout.removeElements ? n.params.swipeout.removeElementsWithTimeout ? setTimeout(() => {
				r.remove();
			}, n.params.swipeout.removeElementsTimeout) : r.remove() : r.removeClass("swipeout-deleting swipeout-transitioning");
		}), Wa(() => {
			r.addClass("swipeout-deleting swipeout-transitioning").css({ height: "0px" }).find(".swipeout-content").transform("translate3d(-100%,0,0)");
		}));
	}
}, Qs = {
	name: "swipeout",
	params: { swipeout: {
		actionsNoFold: !1,
		noFollow: !1,
		removeElements: !0,
		removeElementsWithTimeout: !1,
		removeElementsTimeout: 0,
		overswipeRatio: 1.2
	} },
	create() {
		ao(this, { swipeout: Zs });
	},
	clicks: {
		".swipeout-open": function(e, t) {
			t === void 0 && (t = {}), this.swipeout.open(t.swipeout, t.side);
		},
		".swipeout-close": function(e) {
			let t = this, n = e.closest(".swipeout");
			n.length !== 0 && t.swipeout.close(n);
		},
		".swipeout-delete": function(e, t) {
			t === void 0 && (t = {});
			let n = this, r = e.closest(".swipeout");
			if (r.length === 0) return;
			let { confirm: i, confirmTitle: a } = t;
			t.confirm ? n.dialog.confirm(i, a, () => {
				n.swipeout.delete(r);
			}) : n.swipeout.delete(r);
		}
	},
	on: { init() {
		let e = this;
		e.params.swipeout && e.swipeout.init();
	} }
}, $s = {
	toggleClicked(e) {
		let t = this, n = e.closest(".accordion-item").eq(0);
		n.length || (n = e.parents("li").eq(0));
		let r = e.parents(".accordion-item-content").eq(0);
		r.length && r.parents(n).length || e.parents("li").length > 1 && e.parents("li")[0] !== n[0] || t.accordion.toggle(n);
	},
	open(e) {
		let t = this, n = W(e), r = !1;
		function i() {
			r = !0;
		}
		if (n.trigger("accordion:beforeopen", { prevent: i }, i), t.emit("accordionBeforeOpen", n[0], i), r) return;
		let a = n.parents(".accordion-list").eq(0), o = n.children(".accordion-item-content");
		if (o.removeAttr("aria-hidden"), o.length === 0 && (o = n.find(".accordion-item-content")), o.length === 0) return;
		let s = a.length > 0 && n.parent().children(".accordion-item-opened");
		s.length > 0 && t.accordion.close(s), o.transitionEnd(() => {
			n.hasClass("accordion-item-opened") ? (o.transition(0), o.css("height", "auto"), Wa(() => {
				o.transition(""), n.trigger("accordion:opened"), t.emit("accordionOpened", n[0]);
			})) : (o.css("height", ""), n.trigger("accordion:closed"), t.emit("accordionClosed", n[0]));
		}), o.css("height", `${o[0].scrollHeight}px`), n.trigger("accordion:open"), n.addClass("accordion-item-opened"), t.emit("accordionOpen", n[0]);
	},
	close(e) {
		let t = this, n = W(e), r = !1;
		function i() {
			r = !0;
		}
		if (n.trigger("accordion:beforeclose", { prevent: i }, i), t.emit("accordionBeforeClose", n[0], i), r) return;
		let a = n.children(".accordion-item-content");
		a.length === 0 && (a = n.find(".accordion-item-content")), n.removeClass("accordion-item-opened"), a.attr("aria-hidden", !0), a.transition(0), a.css("height", `${a[0].scrollHeight}px`), a.transitionEnd(() => {
			n.hasClass("accordion-item-opened") ? (a.transition(0), a.css("height", "auto"), Wa(() => {
				a.transition(""), n.trigger("accordion:opened"), t.emit("accordionOpened", n[0]);
			})) : (a.css("height", ""), n.trigger("accordion:closed"), t.emit("accordionClosed", n[0]));
		}), Wa(() => {
			a.transition(""), a.css("height", ""), n.trigger("accordion:close"), t.emit("accordionClose", n[0]);
		});
	},
	toggle(e) {
		let t = this, n = W(e);
		n.length !== 0 && (n.hasClass("accordion-item-opened") ? t.accordion.close(e) : t.accordion.open(e));
	}
}, ec = {
	name: "accordion",
	create() {
		ao(this, { accordion: $s });
	},
	clicks: { ".accordion-item .item-link, .accordion-item-toggle, .links-list.accordion-list > ul > li > a": function(e) {
		let t = this;
		$s.toggleClicked.call(t, e);
	} }
}, tc = { name: "contactsList" }, nc = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = X(), i = V(), a;
		e.theme === "md" ? a = 48 : e.theme === "ios" && (a = 44);
		let o = {
			cols: 1,
			height: a,
			cache: !0,
			dynamicHeightBufferSize: 1,
			showFilteredItemsOnly: !1,
			renderExternal: void 0,
			setListHeight: !0,
			searchByItem: void 0,
			searchAll: void 0,
			ul: null,
			createUl: !0,
			scrollableParentEl: void 0,
			renderItem(e) {
				return `
          <li>
            <div class="item-content">
              <div class="item-inner">
                <div class="item-title">${e}</div>
              </div>
            </div>
          </li>
        `.trim();
			},
			on: {}
		};
		if (n.useModulesParams(o), n.params = J(o, t), (n.params.height === void 0 || !n.params.height) && (n.params.height = a), n.$el = W(t.el), n.el = n.$el[0], n.$el.length === 0) return;
		n.$el[0].f7VirtualList = n, n.items = n.params.items, n.params.showFilteredItemsOnly && (n.filteredItems = []), n.params.renderItem && (n.renderItem = n.params.renderItem), n.$pageContentEl = n.$el.parents(".page-content"), n.pageContentEl = n.$pageContentEl[0], n.$scrollableParentEl = n.params.scrollableParentEl ? W(n.params.scrollableParentEl).eq(0) : n.$pageContentEl, !n.$scrollableParentEl.length && n.$pageContentEl.length && (n.$scrollableParentEl = n.$pageContentEl), n.scrollableParentEl = n.$scrollableParentEl[0], n.params.updatableScroll === void 0 ? (n.updatableScroll = !0, r.ios && r.osVersion.split(".")[0] < 8 && (n.updatableScroll = !1)) : n.updatableScroll = n.params.updatableScroll, n.$ul = n.params.ul ? W(n.params.ul) : n.$el.children("ul"), n.$ul.length === 0 && n.params.createUl && (n.$el.append("<ul></ul>"), n.$ul = n.$el.children("ul")), n.ul = n.$ul[0];
		let s;
		s = !n.ul && !n.params.createUl ? n.$el : n.$ul, J(n, {
			$itemsWrapEl: s,
			itemsWrapEl: s[0],
			domCache: {},
			tempDomElement: i.createElement("ul"),
			lastRepaintY: null,
			fragment: i.createDocumentFragment(),
			pageHeight: void 0,
			rowsPerScreen: void 0,
			rowsBefore: void 0,
			rowsAfter: void 0,
			rowsToRender: void 0,
			maxBufferHeight: 0,
			listHeight: void 0,
			dynamicHeight: typeof n.params.height == "function",
			autoHeight: n.params.height === "auto"
		}), n.useModules();
		let c = n.handleScroll.bind(n), l = n.handleResize.bind(n), u, d, f, p;
		return n.attachEvents = function() {
			u = n.$el.parents(".page").eq(0), d = n.$el.parents(".tab").filter((e) => W(e).parent(".tabs").parent(".tabs-animated-wrap, swiper-container.tabs").length === 0).eq(0), f = n.$el.parents(".panel").eq(0), p = n.$el.parents(".popup").eq(0), n.$scrollableParentEl.on("scroll", c), u.length && u.on("page:reinit", l), d.length && d.on("tab:show", l), f.length && f.on("panel:open", l), p.length && p.on("popup:open", l), e.on("resize", l);
		}, n.detachEvents = function() {
			n.$scrollableParentEl.off("scroll", c), u.length && u.off("page:reinit", l), d.length && d.off("tab:show", l), f.length && f.off("panel:open", l), p.length && p.off("popup:open", l), e.off("resize", l);
		}, n.init(), n;
	}
	setListSize(e) {
		let t = this, n = t.filteredItems || t.items;
		if (e || (t.pageHeight = t.$scrollableParentEl[0].offsetHeight), t.dynamicHeight) {
			t.listHeight = 0, t.heights = [];
			for (let e = 0; e < n.length; e += 1) {
				let r = t.params.height(n[e]);
				t.listHeight += r, t.heights.push(r);
			}
		} else if (t.autoHeight) {
			t.listHeight = 0, t.heights ||= [], t.heightsCalculated ||= [];
			let e = {};
			t.$itemsWrapEl.find("[data-virtual-list-index]").forEach((t) => {
				e[parseInt(t.getAttribute("data-virtual-list-index"), 10)] = t;
			});
			for (let r = 0; r < n.length; r += 1) {
				let i = t.items.indexOf(n[r]), a = e[i];
				a && (t.heightsCalculated.includes(i) || (t.heights[i] = a.offsetHeight, t.heightsCalculated.push(i))), t.heights[r] === void 0 && (t.heights[i] = 40), t.listHeight += t.heights[i];
			}
		} else t.listHeight = Math.ceil(n.length / t.params.cols) * t.params.height, t.rowsPerScreen = Math.ceil(t.pageHeight / t.params.height), t.rowsBefore = t.params.rowsBefore || t.rowsPerScreen * 2, t.rowsAfter = t.params.rowsAfter || t.rowsPerScreen, t.rowsToRender = t.rowsPerScreen + t.rowsBefore + t.rowsAfter, t.maxBufferHeight = t.rowsBefore / 2 * t.params.height;
		(t.updatableScroll || t.params.setListHeight) && t.$itemsWrapEl.css({ height: `${t.listHeight}px` });
	}
	render(e, t) {
		let n = this;
		e && (n.lastRepaintY = null);
		let r = -(n.$el[0].getBoundingClientRect().top - n.$scrollableParentEl[0].getBoundingClientRect().top);
		if (t !== void 0 && (r = t), n.lastRepaintY === null || Math.abs(r - n.lastRepaintY) > n.maxBufferHeight || !n.updatableScroll && n.$scrollableParentEl[0].scrollTop + n.pageHeight >= n.$scrollableParentEl[0].scrollHeight) n.lastRepaintY = r;
		else return;
		let i = n.filteredItems || n.items, a, o, s = 0, c = 0;
		if (n.dynamicHeight || n.autoHeight) {
			let e = 0, t;
			n.maxBufferHeight = n.pageHeight;
			for (let i = 0; i < n.heights.length; i += 1) t = n.heights[i], a === void 0 && (e + t >= r - n.pageHeight * 2 * n.params.dynamicHeightBufferSize ? a = i : s += t), o === void 0 && ((e + t >= r + n.pageHeight * 2 * n.params.dynamicHeightBufferSize || i === n.heights.length - 1) && (o = i + 1), c += t), e += t;
			o = Math.min(o, i.length);
		} else a = (parseInt(r / n.params.height, 10) - n.rowsBefore) * n.params.cols, a < 0 && (a = 0), o = Math.min(a + n.rowsToRender * n.params.cols, i.length);
		let l, u = [];
		n.reachEnd = !1;
		let d;
		for (d = a; d < o; d += 1) {
			let e, t = n.items.indexOf(i[d]);
			d === a && (n.currentFromIndex = t), d === o - 1 && (n.currentToIndex = t), n.filteredItems ? n.items[t] === n.filteredItems[n.filteredItems.length - 1] && (n.reachEnd = !0) : t === n.items.length - 1 && (n.reachEnd = !0), n.params.renderExternal ? u.push(i[d]) : n.domCache[t] ? (e = n.domCache[t], e.f7VirtualListIndex = t) : (n.renderItem ? n.tempDomElement.innerHTML = n.renderItem(i[d], t).trim() : n.tempDomElement.innerHTML = i[d].toString().trim(), e = n.tempDomElement.childNodes[0], n.params.cache && (n.domCache[t] = e), e.f7VirtualListIndex = t), d === a && (l = n.dynamicHeight || n.autoHeight ? s : d * n.params.height / n.params.cols), n.params.renderExternal || (e.style.top = `${l}px`, n.emit("local::itemBeforeInsert vlItemBeforeInsert", n, e, i[d]), n.fragment.appendChild(e));
		}
		n.updatableScroll || (n.dynamicHeight || n.autoHeight ? n.itemsWrapEl.style.height = `${c}px` : n.itemsWrapEl.style.height = `${d * n.params.height / n.params.cols}px`), n.params.renderExternal ? i && i.length === 0 && (n.reachEnd = !0) : (n.emit("local::beforeClear vlBeforeClear", n, n.fragment), n.itemsWrapEl.innerHTML = "", n.emit("local::itemsBeforeInsert vlItemsBeforeInsert", n, n.fragment), i && i.length === 0 ? (n.reachEnd = !0, n.params.emptyTemplate && (n.itemsWrapEl.innerHTML = n.params.emptyTemplate)) : n.itemsWrapEl.appendChild(n.fragment), n.emit("local::itemsAfterInsert vlItemsAfterInsert", n, n.fragment)), t !== void 0 && e && n.$scrollableParentEl.scrollTop(t, 0), n.params.renderExternal && n.params.renderExternal(n, {
			fromIndex: a,
			toIndex: o,
			listHeight: n.listHeight,
			topPosition: l,
			items: u
		}), n.autoHeight && requestAnimationFrame(() => {
			n.setListSize(!0);
		});
	}
	filterItems(e, t) {
		t === void 0 && (t = !0);
		let n = this;
		n.filteredItems = [];
		for (let t = 0; t < e.length; t += 1) n.filteredItems.push(n.items[e[t]]);
		t && (n.$scrollableParentEl[0].scrollTop = 0), n.update();
	}
	resetFilter() {
		let e = this;
		e.params.showFilteredItemsOnly ? e.filteredItems = [] : (e.filteredItems = null, delete e.filteredItems), e.update();
	}
	scrollToItem(e) {
		let t = this;
		if (e > t.items.length) return !1;
		let n = 0;
		if (t.dynamicHeight || t.autoHeight) for (let r = 0; r < e; r += 1) n += t.heights[r];
		else n = e * t.params.height;
		let r = t.$el[0].offsetTop;
		return t.render(!0, r + n - parseInt(t.$scrollableParentEl.css("padding-top"), 10)), !0;
	}
	handleScroll() {
		this.render();
	}
	isVisible() {
		let e = this;
		return !!(e.el.offsetWidth || e.el.offsetHeight || e.el.getClientRects().length);
	}
	handleResize() {
		let e = this;
		e.isVisible() && (e.heightsCalculated = [], e.setListSize(), e.render(!0));
	}
	appendItems(e) {
		let t = this;
		for (let n = 0; n < e.length; n += 1) t.items.push(e[n]);
		t.update();
	}
	appendItem(e) {
		this.appendItems([e]);
	}
	replaceAllItems(e) {
		let t = this;
		t.items = e, delete t.filteredItems, t.domCache = {}, t.update();
	}
	replaceItem(e, t) {
		let n = this;
		n.items[e] = t, n.params.cache && delete n.domCache[e], n.update();
	}
	prependItems(e) {
		let t = this;
		for (let n = e.length - 1; n >= 0; --n) t.items.unshift(e[n]);
		if (t.params.cache) {
			let n = {};
			Object.keys(t.domCache).forEach((r) => {
				n[parseInt(r, 10) + e.length] = t.domCache[r];
			}), t.domCache = n;
		}
		t.update();
	}
	prependItem(e) {
		this.prependItems([e]);
	}
	moveItem(e, t) {
		let n = this, r = e, i = t;
		if (r === i) return;
		let a = n.items.splice(r, 1)[0];
		if (i >= n.items.length ? (n.items.push(a), i = n.items.length - 1) : n.items.splice(i, 0, a), n.params.cache) {
			let e = {};
			Object.keys(n.domCache).forEach((t) => {
				let a = parseInt(t, 10), o = r < i ? r : i, s = r < i ? i : r, c = r < i ? -1 : 1;
				(a < o || a > s) && (e[a] = n.domCache[a]), a === o && (e[s] = n.domCache[a]), a > o && a <= s && (e[a + c] = n.domCache[a]);
			}), n.domCache = e;
		}
		n.update();
	}
	insertItemBefore(e, t) {
		let n = this;
		if (e === 0) {
			n.prependItem(t);
			return;
		}
		if (e >= n.items.length) {
			n.appendItem(t);
			return;
		}
		if (n.items.splice(e, 0, t), n.params.cache) {
			let t = {};
			Object.keys(n.domCache).forEach((r) => {
				let i = parseInt(r, 10);
				i >= e && (t[i + 1] = n.domCache[i]);
			}), n.domCache = t;
		}
		n.update();
	}
	deleteItems(e) {
		let t = this, n, r = 0;
		for (let i = 0; i < e.length; i += 1) {
			let a = e[i];
			n !== void 0 && a > n && (r = -i), a += r, n = e[i];
			let o = t.items.splice(a, 1)[0];
			if (t.filteredItems && t.filteredItems.indexOf(o) >= 0 && t.filteredItems.splice(t.filteredItems.indexOf(o), 1), t.params.cache) {
				let e = {};
				Object.keys(t.domCache).forEach((n) => {
					let r = parseInt(n, 10);
					r === a ? delete t.domCache[a] : parseInt(n, 10) > a ? e[r - 1] = t.domCache[n] : e[r] = t.domCache[n];
				}), t.domCache = e;
			}
		}
		t.update();
	}
	deleteAllItems() {
		let e = this;
		e.items = [], delete e.filteredItems, e.params.cache && (e.domCache = {}), e.update();
	}
	deleteItem(e) {
		this.deleteItems([e]);
	}
	clearCache() {
		let e = this;
		e.domCache = {};
	}
	update(e) {
		let t = this;
		e && t.params.cache && (t.domCache = {}), t.heightsCalculated = [], t.setListSize(), t.render(!0);
	}
	init() {
		let e = this;
		e.attachEvents(), e.setListSize(), e.render();
	}
	destroy() {
		let e = this;
		e.detachEvents(), e.$el[0].f7VirtualList = null, delete e.$el[0].f7VirtualList, Ba(e), e = null;
	}
}, rc = {
	name: "virtualList",
	static: { VirtualList: nc },
	create() {
		let e = this;
		e.virtualList = ho({
			defaultSelector: ".virtual-list",
			constructor: nc,
			app: e,
			domProp: "f7VirtualList"
		});
	}
}, ic = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = {
			el: null,
			listEl: null,
			indexes: "auto",
			iosItemHeight: 14,
			mdItemHeight: 14,
			scrollList: !0,
			label: !1,
			renderItem(e, t) {
				return `
          <li>${e}</li>
        `.trim();
			},
			renderSkipPlaceholder() {
				return "<li class=\"list-index-skip-placeholder\"></li>";
			},
			on: {}
		};
		n.useModulesParams(r), n.params = J(r, t);
		let i, a, o, s;
		if (n.params.el) i = W(n.params.el);
		else return n;
		if (i[0].f7ListIndex) return i[0].f7ListIndex;
		if (s = i.find("ul"), s.length === 0 && (s = W("<ul></ul>"), i.append(s)), n.params.listEl && (a = W(n.params.listEl)), n.params.indexes === "auto" && !a) return n;
		a ? o = a.parents(".page-content").eq(0) : (o = i.siblings(".page-content").eq(0), o.length === 0 && (o = i.parents(".page").eq(0).find(".page-content").eq(0))), i[0].f7ListIndex = n, J(n, {
			app: e,
			$el: i,
			el: i && i[0],
			$ul: s,
			ul: s && s[0],
			$listEl: a,
			listEl: a && a[0],
			$pageContentEl: o,
			pageContentEl: o && o[0],
			indexes: t.indexes,
			height: 0,
			skipRate: 0
		}), n.useModules();
		function c() {
			let e = { index: n };
			n.calcSize(), e !== n.height && n.render();
		}
		function l(e) {
			let t = W(e.target).closest("li");
			if (!t.length) return;
			let r = t.index();
			if (n.skipRate > 0) {
				let e = r / (t.siblings("li").length - 1);
				r = Math.round((n.indexes.length - 1) * e);
			}
			let i = n.indexes[r];
			n.$el.trigger("listindex:click", {
				content: i,
				index: r
			}), n.emit("local::click listIndexClick", n, i, r), n.$el.trigger("listindex:select", {
				content: i,
				index: r
			}), n.emit("local::select listIndexSelect", n, i, r), n.$listEl && n.params.scrollList && n.scrollListToIndex(i, r);
		}
		let u = {}, d, f, p, m, h, g = null;
		function _(e) {
			let t = s.children();
			t.length && (p = t[0].getBoundingClientRect().top, m = t[t.length - 1].getBoundingClientRect().top + t[0].offsetHeight, u.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, u.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, d = !0, f = !1, g = null);
		}
		function v(e) {
			if (!d) return;
			!f && n.params.label && (h = W("<span class=\"list-index-label\"></span>"), i.append(h)), f = !0;
			let t = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
			e.preventDefault();
			let r = (t - p) / (m - p);
			r = Math.min(Math.max(r, 0), 1);
			let a = Math.round((n.indexes.length - 1) * r), o = n.indexes[a], s = m - p, c = (n.height - s) / 2 + (1 - r) * s;
			a !== g && (n.params.label && h.html(o).transform(`translateY(-${c}px)`), n.$listEl && n.params.scrollList && n.scrollListToIndex(o, a)), g = a, n.$el.trigger("listindex:select"), n.emit("local::select listIndexSelect", n, o, a);
		}
		function y() {
			d && (d = !1, f = !1, n.params.label && (h && h.remove(), h = void 0));
		}
		let b = Y().passiveListener ? { passive: !0 } : !1;
		return n.attachEvents = function() {
			i.parents(".tab").on("tab:show", c), i.parents(".page").on("page:reinit", c), i.parents(".panel").on("panel:open", c), i.parents(".sheet-modal, .actions-modal, .popup, .popover, .login-screen, .dialog, .toast").on("modal:open", c), e.on("resize", c), i.on("click", l), i.on(e.touchEvents.start, _, b), e.on("touchmove:active", v), e.on("touchend:passive", y);
		}, n.detachEvents = function() {
			i.parents(".tab").off("tab:show", c), i.parents(".page").off("page:reinit", c), i.parents(".panel").off("panel:open", c), i.parents(".sheet-modal, .actions-modal, .popup, .popover, .login-screen, .dialog, .toast").off("modal:open", c), e.off("resize", c), i.off("click", l), i.off(e.touchEvents.start, _, b), e.off("touchmove:active", v), e.off("touchend:passive", y);
		}, n.init(), n;
	}
	scrollListToIndex(e, t) {
		let n = this, { $listEl: r, $pageContentEl: i, app: a } = n;
		if (!r || !i || i.length === 0) return n;
		let o;
		if (r.find(".list-group-title").each((t) => {
			if (o) return;
			let n = W(t);
			n.text() === e && (o = n);
		}), !o || o.length === 0) return n;
		let s = o.parent().offset().top, c = parseInt(i.css("padding-top"), 10), l = i[0].scrollTop, u = o.offset().top;
		if (i.parents(".page-with-navbar-large").length) {
			let e = W(a.navbar.getElByPage(i.parents(".page-with-navbar-large").eq(0))).find(".title-large");
			e.length && (c -= e[0].offsetHeight || 0);
		}
		return s <= c ? i.scrollTop(s + l - c) : i.scrollTop(u + l - c), n;
	}
	renderSkipPlaceholder() {
		let e = this;
		return e.params.renderSkipPlaceholder.call(e);
	}
	renderItem(e, t) {
		let n = this;
		return n.params.renderItem.call(n, e, t);
	}
	render() {
		let e = this, { $ul: t, indexes: n, skipRate: r } = e, i, a = n.map((t, n) => {
			if (n % r !== 0 && r > 0) return i = !0, "";
			let a = e.renderItem(t, n);
			return i && (a = e.renderSkipPlaceholder() + a), i = !1, a;
		}).join("");
		return t.html(a), e;
	}
	calcSize() {
		let e = this, { app: t, params: n, el: r, indexes: i } = e, a = r.offsetHeight, o = Math.floor(a / n[`${t.theme}ItemHeight`]), s = i.length, c = 0;
		return s > o && (c = Math.ceil((s * 2 - 1) / o)), e.height = a, e.skipRate = c, e;
	}
	calcIndexes() {
		let e = this;
		return e.params.indexes === "auto" ? (e.indexes = [], e.$listEl.find(".list-group-title").each((t) => {
			let n = W(t).text();
			e.indexes.indexOf(n) < 0 && e.indexes.push(n);
		})) : e.indexes = e.params.indexes, e;
	}
	update() {
		let e = this;
		return e.calcIndexes(), e.calcSize(), e.render(), e;
	}
	init() {
		let e = this;
		e.calcIndexes(), e.calcSize(), e.render(), e.attachEvents();
	}
	destroy() {
		let e = this;
		e.$el.trigger("listindex:beforedestroy", e), e.emit("local::beforeDestroy listIndexBeforeDestroy"), e.detachEvents(), e.$el[0] && (e.$el[0].f7ListIndex = null, delete e.$el[0].f7ListIndex), Ba(e), e = null;
	}
}, ac = {
	name: "listIndex",
	static: { ListIndex: ic },
	create() {
		let e = this;
		e.listIndex = ho({
			defaultSelector: ".list-index",
			constructor: ic,
			app: e,
			domProp: "f7ListIndex"
		});
	},
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".list-index-init").each((e) => {
				let n = J(W(e).dataset(), { el: e });
				t.listIndex.create(n);
			});
		},
		tabBeforeRemove(e) {
			W(e).find(".list-index-init").each((e) => {
				e.f7ListIndex && e.f7ListIndex.destroy();
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".list-index-init").each((e) => {
				let n = J(W(e).dataset(), { el: e });
				t.listIndex.create(n);
			});
		},
		pageBeforeRemove(e) {
			e.$el.find(".list-index-init").each((e) => {
				e.f7ListIndex && e.f7ListIndex.destroy();
			});
		}
	},
	vnode: { "list-index-init": {
		insert(e) {
			let t = this, n = e.elm, r = J(W(n).dataset(), { el: n });
			t.listIndex.create(r);
		},
		destroy(e) {
			let t = e.elm;
			t.f7ListIndex && t.f7ListIndex.destroy();
		}
	} }
}, oc = { name: "timeline" }, sc = { show() {
	let e = this, t, n, r, i, a;
	var o = [...arguments];
	o.length === 1 && o[0] && o[0].constructor === Object ? (t = o[0].tabEl, n = o[0].tabLinkEl, r = o[0].animate, i = o[0].tabRoute, a = o[0].animatedInit) : ([t, n, r, i] = o, typeof o[1] == "boolean" && ([t, r, n, i] = o, o.length > 2 && n.constructor === Object && ([t, r, i, n] = o))), r === void 0 && (r = !0);
	let s = W(t);
	if (i && s[0] && (s[0].f7TabRoute = i), !a && (s.length === 0 || s.hasClass("tab-active"))) return {
		$newTabEl: s,
		newTabEl: s[0]
	};
	let c;
	n && (c = W(n));
	let l = s.parent(".tabs");
	if (l.length === 0) return {
		$newTabEl: s,
		newTabEl: s[0]
	};
	e.swipeout && (e.swipeout.allowOpen = !0);
	let u = [];
	function d(e) {
		u.push(e);
	}
	function f() {
		u.forEach((e) => {
			e();
		});
	}
	let p = !1;
	if (l.parent().hasClass("tabs-animated-wrap")) {
		l.parent()[r ? "removeClass" : "addClass"]("not-animated");
		let t = parseFloat(l.css("transition-duration").replace(",", "."));
		r && t && (l.transitionEnd(f), p = !0);
		let n = (e.rtl ? s.index() : -s.index()) * 100;
		l.transform(`translate3d(${n}%,0,0)`);
	}
	let m;
	if (l[0].nodeName.toLowerCase() === "swiper-container" && e.swiper) {
		m = l[0].swiper;
		let e = m.slides.indexOf(s[0]);
		m && m.activeIndex !== e ? (p = !0, m.once("slideChangeTransitionEnd", () => {
			f();
		}).slideTo(e, r ? void 0 : 0)) : m && m.animating && (p = !0, m.once("slideChangeTransitionEnd", () => {
			f();
		}));
	}
	let h = l.children(".tab-active");
	if (h.removeClass("tab-active"), !a && (!m || m && !m.animating || m && i) && (h.hasClass("view") && h.children(".page").length && h.children(".page").each((t) => {
		W(t).trigger("page:tabhide"), e.emit("pageTabHide", t);
	}), h.trigger("tab:hide"), e.emit("tabHide", h[0])), s.addClass("tab-active"), !a && (!m || m && !m.animating || m && i) && (s.hasClass("view") && s.children(".page").length && s.children(".page").each((t) => {
		W(t).trigger("page:tabshow"), e.emit("pageTabShow", t);
	}), s.trigger("tab:show"), e.emit("tabShow", s[0])), !c && (c = W(typeof t == "string" ? `.tab-link[href="${t}"]` : `.tab-link[href="#${s.attr("id")}"]`), (!c || c && c.length === 0) && W("[data-tab]").each((e) => {
		s.is(W(e).attr("data-tab")) && (c = W(e));
	}), i && (!c || c && c.length === 0) && (c = W(`[data-route-tab-id="${i.route.tab.id}"]`), c.length === 0 && (c = W(`.tab-link[href="${i.url}"]`))), c.length > 1 && s.parents(".page").length && (c = c.filter((e) => W(e).parents(".page")[0] === s.parents(".page")[0]), e.theme === "ios" && c.length === 0 && i))) {
		let t = s.parents(".page"), n = W(e.navbar.getElByPage(t));
		c = n.find(`[data-route-tab-id="${i.route.tab.id}"]`), c.length === 0 && (c = n.find(`.tab-link[href="${i.url}"]`));
	}
	if (c.length > 0) {
		let t;
		if (h && h.length > 0) {
			let e = h.attr("id");
			e && (t = W(`.tab-link[href="#${e}"]`), (!t || t && t.length === 0) && (t = W(`.tab-link[data-route-tab-id="${e}"]`))), (!t || t && t.length === 0) && W("[data-tab]").each((e) => {
				h.is(W(e).attr("data-tab")) && (t = W(e));
			}), (!t || t && t.length === 0) && (t = c.siblings(".tab-link-active"));
		} else i && (t = c.siblings(".tab-link-active"));
		if (t && t.length > 1 && h && h.parents(".page").length && (t = t.filter((e) => W(e).parents(".page")[0] === h.parents(".page")[0])), t && t.length > 0 && t.removeClass("tab-link-active"), c && c.length > 0) {
			c.addClass("tab-link-active");
			let t = c.parents(".tabbar, .tabbar-icons");
			e.toolbar && t.length > 0 && (t.hasClass("tabbar-highlight") || e.theme !== "ios") && e.toolbar.setHighlight(t);
		}
	}
	return {
		$newTabEl: s,
		newTabEl: s[0],
		$oldTabEl: h,
		oldTabEl: h[0],
		onTabsChanged: d,
		animated: p
	};
} }, cc = {
	name: "tabs",
	create() {
		let e = this;
		J(e, { tab: { show: sc.show.bind(e) } });
	},
	on: { "pageInit tabMounted": function(e) {
		let t = W(e.el || e).find(".tabs-animated-wrap > .tabs > .tab-active")[0];
		t && this.tab.show({
			tabEl: t,
			animatedInit: !0,
			animate: !1
		});
	} },
	clicks: { ".tab-link": function(e, t) {
		t === void 0 && (t = {}), (e.attr("href") && e.attr("href").indexOf("#") === 0 || e.attr("data-tab")) && this.tab.show({
			tabEl: t.tab || e.attr("href"),
			tabLinkEl: e,
			animate: t.animate
		});
	} }
};
//#endregion
//#region node_modules/framework7/components/panel/swipe-panel.js
function lc(e) {
	let t = e.app;
	if (e.swipeInitialized) return;
	J(e, {
		swipeable: !0,
		swipeInitialized: !0
	});
	let n = e.params, { $el: r, $backdropEl: i, side: a, effect: o } = e, s, c, l, u, d, f, p = {}, m, h, g, _, v, y, b, x = 0;
	function S(r) {
		if (!e.swipeable || l || !t.panel.allowOpen || !n.swipe && !n.swipeOnlyClose || c || W(".modal-in:not(.toast):not(.notification), .photo-browser-in").length > 0) return;
		s = t.panel.get(a === "left" ? "right" : "left") || {};
		let i = s.opened && s.$el && !s.$el.hasClass("panel-in-breakpoint");
		!e.opened && i || !n.swipeOnlyClose && i || r.target && r.target.nodeName.toLowerCase() === "input" && r.target.type === "range" || W(r.target).closest(".range-slider, swiper-container.tabs, .calendar-months, .no-swipe-panel, .card-opened").length > 0 || (p.x = r.type === "touchstart" ? r.targetTouches[0].pageX : r.pageX, p.y = r.type === "touchstart" ? r.targetTouches[0].pageY : r.pageY, !(n.swipeOnlyClose && !e.opened) && (n.swipeActiveArea && !e.opened && (a === "left" && p.x > n.swipeActiveArea || a === "right" && p.x < t.width - n.swipeActiveArea) || (x = 0, b = W(e.getViewEl()), u = !1, c = !0, d = void 0, f = !1, m = Ga(), y = void 0)));
	}
	function C(s) {
		if (!c || l || f || (x += 1, x < 2)) return;
		if (s.f7PreventSwipePanel || t.preventSwipePanelBySwipeBack || t.preventSwipePanel) {
			c = !1;
			return;
		}
		let m = s.type === "touchmove" ? s.targetTouches[0].pageX : s.pageX, S = s.type === "touchmove" ? s.targetTouches[0].pageY : s.pageY;
		if (d === void 0 && (d = !!(d || Math.abs(S - p.y) > Math.abs(m - p.x))), d) {
			c = !1;
			return;
		}
		if (!y) {
			if (y = m > p.x ? "to-right" : "to-left", n.swipeActiveArea > 0 && !e.opened) {
				if (a === "left" && p.x > n.swipeActiveArea) {
					c = !1;
					return;
				}
				if (a === "right" && p.x < t.width - n.swipeActiveArea) {
					c = !1;
					return;
				}
			}
			if (r.hasClass("panel-in-breakpoint")) {
				c = !1;
				return;
			}
			if (a === "left" && y === "to-left" && !r.hasClass("panel-in") || a === "right" && y === "to-right" && !r.hasClass("panel-in")) {
				c = !1;
				return;
			}
		}
		let C = e.opened ? 0 : -n.swipeThreshold;
		a === "right" && (C = -C), u || (e.opened || (e.insertToRoot(), r.addClass("panel-in-swipe"), i && i.css("visibility", "visible"), r.trigger("panel:swipeopen"), e.emit("local::swipeOpen panelSwipeOpen", e)), v = r[0].offsetWidth, o === "reveal" && r.hasClass("panel-in-collapsed") && (v -= parseFloat(b.css(`margin-${a}`))), r.transition(0)), u = !0, s.cancelable && s.preventDefault(), h = m - p.x + C;
		let T = o === "floating" ? 8 : 0;
		a === "right" ? o === "cover" || o === "push" || o === "floating" ? (g = h + (e.opened ? T : v), g < 0 - T && (g = -T), g > v && (g = v)) : (g = h - (e.opened ? v : 0), g > 0 && (g = 0), g < -v && (g = -v)) : (g = h + (e.opened ? v : T), g < 0 && (g = 0), g > v + T && (g = v + T));
		let E = Math.abs(g / v);
		if (o === "reveal") n.swipeNoFollow || (b.transform(`translate3d(${g}px,0,0)`).transition(0), i && i.transform(`translate3d(${g}px,0,0)`).transition(0)), r.trigger("panel:swipe", Math.abs(g / v)), e.emit("local::swipe panelSwipe", e, Math.abs(g / v));
		else {
			if (a === "left" && (g -= v), !n.swipeNoFollow && (_ = 1 - Math.abs(g / v), i && (i.transition(0), i.css({ opacity: _ })), r.transform(`translate3d(${g}px,0,0)`).transition(0), o === "push")) {
				let e = a === "left" ? g + v : g - v;
				b.transform(`translate3d(${e}px,0,0)`).transition(0), i && i.transform(`translate3d(${e}px,0,0)`).transition(0);
			}
			r.trigger("panel:swipe", Math.abs(g / v)), e.emit("local::swipe panelSwipe", e, Math.abs(g / v));
		}
		n.swipeNoFollow && (e.opened && E === 0 || !e.opened && E === 1) && (f = !0, w(s));
	}
	function w(t) {
		if (!c || !u) {
			c = !1, u = !1;
			return;
		}
		let s = t.type === "gesturestart" || l;
		c = !1, u = !1;
		let d = (/* @__PURE__ */ new Date()).getTime() - m, f, p = o === "floating" ? a === "left" ? 8 : -8 : 0, _ = (g === p || Math.abs(g) === v) && !n.swipeNoFollow, y = n.swipeThreshold || 0;
		f = s ? "reset" : e.opened ? o === "cover" || o === "push" || o === "floating" ? g === 0 ? "reset" : d < 300 && Math.abs(g) > 0 ? "swap" : d >= 300 && Math.abs(g) < v / 2 ? "reset" : "swap" : g === -v ? "reset" : d < 300 && Math.abs(g) >= 0 || d >= 300 && Math.abs(g) <= v / 2 ? a === "left" && g === v ? "reset" : "swap" : "reset" : Math.abs(h) < y ? "reset" : o === "cover" || o === "push" || o === "floating" ? g === 0 + p || d < 300 && Math.abs(g) > 0 || d >= 300 && Math.abs(g) < v / 2 ? "swap" : "reset" : g === 0 ? "reset" : d < 300 && Math.abs(g) > 0 || d >= 300 && Math.abs(g) >= v / 2 ? "swap" : "reset", f === "swap" && (e.opened ? e.close(!_) : e.open(!_));
		let x = !0;
		if (f === "reset" && !e.opened) if (_) r.removeClass("panel-in-swipe");
		else {
			x = !1;
			let t = o === "reveal" ? b : r;
			e.setStateClasses("before-closing"), t.transitionEnd(() => {
				r.hasClass("panel-in") || (r.removeClass("panel-in-swipe"), e.setStateClasses("after-closing"));
			});
		}
		(o === "reveal" || o === "push") && Wa(() => {
			b.transition(""), b.transform("");
		}), x && r.removeClass("panel-in-swipe"), r.transition("").transform(""), i && i.transform("").transition("").css({
			opacity: "",
			visibility: ""
		});
	}
	function T(e) {
		l = !0, w(e);
	}
	function E() {
		l = !1;
	}
	t.on("touchstart:passive", S), t.on("touchmove:active", C), t.on("touchend:passive", w), t.on("gesturestart", T), t.on("gestureend", E), e.on("panelDestroy", () => {
		t.off("touchstart:passive", S), t.off("touchmove:active", C), t.off("touchend:passive", w), t.off("gesturestart", T), t.off("gestureend", E);
	});
}
//#endregion
//#region node_modules/framework7/components/panel/resizable-panel.js
function uc(e) {
	let t = e.app, n = Y();
	if (e.resizableInitialized) return;
	J(e, {
		resizable: !0,
		resizableWidth: null,
		resizableInitialized: !0
	});
	let r = W("html"), { $el: i, $backdropEl: a, side: o, effect: s } = e;
	if (!i) return;
	let c, l, u = {}, d, f, p, m, h, g, _ = s !== "cover" && s !== "floating";
	function v(e) {
		if (!e) return null;
		if (e.indexOf("%") >= 0 || e.indexOf("vw") >= 0) return parseInt(e, 10) / 100 * t.width;
		let n = parseInt(e, 10);
		return Number.isNaN(n) ? null : n;
	}
	function y() {
		return e.resizable && i.hasClass("panel-resizable");
	}
	function b(e) {
		y() && (u.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, u.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, l = !1, c = !0, m = v(i.css("min-width")), h = v(i.css("max-width")), g = i.hasClass("panel-in-breakpoint"));
	}
	function x(n) {
		if (!c) return;
		let s = n.type === "touchmove" ? n.targetTouches[0].pageX : n.pageX;
		l || (f = i[0].offsetWidth, i.transition(0), i.addClass("panel-resizing"), r.css("cursor", "col-resize"), (_ || g) && (p = W(e.getViewEl()), e.$containerEl && e.$containerEl.hasClass("page") && p.add(e.$containerEl.children(".page-content, .tabs, .fab"))), _ && !g && (a.transition(0), p.transition(0))), l = !0, n.preventDefault(), d = s - u.x;
		let v = o === "left" ? f + d : f - d;
		m && !Number.isNaN(m) && (v = Math.max(v, m)), h && !Number.isNaN(h) && (v = Math.min(v, h)), v = Math.min(Math.max(v, 0), t.width), e.resizableWidth = v, i[0].style.width = `${v}px`, _ && !g ? (p && p.transform(`translate3d(${o === "left" ? v : -v}px, 0, 0)`), a && a.transform(`translate3d(${o === "left" ? v : -v}px, 0, 0)`)) : g && p && p.css(`margin-${o}`, `${v}px`), i.trigger("panel:resize", v), e.emit("local::resize panelResize", e, v);
	}
	function S() {
		if (W("html").css("cursor", ""), !c || !l) {
			c = !1, l = !1;
			return;
		}
		c = !1, l = !1, r[0].style.setProperty(`--f7-panel-${o}-width`, `${e.resizableWidth}px`), i[0].style.width = "", _ && !g && (p.transform(""), a.transform("")), i.removeClass("panel-resizing"), Wa(() => {
			i.transition(""), _ && (a.transition(""), p && p.transition(""));
		});
	}
	function C() {
		!e.opened || !e.resizableWidth || (m = v(i.css("min-width")), h = v(i.css("max-width")), m && !Number.isNaN(m) && e.resizableWidth < m && (e.resizableWidth = Math.max(e.resizableWidth, m)), h && !Number.isNaN(h) && e.resizableWidth > h && (e.resizableWidth = Math.min(e.resizableWidth, h)), e.resizableWidth = Math.min(Math.max(e.resizableWidth, 0), t.width), r[0].style.setProperty(`--f7-panel-${o}-width`, `${e.resizableWidth}px`));
	}
	e.$el.find(".panel-resize-handler").length === 0 && e.$el.append("<div class=\"panel-resize-handler\"></div>"), e.$resizeHandlerEl = e.$el.children(".panel-resize-handler"), i.addClass("panel-resizable");
	let w = n.passiveListener ? { passive: !0 } : !1;
	e.$el.on(t.touchEvents.start, ".panel-resize-handler", b, w), t.on("touchmove:active", x), t.on("touchend:passive", S), t.on("resize", C), e.on("beforeOpen", C), e.once("panelDestroy", () => {
		i.removeClass("panel-resizable"), e.$resizeHandlerEl.remove(), e.$el.off(t.touchEvents.start, ".panel-resize-handler", b, w), t.off("touchmove:active", x), t.off("touchend:passive", S), t.off("resize", C), e.off("beforeOpen", C);
	});
}
//#endregion
//#region node_modules/framework7/components/panel/panel-class.js
var dc = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {});
		let n = J({ on: {} }, e.params.panel, t);
		super(n, [e]);
		let r = this;
		r.params = n, r.$containerEl = r.params.containerEl ? W(r.params.containerEl).eq(0) : e.$el, r.containerEl = r.$containerEl[0], r.containerEl ||= (r.$containerEl = e.$el, e.$el[0]);
		let i;
		if (r.params.el ? i = W(r.params.el).eq(0) : r.params.content && (i = W(r.params.content).filter((e) => e.nodeType === 1).eq(0)), i.length === 0) return r;
		if (i[0].f7Panel) return i[0].f7Panel;
		i[0].f7Panel = r;
		let { side: a, effect: o, resizable: s } = r.params;
		a === void 0 && (a = i.hasClass("panel-left") ? "left" : "right"), o === void 0 && (o = i.hasClass("panel-cover") ? "cover" : i.hasClass("panel-push") ? "push" : i.hasClass("panel-floating") ? "floating" : "reveal"), s === void 0 && (s = i.hasClass("panel-resizable"));
		let c;
		return r.params.backdrop && r.params.backdropEl ? c = W(r.params.backdropEl) : r.params.backdrop && (c = r.$containerEl.children(".panel-backdrop"), c.length === 0 && (c = W("<div class=\"panel-backdrop\"></div>"), r.$containerEl.prepend(c))), J(r, {
			app: e,
			side: a,
			effect: o,
			resizable: s,
			$el: i,
			el: i[0],
			opened: !1,
			$backdropEl: c,
			backdropEl: c && c[0]
		}), r.useModules(), r.init(), r;
	}
	getViewEl() {
		let e = this, t;
		return t = e.$containerEl.children(".views").length > 0 ? e.$containerEl.children(".views")[0] : e.$containerEl.children(".view")[0], t;
	}
	setStateClasses(e) {
		let t = this, { side: n, el: r, effect: i } = t, a = t.getViewEl(), o = a && a.contains(r), s = !a || o ? t.$containerEl : W("html");
		e === "open" && s.addClass(`with-panel with-panel-${t.side}-${t.effect}`), e === "before-closing" && s.addClass("with-panel-closing"), e === "closing" && (s.addClass("with-panel-closing"), s.removeClass(`with-panel with-panel-${t.side}-${t.effect}`)), e === "after-closing" && s.removeClass("with-panel-closing"), e === "closed" && s.removeClass(`with-panel-${n}-${i}`);
	}
	enableVisibleBreakpoint() {
		let e = this;
		return e.visibleBreakpointDisabled = !1, e.setVisibleBreakpoint(), e;
	}
	disableVisibleBreakpoint() {
		let e = this;
		return e.visibleBreakpointDisabled = !0, e.setVisibleBreakpoint(), e;
	}
	toggleVisibleBreakpoint() {
		let e = this;
		return e.visibleBreakpointDisabled = !e.visibleBreakpointDisabled, e.setVisibleBreakpoint(), e;
	}
	setVisibleBreakpoint(e) {
		e === void 0 && (e = !0);
		let t = this, n = t.app;
		t.visibleBreakpointResizeHandler || (t.visibleBreakpointResizeHandler = function() {
			t.setVisibleBreakpoint();
		}, n.on("resize", t.visibleBreakpointResizeHandler));
		let { side: r, $el: i, $containerEl: a, params: o, visibleBreakpointDisabled: s } = t, c = o.visibleBreakpoint, l = W(t.getViewEl()), u = i.hasClass("panel-in-breakpoint");
		a && a.hasClass("page") && l.add(a.children(".page-content, .tabs, .fab")), n.width >= c && c != null && !s ? u ? l.css({ [`margin-${r}`]: `${i.width()}px` }) : (t.setStateClasses("closed"), i.addClass("panel-in-breakpoint").removeClass("panel-in panel-in-collapsed"), t.onOpen(!1), t.onOpened(), l.css({ [`margin-${r}`]: `${i.width()}px` }), n.allowPanelOpen = !0, e && (t.emit("local::breakpoint panelBreakpoint", t), t.$el.trigger("panel:breakpoint"))) : u && (i.removeClass("panel-in-breakpoint panel-in"), t.onClose(), t.onClosed(), l.css({ [`margin-${r}`]: "" }), e && (t.emit("local::breakpoint panelBreakpoint", t), t.$el.trigger("panel:breakpoint")));
	}
	enableCollapsedBreakpoint() {
		let e = this;
		return e.collapsedBreakpointDisabled = !1, e.setCollapsedBreakpoint(), e;
	}
	disableCollapsedBreakpoint() {
		let e = this;
		return e.collapsedBreakpointDisabled = !0, e.setCollapsedBreakpoint(), e;
	}
	toggleCollapsedBreakpoint() {
		let e = this;
		return e.collapsedBreakpointDisabled = !e.collapsedBreakpointDisabled, e.setCollapsedBreakpoint(), e;
	}
	setCollapsedBreakpoint(e) {
		e === void 0 && (e = !0);
		let t = this, n = t.app;
		t.collapsedBreakpointResizeHandler || (t.collapsedBreakpointResizeHandler = function() {
			t.setCollapsedBreakpoint();
		}, n.on("resize", t.collapsedBreakpointResizeHandler));
		let { $el: r, params: i, collapsedBreakpointDisabled: a } = t;
		if (r.hasClass("panel-in-breakpoint")) return;
		let o = i.collapsedBreakpoint, s = r.hasClass("panel-in-collapsed");
		n.width >= o && o != null && !a ? s || (t.setStateClasses("closed"), r.addClass("panel-in-collapsed").removeClass("panel-in"), t.collapsed = !0, n.allowPanelOpen = !0, e && (t.emit("local::collapsedBreakpoint panelCollapsedBreakpoint", t), t.$el.trigger("panel:collapsedbreakpoint"))) : s && (r.removeClass("panel-in-collapsed panel-in"), t.collapsed = !1, e && (t.emit("local::collapsedBreakpoint panelCollapsedBreakpoint", t), t.$el.trigger("panel:collapsedbreakpoint")));
	}
	enableResizable() {
		let e = this;
		return e.resizableInitialized ? (e.resizable = !0, e.$el.addClass("panel-resizable")) : uc(e), e;
	}
	disableResizable() {
		let e = this;
		return e.resizable = !1, e.$el.removeClass("panel-resizable"), e;
	}
	enableSwipe() {
		let e = this;
		return e.swipeInitialized ? e.swipeable = !0 : lc(e), e;
	}
	disableSwipe() {
		let e = this;
		return e.swipeable = !1, e;
	}
	onOpen(e) {
		e === void 0 && (e = !0);
		let t = this;
		t._openTransitionStarted = !1;
		let n = t.app;
		t.opened = !0, n.panel.allowOpen = !1, t.$el.trigger("panel:beforeopen"), t.emit("local::beforeOpen panelBeforeOpen", t), e && t.setStateClasses("open"), t.$el.trigger("panel:open"), t.emit("local::open panelOpen", t);
	}
	onOpened() {
		let e = this, t = e.app;
		t.panel.allowOpen = !0, e.$el.trigger("panel:opened"), e.emit("local::opened panelOpened", e);
	}
	onClose() {
		let e = this, t = e.app;
		e.opened = !1, t.panel.allowOpen = !1, e.$el.trigger("panel:beforeclose"), e.emit("local::beforeClose panelBeforeClose", e), e.setStateClasses("closing"), e.$el.trigger("panel:close"), e.emit("local::close panelClose", e);
	}
	onClosed() {
		let e = this, t = e.app;
		if (t.panel.allowOpen = !0, e.setStateClasses("after-closing"), e.$el.removeClass("panel-out"), e.$backdropEl) {
			let n = t.panel.get(".panel-in");
			(!n || n && !n.$backdropEl) && e.$backdropEl.removeClass("panel-backdrop-in");
		}
		e.$el.trigger("panel:closed"), e.emit("local::closed panelClosed", e);
	}
	toggle(e) {
		e === void 0 && (e = !0);
		let t = this, n = t.params.visibleBreakpoint;
		return t.app.width >= n && n != null ? t.toggleVisibleBreakpoint() : (t.opened ? t.close(e) : t.open(e), t);
	}
	insertToRoot() {
		let e = this, t = V(), { $el: n, $backdropEl: r, $containerEl: i } = e, a = n.parent(), o = n.parents(t).length > 0;
		if (!a.is(i) || n.prevAll(".views, .view").length) {
			let t = i.children(".panel, .views, .view").eq(0), s = i.children(".panel-backdrop").eq(0);
			t.length ? n.insertBefore(t) : s ? n.insertBefore(s) : i.prepend(n), r && r.length && (!r.parent().is(i) && r.nextAll(".panel").length === 0 || r.parent().is(i) && r.nextAll(".panel").length === 0) && r.insertBefore(n), e.once("panelClosed", () => {
				o ? a.append(n) : n.remove();
			});
		}
	}
	open(e) {
		e === void 0 && (e = !0);
		let t = this, n = t.app;
		if (!n.panel.allowOpen) return !1;
		let { effect: r, $el: i, $backdropEl: a, opened: o, $containerEl: s } = t;
		if (!i || i.hasClass("panel-in")) return t;
		if (t.insertToRoot(), o || i.hasClass("panel-in-breakpoint") || i.hasClass("panel-in")) return !1;
		let c = n.panel.get(".panel-in");
		c && c !== t && c.close(e), i[e ? "removeClass" : "addClass"]("not-animated"), i.addClass("panel-in"), a && (a.addClass("panel-backdrop-in"), a[e ? "removeClass" : "addClass"]("not-animated")), [
			"cover",
			"push",
			"floating"
		].includes(t.effect) && (t._clientLeft = i[0].clientLeft);
		let l = W(t.getViewEl());
		s && s.hasClass("page") && l.add(s.children(".page-content, .tabs"));
		let u = r === "reveal" ? l : i;
		function d() {
			u.transitionStart(() => {
				t._openTransitionStarted = !0;
			});
		}
		function f() {
			u.transitionEnd((e) => {
				W(e.target).is(u) ? i.hasClass("panel-out") ? t.onClosed() : t.onOpened() : f();
			});
		}
		return e ? (a && a.removeClass("not-animated"), d(), f(), i.removeClass("panel-out not-animated").addClass("panel-in"), t.onOpen()) : (a && a.addClass("not-animated"), i.removeClass("panel-out").addClass("panel-in not-animated"), t.onOpen(), t.onOpened(), t._openTransitionStarted = !0), !0;
	}
	close(e) {
		e === void 0 && (e = !0);
		let t = this, { effect: n, $el: r, $backdropEl: i, opened: a, $containerEl: o } = t;
		if (!a || r.hasClass("panel-in-breakpoint") || !r.hasClass("panel-in")) return t;
		r[e ? "removeClass" : "addClass"]("not-animated"), i && i[e ? "removeClass" : "addClass"]("not-animated");
		let s = W(t.getViewEl());
		o && o.hasClass("page") && s.add(o.children(".page-content, .tabs"));
		let c = n === "reveal" ? s : r;
		t._openTransitionStarted || (e = !1);
		function l() {
			r.hasClass("panel-out") ? t.onClosed() : r.hasClass("panel-in") && t.onOpened(), t.setStateClasses("after-closing");
		}
		return e ? (c.transitionEnd(() => {
			l();
		}), r.removeClass("panel-in").addClass("panel-out"), t.onClose()) : (r.addClass("not-animated").removeClass("panel-in").addClass("panel-out"), t.onClose(), t.onClosed()), t;
	}
	init() {
		let e = this;
		e.params.visibleBreakpoint !== void 0 && e.setVisibleBreakpoint(), e.params.collapsedBreakpoint !== void 0 && e.setCollapsedBreakpoint(), e.params.swipe && e.enableSwipe(), e.resizable && e.enableResizable();
	}
	destroy() {
		let e = this, t = e.app, { $containerEl: n } = e;
		if (e.$el) {
			if (e.emit("local::beforeDestroy panelBeforeDestroy", e), e.$el.trigger("panel:beforedestroy"), e.visibleBreakpointResizeHandler && t.off("resize", e.visibleBreakpointResizeHandler), e.collapsedBreakpointResizeHandler && t.off("resize", e.collapsedBreakpointResizeHandler), e.$el.hasClass("panel-in-breakpoint") || e.$el.hasClass("panel-in-collapsed")) {
				let t = W(e.getViewEl());
				n && n.hasClass("page") && t.add(n.children(".page-content, .tabs")), e.$el.removeClass("panel-in-breakpoint panel-in-collapsed panel-in"), t.css({ [`margin-${e.side}`]: "" }), e.emit("local::breakpoint panelBreakpoint", e), e.$el.trigger("panel:breakpoint");
			}
			e.$el.trigger("panel:destroy"), e.emit("local::destroy panelDestroy", e), e.el && (e.el.f7Panel = null, delete e.el.f7Panel), Ba(e), e = null;
		}
	}
}, fc = {
	name: "panel",
	params: { panel: {
		opened: void 0,
		side: void 0,
		effect: void 0,
		resizable: void 0,
		backdrop: !0,
		backdropEl: void 0,
		visibleBreakpoint: void 0,
		collapsedBreakpoint: void 0,
		swipe: !1,
		swipeNoFollow: !1,
		swipeOnlyClose: !1,
		swipeActiveArea: 0,
		swipeThreshold: 0,
		closeByBackdropClick: !0,
		containerEl: void 0
	} },
	static: { Panel: dc },
	create() {
		let e = this;
		J(e, { panel: {
			allowOpen: !0,
			create(t) {
				return new dc(e, t);
			},
			get(e) {
				if (e === void 0 && (e = ".panel"), e instanceof dc) return e;
				(e === "left" || e === "right") && (e = `.panel-${e}`);
				let t = W(e);
				if (!(t.length === 0 || t.length > 1)) return t[0].f7Panel;
			},
			destroy(t) {
				t === void 0 && (t = ".panel");
				let n = e.panel.get(t);
				if (n && n.destroy) return n.destroy();
			},
			open(t, n) {
				t === void 0 && (t = ".panel"), (t === "left" || t === "right") && (t = `.panel-${t}`);
				let r = e.panel.get(t);
				if (r && r.open) return r.open(n);
				if (!r) return r = e.panel.create({ el: t }), r.open(n);
			},
			close(t, n) {
				t === void 0 && (t = ".panel-in"), (t === "left" || t === "right") && (t = `.panel-${t}`);
				let r = e.panel.get(t);
				if (r && r.open) return r.close(n);
				if (!r) return r = e.panel.create({ el: t }), r.close(n);
			},
			toggle(t, n) {
				t === void 0 && (t = ".panel"), (t === "left" || t === "right") && (t = `.panel-${t}`);
				let r = e.panel.get(t);
				if (r && r.toggle) return r.toggle(n);
				if (!r) return r = e.panel.create({ el: t }), r.toggle(n);
			}
		} });
	},
	on: {
		init() {
			let e = this;
			W(".panel-init").each((t) => {
				let n = Object.assign({ el: t }, W(t).dataset() || {});
				e.panel.create(n);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".panel-init").each((e) => {
				let n = Object.assign({ el: e }, W(e).dataset() || {});
				t.panel.create(n);
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".panel-init").each((e) => {
				let n = t.panel.get(e);
				n && n.destroy && n.destroy();
			});
		}
	},
	vnode: { "panel-init": {
		insert(e) {
			let t = this, n = e.elm, r = Object.assign({ el: n }, W(n).dataset() || {});
			t.panel.create(r);
		},
		destroy(e) {
			let t = this, n = e.elm, r = t.panel.get(n);
			r && r.destroy && r.destroy();
		}
	} },
	clicks: {
		".panel-open": function(e, t) {
			t === void 0 && (t = {}), this.panel.open(t.panel, t.animate);
		},
		".panel-close": function(e, t) {
			t === void 0 && (t = {}), this.panel.close(t.panel, t.animate);
		},
		".panel-toggle": function(e, t) {
			t === void 0 && (t = {}), this.panel.toggle(t.panel, t.animate);
		},
		".panel-backdrop": function() {
			let e = this, t = W(".panel-in:not(.panel-out)");
			if (!t.length) return;
			let n = t[0] && t[0].f7Panel;
			t.trigger("panel:backdrop-click"), n && n.emit("backdropClick", n), e.emit("panelBackdropClick", n || t[0]), !(n && n.params.closeByBackdropClick === !1) && e.params.panel.closeByBackdropClick && e.panel.close();
		}
	}
}, pc = {
	open(e, t) {
		e === void 0 && (e = ".card-expandable"), t === void 0 && (t = !0);
		let n = this, r = X(), i = V(), a = Y(), o = W(e).eq(0);
		if (!o || !o.length || o.hasClass("card-opened") || o.hasClass("card-opening") || o.hasClass("card-closing")) return;
		let s = o.parents(".page").eq(0);
		if (!s.length || s.find(".card-opened").length) return;
		let c;
		function l() {
			c = !0;
		}
		if (o.trigger("card:beforeopen", { prevent: l }), n.emit("cardBeforeOpen", o[0], l), c) return;
		let u = Object.assign({ animate: t }, n.params.card, o.dataset()), d = o.parents(".page-content"), f;
		o.attr("data-backdrop-el") && (f = W(o.attr("data-backdrop-el"))), !f && u.backdrop && (f = d.find(".card-backdrop"), f.length || (f = W("<div class=\"card-backdrop\"></div>"), d.append(f)));
		let p, m;
		u.hideNavbarOnOpen && (p = s.children(".navbar"), p.length || s[0].f7Page && (p = s[0].f7Page.$navbarEl)), u.hideToolbarOnOpen && (m = s.children(".toolbar"), m.length || (m = s.parents(".view").children(".toolbar")), m.length || (m = s.parents(".views").children(".toolbar")));
		let h = o.css("transform"), g;
		h && h.match(/[2-9]/) && (g = !0);
		let _ = o.children(".card-content"), v = W(i.createElement("div")).addClass("card-expandable-size");
		o.append(v);
		let y = o[0].offsetWidth, b = o[0].offsetHeight, x = s[0].offsetWidth, S = s[0].offsetHeight, C = v[0].offsetWidth || x, w = v[0].offsetHeight || S, T;
		p && !u.hideStatusbarOnOpen && w === S && (T = parseInt(p.css("--f7-safe-area-top"), 10), Number.isNaN(T) && (T = 0)), T && (w -= T);
		let E = C / y, D = w / b, O = o.offset(), k = s.offset();
		T && (k.top += T / 2), O.left -= k.left;
		let A, j;
		if (g) {
			let e = h.replace(/matrix\(|\)/g, "").split(",").map((e) => e.trim());
			if (e && e.length > 1) {
				let t = parseFloat(e[0]);
				A = O.left - y * (1 - t) / 2, j = O.top - k.top - b * (1 - t) / 2, n.rtl && (A -= o[0].scrollLeft);
			} else A = o[0].offsetLeft, j = o[0].offsetTop - (d.length ? d[0].scrollTop : 0);
		} else A = O.left, j = O.top - k.top, n.rtl && (A -= o[0].scrollLeft);
		A -= (x - C) / 2, j -= (S - w) / 2;
		let M = C - y - A;
		n.rtl && ([A, M] = [M, A]);
		let N = w - b - j, P = (M - A) / 2, F = (N - j) / 2;
		u.hideNavbarOnOpen && p && p.length && (p.closest(".navbar-hidden").length ? o[0].f7KeepNavbarOnClose = !0 : (delete o[0].f7KeepNavbarOnClose, n.navbar.hide(p, u.animate, u.hideStatusbarOnOpen, !0))), u.hideToolbarOnOpen && m && m.length && (m.closest(".toolbar-hidden").length ? o[0].f7KeepToolbarOnClose = !0 : (delete o[0].f7KeepToolbarOnClose, n.toolbar.hide(m, u.animate))), f && f.removeClass("card-backdrop-out").addClass("card-backdrop-in"), o.removeClass("card-transitioning"), u.animate && o.addClass("card-opening"), o.trigger("card:open"), n.emit("cardOpen", o[0]);
		function ee() {
			s.addClass("page-with-card-opened"), r.ios && d.length && (d.css("height", `${d[0].offsetHeight + 1}px`), setTimeout(() => {
				d.css("height", "");
			})), o.addClass("card-opened"), o.removeClass("card-opening"), o.trigger("card:opened"), n.emit("cardOpened", o[0], s[0]);
		}
		_.css({
			width: `${C}px`,
			height: `${w}px`
		}).transform(`translate3d(${n.rtl ? A + P : -A - P}px, 0px, 0) scale(${1 / E}, ${1 / D})`), o.transform(`translate3d(${n.rtl ? -P : P}px, ${F}px, 0) scale(${E}, ${D})`), u.animate ? o.transitionEnd(() => {
			ee();
		}) : ee();
		function te() {
			o.removeClass("card-transitioning"), y = o[0].offsetWidth, b = o[0].offsetHeight, x = s[0].offsetWidth, S = s[0].offsetHeight, C = v[0].offsetWidth || x, w = v[0].offsetHeight || S, T = 0, p && !u.hideStatusbarOnOpen && w === S && (T = parseInt(p.css("--f7-safe-area-top"), 10), Number.isNaN(T) && (T = 0)), T && (w -= T), E = C / y, D = w / b, o.transform("translate3d(0px, 0px, 0) scale(1)"), O = o.offset(), k = s.offset(), T && (k.top += T / 2), O.left -= k.left, O.top -= k.top, A = O.left - (x - C) / 2, n.rtl && (A -= o[0].scrollLeft), j = O.top - (S - w) / 2, M = C - y - A, N = w - b - j, n.rtl && ([A, M] = [M, A]), P = (M - A) / 2, F = (N - j) / 2, o.transform(`translate3d(${n.rtl ? -P : P}px, ${F}px, 0) scale(${E}, ${D})`), _.css({
				width: `${C}px`,
				height: `${w}px`
			}).transform(`translate3d(${n.rtl ? A + P : -A - P}px, 0px, 0) scale(${1 / E}, ${1 / D})`);
		}
		let I, L, ne, re, ie, ae, oe, se, ce, le, ue, de;
		function fe(e) {
			!W(e.target).closest(o).length || !e.isTrusted || o.hasClass("card-opened") && (de = o.find(u.scrollableEl), I = de[0] && de[0] !== _[0] && !de[0].contains(e.target) ? 0 : de.scrollTop(), L = !0, re = e.targetTouches[0].pageX, ie = e.targetTouches[0].pageY, se = void 0, le = !1, ue = !1);
		}
		function pe(e) {
			if (!(!L || !e.isTrusted)) {
				if (ae = e.targetTouches[0].pageX, oe = e.targetTouches[0].pageY, se === void 0 && (se = !!(se || Math.abs(oe - ie) > Math.abs(ae - re))), !ue && !le && (!se && e.targetTouches[0].clientX <= 50 ? ue = !0 : le = !0), !(ue || le) || le && I !== 0) {
					L = !0, ne = !0;
					return;
				}
				ne || o.removeClass("card-transitioning"), ne = !0, ce = Math.max(le ? (oe - ie) / 150 : (ae - re) / (y / 2), 0), (ce > 0 && le || ue) && (le && r.ios && de[0] === _[0] && (de.css("-webkit-overflow-scrolling", "auto"), de.scrollTop(0)), e.preventDefault()), ce > 1 && (ce **= .3), ce > (le ? 1.3 : 1.1) ? (L = !1, ne = !1, n.card.close(o)) : o.transform(`translate3d(${n.rtl ? -P : P}px, ${F}px, 0) scale(${E * (1 - ce * .2)}, ${D * (1 - ce * .2)})`);
			}
		}
		function me(e) {
			!L || !ne || !e.isTrusted || (L = !1, ne = !1, r.ios && de.css("-webkit-overflow-scrolling", ""), ce >= .8 ? n.card.close(o) : o.addClass("card-transitioning").transform(`translate3d(${n.rtl ? -P : P}px, ${F}px, 0) scale(${E}, ${D})`));
		}
		o[0].detachEventHandlers = function() {
			n.off("resize", te), a.touch && u.swipeToClose && (n.off("touchstart:passive", fe), n.off("touchmove:active", pe), n.off("touchend:passive", me));
		}, n.on("resize", te), a.touch && u.swipeToClose && (n.on("touchstart:passive", fe), n.on("touchmove:active", pe), n.on("touchend:passive", me));
	},
	close(e, t) {
		e === void 0 && (e = ".card-expandable.card-opened"), t === void 0 && (t = !0);
		let n = this, r = X(), i = W(e).eq(0);
		if (!i || !i.length || !i.hasClass("card-opened") || i.hasClass("card-opening") || i.hasClass("card-closing")) return;
		let a = i.children(".card-content"), o = i.parents(".page-content"), s = i.parents(".page").eq(0);
		if (!s.length) return;
		let c = Object.assign({ animate: t }, n.params.card, i.dataset()), l = i.find(c.scrollableEl), u, d, f;
		i.attr("data-backdrop-el") && (f = W(i.attr("data-backdrop-el"))), c.backdrop && (f = i.parents(".page-content").find(".card-backdrop")), c.hideNavbarOnOpen && (u = s.children(".navbar"), u.length || s[0].f7Page && (u = s[0].f7Page.$navbarEl), u && u.length && !i[0].f7KeepNavbarOnClose && n.navbar.show(u, c.animate, !0)), c.hideToolbarOnOpen && (d = s.children(".toolbar"), d.length || (d = s.parents(".view").children(".toolbar")), d.length || (d = s.parents(".views").children(".toolbar")), d && d.length && !i[0].f7KeepToolbarOnClose && n.toolbar.show(d, c.animate)), s.removeClass("page-with-card-opened"), r.ios && o.length && (o.css("height", `${o[0].offsetHeight + 1}px`), setTimeout(() => {
			o.css("height", "");
		})), f && f.length && f.removeClass("card-backdrop-in").addClass("card-backdrop-out"), i.removeClass("card-opened card-transitioning"), c.animate ? i.addClass("card-closing") : i.addClass("card-no-transition"), i.transform(""), i.trigger("card:close"), n.emit("cardClose", i[0], s[0]);
		let p = i.hasClass("card-expandable-animate-width");
		function m() {
			p || a.css({
				width: "",
				height: ""
			}), f && f.length && f.removeClass("card-backdrop-in card-backdrop-out"), i.removeClass("card-closing card-no-transition"), i.trigger("card:closed"), i.find(".card-expandable-size").remove(), n.emit("cardClosed", i[0], s[0]);
		}
		p && a.css({
			width: "",
			height: ""
		}), a.transform("").scrollTop(0, t ? 300 : 0), l.length && l[0] !== a[0] && l.scrollTop(0, t ? 300 : 0), t ? a.transitionEnd(() => {
			m();
		}) : m(), i[0].detachEventHandlers && (i[0].detachEventHandlers(), delete i[0].detachEventHandlers);
	},
	toggle(e, t) {
		e === void 0 && (e = ".card-expandable");
		let n = this, r = W(e).eq(0);
		r.length && (r.hasClass("card-opened") ? n.card.close(r, t) : n.card.open(r, t));
	}
}, mc = {
	name: "card",
	params: { card: {
		hideNavbarOnOpen: !0,
		hideStatusbarOnOpen: !0,
		hideToolbarOnOpen: !0,
		scrollableEl: ".card-content",
		swipeToClose: !0,
		closeByBackdropClick: !0,
		backdrop: !0
	} },
	create() {
		ao(this, { card: pc });
	},
	on: { pageBeforeIn(e) {
		let t = this;
		if (t.params.card.hideNavbarOnOpen && e.navbarEl && e.$el.find(".card-opened.card-expandable").length && t.navbar.hide(e.navbarEl, !0, t.params.card.hideStatusbarOnOpen, !0), t.params.card.hideToolbarOnOpen && e.$el.find(".card-opened.card-expandable").length) {
			let n = e.$el.children(".toolbar");
			n.length || (n = e.$el.parents(".view").children(".toolbar")), n.length || (n = e.$el.parents(".views").children(".toolbar")), n && n.length && t.toolbar.hide(n);
		}
	} },
	clicks: {
		".card-close": function(e, t) {
			this.card.close(t.card, t.animate);
		},
		".card-open": function(e, t) {
			this.card.open(t.card, t.animate);
		},
		".card-expandable": function(e, t, n) {
			let r = this;
			e.hasClass("card-opened") || e.hasClass("card-opening") || e.hasClass("card-closing") || W(n.target).closest(".card-prevent-open, .card-close").length || r.card.open(e);
		},
		".card-backdrop-in": function() {
			let e = this, t = !1;
			e.params.card.closeByBackdropClick && (t = !0);
			let n = W(".card-opened");
			n.length && (n.attr("data-close-by-backdrop-click") === "true" ? t = !0 : n.attr("data-close-by-backdrop-click") === "false" && (t = !1), t && e.card.close(n));
		}
	}
}, hc = { name: "chip" }, gc = {
	store(e, t) {
		let n = this, r = H(), i = e, a = W(e);
		a.length && a.is("form") && a.attr("id") && (i = a.attr("id")), n.form.data[`form-${i}`] = t, r.localStorage[`f7form-${i}`] = JSON.stringify(t);
	},
	get(e) {
		let t = this, n = H(), r = e, i = W(e);
		if (i.length && i.is("form") && i.attr("id") && (r = i.attr("id")), n.localStorage[`f7form-${r}`]) return JSON.parse(n.localStorage[`f7form-${r}`]);
		if (t.form.data[`form-${r}`]) return t.form.data[`form-${r}`];
	},
	remove(e) {
		let t = this, n = H(), r = e, i = W(e);
		i.length && i.is("form") && i.attr("id") && (r = i.attr("id")), t.form.data[`form-${r}`] && (t.form.data[`form-${r}`] = "", delete t.form.data[`form-${r}`]), n.localStorage[`f7form-${r}`] && (n.localStorage[`f7form-${r}`] = "", n.localStorage.removeItem(`f7form-${r}`));
	}
}, _c = {
	init(e) {
		let t = this, n = W(e), r = n.attr("id");
		if (!r) return;
		let i = t.form.getFormData(r);
		i && t.form.fillFromData(n, i);
		function a() {
			let e = t.form.convertToData(n);
			e && (t.form.storeFormData(r, e), n.trigger("form:storedata", e), t.emit("formStoreData", n[0], e));
		}
		n.on("change submit", a);
	},
	destroy(e) {
		W(e).off("change submit");
	}
};
function vc(e) {
	let t = this, n = W(e).eq(0);
	if (n.length === 0) return;
	let r = {}, i = [
		"submit",
		"image",
		"button",
		"file"
	], a = [];
	return n.find("input, select, textarea").each((e) => {
		let t = W(e);
		if (t.hasClass("ignore-store-data") || t.hasClass("no-store-data")) return;
		let o = t.attr("name"), s = t.attr("type"), c = e.nodeName.toLowerCase();
		if (!(i.indexOf(s) >= 0) && !(a.indexOf(o) >= 0 || !o)) if (c === "select" && t.prop("multiple")) a.push(o), r[o] = [], n.find(`select[name="${o}"] option`).each((e) => {
			e.selected && r[o].push(e.value);
		});
		else switch (s) {
			case "checkbox":
				a.push(o), r[o] = [], n.find(`input[name="${o}"]`).each((e) => {
					e.checked && r[o].push(e.value);
				});
				break;
			case "radio":
				a.push(o), n.find(`input[name="${o}"]`).each((e) => {
					e.checked && (r[o] = e.value);
				});
				break;
			default:
				r[o] = t.val();
				break;
		}
	}), n.trigger("form:todata", r), t.emit("formToData", n[0], r), r;
}
function yc(e, t) {
	let n = this, r = W(e).eq(0);
	if (!r.length) return;
	let i = t, a = r.attr("id");
	if (!i && a && (i = n.form.getFormData(a)), !i) return;
	let o = [
		"submit",
		"image",
		"button",
		"file"
	], s = [];
	r.find("input, select, textarea").each((e) => {
		let t = W(e);
		if (t.hasClass("ignore-store-data") || t.hasClass("no-store-data")) return;
		let n = t.attr("name"), a = t.attr("type"), c = e.nodeName.toLowerCase();
		if (!(i[n] === void 0 || i[n] === null) && !(o.indexOf(a) >= 0) && !(s.indexOf(n) >= 0 || !n)) {
			if (c === "select" && t.prop("multiple")) s.push(n), r.find(`select[name="${n}"] option`).each((e) => {
				let t = e;
				i[n].indexOf(e.value) >= 0 ? t.selected = !0 : t.selected = !1;
			});
			else switch (a) {
				case "checkbox":
					s.push(n), r.find(`input[name="${n}"]`).each((e) => {
						let t = e;
						i[n].indexOf(e.value) >= 0 ? t.checked = !0 : t.checked = !1;
					});
					break;
				case "radio":
					s.push(n), r.find(`input[name="${n}"]`).each((e) => {
						let t = e;
						i[n] === e.value ? t.checked = !0 : t.checked = !1;
					});
					break;
				default:
					t.val(i[n]);
					break;
			}
			(c === "select" || c === "input" || c === "textarea") && t.trigger("change", "fromdata");
		}
	}), r.trigger("form:fromdata", i), n.emit("formFromData", r[0], i);
}
function bc() {
	let e = this, t = H(), n = V();
	function r(n, r) {
		let i = W(this);
		if (n.type === "change" && !i.hasClass("form-ajax-submit-onchange") || (n.type === "submit" && n.preventDefault(), n.type === "change" && r === "fromdata")) return;
		let a = (i.attr("method") || "GET").toUpperCase(), o = i.attr("enctype") || i.prop("enctype"), s = i.attr("action");
		if (!s) return;
		let c;
		a === "POST" ? o === "application/x-www-form-urlencoded" || o === "application/json" ? (c = e.form.convertToData(i[0]), o === "application/json" && (c = JSON.stringify(c))) : c = new t.FormData(i[0]) : (c = Ja(e.form.convertToData(i[0])), s.includes("?") ? s += `&${c}` : s += `?${c}`), i.trigger("formajax:beforesend", { data: c }), e.emit("formAjaxBeforeSend", i[0], c), fetch(s, {
			method: a,
			headers: { "Content-Type": o || "application/x-www-form-urlencoded" },
			...a === "POST" || a === "PUT" ? { body: c } : {}
		}).then((t) => {
			i.trigger("formajax:complete", {
				data: c,
				response: t
			}), e.emit("formAjaxComplete", i[0], c, t), i.trigger("formajax:success", {
				data: c,
				response: t
			}), e.emit("formAjaxSuccess", i[0], c, t);
		}).catch((t) => {
			i.trigger("formajax:error", {
				data: c,
				error: t
			}), e.emit("formAjaxError", i[0], c, t);
		});
	}
	W(n).on("submit change", "form.form-ajax-submit, form.form-ajax-submit-onchange", r);
}
var xc = {
	name: "form",
	create() {
		let e = this;
		J(e, { form: {
			data: {},
			storeFormData: gc.store.bind(e),
			getFormData: gc.get.bind(e),
			removeFormData: gc.remove.bind(e),
			convertToData: vc.bind(e),
			fillFromData: yc.bind(e),
			storage: {
				init: _c.init.bind(e),
				destroy: _c.destroy.bind(e)
			}
		} });
	},
	on: {
		init() {
			let e = this;
			bc.call(e);
		},
		tabBeforeRemove(e) {
			let t = this;
			W(e).find(".form-store-data").each((e) => {
				t.form.storage.destroy(e);
			});
		},
		tabMounted(e) {
			let t = this;
			W(e).find(".form-store-data").each((e) => {
				t.form.storage.init(e);
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".form-store-data").each((e) => {
				t.form.storage.destroy(e);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".form-store-data").each((e) => {
				t.form.storage.init(e);
			});
		}
	}
}, Sc = {
	ignoreTypes: [
		"checkbox",
		"button",
		"submit",
		"range",
		"radio",
		"image"
	],
	createTextareaResizableShadow() {
		let e = W(V().createElement("textarea"));
		e.addClass("textarea-resizable-shadow"), e.prop({
			disabled: !0,
			readonly: !0
		}), Sc.textareaResizableShadow = e;
	},
	textareaResizableShadow: void 0,
	resizeTextarea(e) {
		let t = this, n = H(), r = W(e);
		Sc.textareaResizableShadow || Sc.createTextareaResizableShadow();
		let i = Sc.textareaResizableShadow;
		if (!r.length || !r.hasClass("resizable")) return;
		Sc.textareaResizableShadow.parents().length === 0 && t.$el.append(i);
		let a = n.getComputedStyle(r[0]);
		"padding-top padding-bottom padding-left padding-right margin-left margin-right margin-top margin-bottom width font-size font-family font-style font-weight line-height font-variant text-transform letter-spacing border box-sizing display".split(" ").forEach((e) => {
			let t = a[e];
			"font-size line-height letter-spacing width".split(" ").indexOf(e) >= 0 && (t = t.replace(",", ".")), i.css(e, t);
		});
		let o = r[0].clientHeight;
		i.val("");
		let s = i[0].scrollHeight;
		i.val(r.val()), i.css("height", 0);
		let c = i[0].scrollHeight;
		o !== c && (c > s ? r.css("height", `${c}px`) : c < o && r.css("height", ""), (c > s || c < o) && (r.trigger("textarea:resize", {
			initialHeight: s,
			currentHeight: o,
			scrollHeight: c
		}), t.emit("textareaResize", {
			initialHeight: s,
			currentHeight: o,
			scrollHeight: c
		})));
	},
	validate(e) {
		let t = W(e);
		if (!t.length) return !0;
		let n = t.parents(".item-input"), r = t.parents(".input");
		function i() {
			t[0].f7ValidateReadonly && (t[0].readOnly = !1);
		}
		function a() {
			t[0].f7ValidateReadonly && (t[0].readOnly = !0);
		}
		i();
		let o = t[0].validity, s = t.dataset().errorMessage || t[0].validationMessage || "";
		if (!o) return a(), !0;
		if (!o.valid) {
			let e = t.nextAll(".item-input-error-message, .input-error-message");
			return s && (e.length === 0 && (e = W(`<div class="${r.length ? "input-error-message" : "item-input-error-message"}"></div>`), e.insertAfter(t)), e.text(s)), e.length > 0 && (n.addClass("item-input-with-error-message"), r.addClass("input-with-error-message")), n.addClass("item-input-invalid"), r.addClass("input-invalid"), t.addClass("input-invalid"), a(), !1;
		}
		return n.removeClass("item-input-invalid item-input-with-error-message"), r.removeClass("input-invalid input-with-error-message"), t.removeClass("input-invalid"), a(), !0;
	},
	validateInputs(e) {
		let t = this;
		return W(e).find("input, textarea, select").map((e) => t.input.validate(e)).indexOf(!1) < 0;
	},
	focus(e) {
		let t = W(e), n = t.attr("type");
		Sc.ignoreTypes.indexOf(n) >= 0 || (t.parents(".item-input").addClass("item-input-focused"), t.parents(".input").addClass("input-focused"), t.addClass("input-focused"));
	},
	blur(e) {
		let t = W(e);
		t.parents(".item-input").removeClass("item-input-focused"), t.parents(".input").removeClass("input-focused"), t.removeClass("input-focused");
	},
	checkEmptyState(e) {
		let t = this, n = W(e);
		if (n.is("input, select, textarea, .item-input [contenteditable]") || (n = n.find("input, select, textarea, .item-input [contenteditable]").eq(0)), !n.length) return;
		let r = n[0].hasAttribute("contenteditable"), i;
		i = r ? n.find(".text-editor-placeholder").length ? "" : n.html() : n.val();
		let a = n.parents(".item-input"), o = n.parents(".input");
		i && typeof i == "string" && i.trim() !== "" || Array.isArray(i) && i.length > 0 ? (a.addClass("item-input-with-value"), o.addClass("input-with-value"), n.addClass("input-with-value"), n.trigger("input:notempty"), t.emit("inputNotEmpty", n[0])) : (a.removeClass("item-input-with-value"), o.removeClass("input-with-value"), n.removeClass("input-with-value"), n.trigger("input:empty"), t.emit("inputEmpty", n[0]));
	},
	scrollIntoView(e, t, n, r) {
		t === void 0 && (t = 0);
		let i = W(e), a = i.parents(".page-content, .panel, .card-expandable .card-content").eq(0);
		if (!a.length) return !1;
		let o = a[0].offsetHeight, s = a[0].scrollTop, c = parseInt(a.css("padding-top"), 10), l = parseInt(a.css("padding-bottom"), 10), u = a.offset().top - s, d = i.offset().top - u, f = i[0].offsetHeight, p = d + s - c, m = d + s - o + l + f, h = p + (m - p) / 2;
		return s > p ? (a.scrollTop(n ? h : p, t), !0) : s < m ? (a.scrollTop(n ? h : m, t), !0) : (r && a.scrollTop(n ? h : m, t), !1);
	},
	init() {
		let e = this, t = X(), n = H(), r = V();
		Sc.createTextareaResizableShadow();
		function i() {
			let i = this;
			e.params.input.scrollIntoViewOnFocus && (t.android ? W(n).once("resize", () => {
				r && r.activeElement === i && e.input.scrollIntoView(i, e.params.input.scrollIntoViewDuration, e.params.input.scrollIntoViewCentered, e.params.input.scrollIntoViewAlways);
			}) : e.input.scrollIntoView(i, e.params.input.scrollIntoViewDuration, e.params.input.scrollIntoViewCentered, e.params.input.scrollIntoViewAlways)), e.input.focus(i);
		}
		function a() {
			let t = W(this), n = t[0].nodeName.toLowerCase();
			e.input.blur(t), (t.dataset().validate || t.attr("validate") !== null || t.attr("data-validate-on-blur") !== null) && e.input.validate(t), n === "textarea" && t.hasClass("resizable") && Sc.textareaResizableShadow && Sc.textareaResizableShadow.remove();
		}
		function o() {
			let t = W(this), n = t.attr("type"), r = t[0].nodeName.toLowerCase(), i = t[0].hasAttribute("contenteditable");
			Sc.ignoreTypes.indexOf(n) >= 0 || (e.input.checkEmptyState(t), !i && (t.attr("data-validate-on-blur") === null && (t.dataset().validate || t.attr("validate") !== null) && e.input.validate(t), r === "textarea" && t.hasClass("resizable") && e.input.resizeTextarea(t)));
		}
		function s(t) {
			let n = W(this);
			n.attr("data-validate-on-blur") === null && (n.dataset().validate || n.attr("validate") !== null) && (t.preventDefault(), e.input.validate(n));
		}
		function c() {
			let t = W(this).siblings("input, textarea").eq(0), n = t.val();
			t.val("").trigger("input change").focus().trigger("input:clear", n), e.emit("inputClear", n);
		}
		function l(e) {
			e.preventDefault();
		}
		W(r).on("click", ".input-clear-button", c), W(r).on("mousedown", ".input-clear-button", l), W(r).on("change input", "input, textarea, select, .item-input [contenteditable]", o, !0), W(r).on("focus", "input, textarea, select, .item-input [contenteditable]", i, !0), W(r).on("blur", "input, textarea, select, .item-input [contenteditable]", a, !0), W(r).on("invalid", "input, textarea, select", s, !0);
	}
}, Cc = {
	name: "input",
	params: { input: {
		scrollIntoViewOnFocus: void 0,
		scrollIntoViewCentered: !1,
		scrollIntoViewDuration: 0,
		scrollIntoViewAlways: !1
	} },
	create() {
		let e = this;
		e.params.input.scrollIntoViewOnFocus === void 0 && (e.params.input.scrollIntoViewOnFocus = X().android), ao(e, { input: Sc });
	},
	on: {
		init() {
			this.input.init();
		},
		tabMounted(e) {
			let t = this, n = W(e);
			n.find(".item-input, .input").each((e) => {
				W(e).find("input, select, textarea, [contenteditable]").each((e) => {
					let n = W(e);
					Sc.ignoreTypes.indexOf(n.attr("type")) >= 0 || t.input.checkEmptyState(n);
				});
			}), n.find("textarea.resizable").each((e) => {
				t.input.resizeTextarea(e);
			});
		},
		pageInit(e) {
			let t = this, n = e.$el;
			n.find(".item-input, .input").each((e) => {
				W(e).find("input, select, textarea, [contenteditable]").each((e) => {
					let n = W(e);
					Sc.ignoreTypes.indexOf(n.attr("type")) >= 0 || t.input.checkEmptyState(n);
				});
			}), n.find("textarea.resizable").each((e) => {
				t.input.resizeTextarea(e);
			});
		},
		"panelBreakpoint panelCollapsedBreakpoint panelResize panelOpen panelSwipeOpen resize viewMasterDetailBreakpoint": function(e) {
			let t = this;
			e && e.$el ? e.$el.find("textarea.resizable").each((e) => {
				t.input.resizeTextarea(e);
			}) : W("textarea.resizable").each((e) => {
				t.input.resizeTextarea(e);
			});
		}
	}
}, wc = { name: "checkbox" }, Tc = { name: "radio" }, Ec = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = Y(), i = {};
		n.useModulesParams(i), n.params = J(i, t);
		let a = n.params.el;
		if (!a) return n;
		let o = W(a);
		if (o.length === 0) return n;
		if (o[0].f7Toggle) return o[0].f7Toggle;
		let s = o.children("input[type=\"checkbox\"]");
		J(n, {
			app: e,
			$el: o,
			el: o[0],
			$inputEl: s,
			inputEl: s[0],
			disabled: o.hasClass("disabled") || s.hasClass("disabled") || s.attr("disabled") || s[0].disabled
		}), Object.defineProperty(n, "checked", {
			enumerable: !0,
			configurable: !0,
			set(e) {
				!n || n.$inputEl === void 0 || n.checked !== e && (s[0].checked = e, n.$inputEl.trigger("change"));
			},
			get() {
				return s[0].checked;
			}
		}), o[0].f7Toggle = n;
		let c, l = {}, u, d, f, p, m;
		function h(e) {
			c || n.disabled || (l.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, l.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, d = 0, c = !0, u = void 0, p = Ga(), m = n.checked, f = o[0].offsetWidth, Ua(() => {
				c && o.addClass("toggle-active-state");
			}));
		}
		function g(t) {
			if (!c || n.disabled) return;
			let r = t.type === "touchmove" ? t.targetTouches[0].pageX : t.pageX, i = t.type === "touchmove" ? t.targetTouches[0].pageY : t.pageY, a = e.rtl ? -1 : 1;
			if (u === void 0 && (u = !!(u || Math.abs(i - l.y) > Math.abs(r - l.x))), u) {
				c = !1;
				return;
			}
			t.preventDefault(), d = r - l.x;
			let o;
			d * a < 0 && Math.abs(d) > f / 3 && m && (o = !0), d * a > 0 && Math.abs(d) > f / 3 && !m && (o = !0), o && (l.x = r, n.checked = !m, m = !m);
		}
		function _() {
			if (!c || n.disabled) {
				u && o.removeClass("toggle-active-state"), c = !1;
				return;
			}
			let t = e.rtl ? -1 : 1;
			c = !1, o.removeClass("toggle-active-state");
			let r;
			Ga() - p < 300 && (d * t < 0 && m && (r = !0), d * t > 0 && !m && (r = !0), r && (n.checked = !m));
		}
		function v() {
			n.$el.trigger("toggle:change"), n.emit("local::change toggleChange", n);
		}
		n.attachEvents = function() {
			let t = r.passiveListener ? { passive: !0 } : !1;
			o.on(e.touchEvents.start, h, t), e.on("touchmove", g), e.on("touchend:passive", _), n.$inputEl.on("change", v);
		}, n.detachEvents = function() {
			let t = r.passiveListener ? { passive: !0 } : !1;
			o.off(e.touchEvents.start, h, t), e.off("touchmove", g), e.off("touchend:passive", _), n.$inputEl.off("change", v);
		}, n.useModules(), n.init();
	}
	toggle() {
		let e = this;
		e.checked = !e.checked;
	}
	init() {
		this.attachEvents();
	}
	destroy() {
		let e = this;
		e.$el.trigger("toggle:beforedestroy"), e.emit("local::beforeDestroy toggleBeforeDestroy", e), delete e.$el[0].f7Toggle, e.detachEvents(), Ba(e), e = null;
	}
}, Dc = {
	name: "toggle",
	create() {
		let e = this;
		e.toggle = ho({
			defaultSelector: ".toggle",
			constructor: Ec,
			app: e,
			domProp: "f7Toggle"
		});
	},
	static: { Toggle: Ec },
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".toggle-init").each((e) => t.toggle.create({ el: e }));
		},
		tabBeforeRemove(e) {
			W(e).find(".toggle-init").each((e) => {
				e.f7Toggle && e.f7Toggle.destroy();
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".toggle-init").each((e) => t.toggle.create({ el: e }));
		},
		pageBeforeRemove(e) {
			e.$el.find(".toggle-init").each((e) => {
				e.f7Toggle && e.f7Toggle.destroy();
			});
		}
	},
	vnode: { "toggle-init": {
		insert(e) {
			let t = this, n = e.elm;
			t.toggle.create({ el: n });
		},
		destroy(e) {
			let t = e.elm;
			t.f7Toggle && t.f7Toggle.destroy();
		}
	} }
}, Oc = class extends Z {
	constructor(e, t) {
		super(t, [e]);
		let n = this, r = Y(), i = {
			el: null,
			inputEl: null,
			dual: !1,
			step: 1,
			label: !1,
			min: 0,
			max: 100,
			value: 0,
			draggableBar: !0,
			vertical: !1,
			verticalReversed: !1,
			formatLabel: null,
			scale: !1,
			scaleSteps: 5,
			scaleSubSteps: 0,
			formatScaleLabel: null,
			limitKnobPosition: e.theme === "ios"
		};
		n.useModulesParams(i), n.params = J(i, t);
		let a = n.params.el;
		if (!a) return n;
		let o = W(a);
		if (o.length === 0) return n;
		if (o[0].f7Range) return o[0].f7Range;
		let s = o.dataset();
		"step min max value scaleSteps scaleSubSteps".split(" ").forEach((e) => {
			t[e] === void 0 && s[e] !== void 0 && (n.params[e] = parseFloat(s[e]));
		}), "dual label vertical verticalReversed scale".split(" ").forEach((e) => {
			t[e] === void 0 && s[e] !== void 0 && (n.params[e] = s[e]);
		}), n.params.value || (s.value !== void 0 && (n.params.value = s.value), s.valueLeft !== void 0 && s.valueRight !== void 0 && (n.params.value = [parseFloat(s.valueLeft), parseFloat(s.valueRight)]));
		let c;
		n.params.dual || (n.params.inputEl ? c = W(n.params.inputEl) : o.find("input[type=\"range\"]").length && (c = o.find("input[type=\"range\"]").eq(0)));
		let { dual: l, step: u, label: d, min: f, max: p, value: m, vertical: h, verticalReversed: g, scale: _, scaleSteps: v, scaleSubSteps: y, limitKnobPosition: b } = n.params;
		J(n, {
			app: e,
			$el: o,
			el: o[0],
			$inputEl: c,
			inputEl: c ? c[0] : void 0,
			dual: l,
			step: u,
			label: d,
			min: f,
			max: p,
			value: m,
			previousValue: m,
			vertical: h,
			verticalReversed: g,
			scale: _,
			scaleSteps: v,
			scaleSubSteps: y,
			limitKnobPosition: b
		}), c && ("step min max".split(" ").forEach((e) => {
			!t[e] && c.attr(e) && (n.params[e] = parseFloat(c.attr(e)), n[e] = parseFloat(c.attr(e)));
		}), c.val() !== void 0 && (n.params.value = parseFloat(c.val()), n.value = parseFloat(c.val()))), n.dual && o.addClass("range-slider-dual"), n.label && o.addClass("range-slider-label"), n.vertical ? (o.addClass("range-slider-vertical"), n.verticalReversed && o.addClass("range-slider-vertical-reversed")) : o.addClass("range-slider-horizontal");
		let x = W("<div class=\"range-bar\"></div>"), S = W("<div class=\"range-bar-active\"></div>");
		x.append(S);
		let C = `
      <div class="range-knob-wrap">
        <div class="range-knob"></div>
        ${n.label ? "<div class=\"range-knob-label\"></div>" : ""}
      </div>
    `, w = [W(C)];
		n.dual && w.push(W(C)), o.append(x), w.forEach((e) => {
			o.append(e);
		});
		let T = [];
		n.label && (T.push(w[0].find(".range-knob-label")), n.dual && T.push(w[1].find(".range-knob-label")));
		let E;
		n.scale && n.scaleSteps >= 1 && (E = W(`
        <div class="range-scale">
          ${n.renderScale()}
        </div>
      `), o.append(E)), J(n, {
			knobs: w,
			labels: T,
			$barEl: x,
			$barActiveEl: S,
			$scaleEl: E
		}), o[0].f7Range = n;
		let D, O = {}, k, A, j, M, N, P, F, ee;
		function te() {
			F = !0;
		}
		function I(e) {
			if (D || !n.params.draggableBar && W(e.target).closest(".range-knob").length === 0) return;
			F = !1, O.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, O.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, e.type === "touchstart" && (ee = e.targetTouches[0].identifier), D = !0, k = void 0, A = o.offset(), j = A.left, M = A.top;
			let t;
			n.vertical ? (t = (O.y - M) / n.rangeHeight, n.verticalReversed || (t = 1 - t)) : t = n.app.rtl ? (j + n.rangeWidth - O.x) / n.rangeWidth : (O.x - j) / n.rangeWidth;
			let r = t * (n.max - n.min) + n.min;
			n.dual ? Math.abs(n.value[0] - r) < Math.abs(n.value[1] - r) ? (P = 0, N = n.knobs[0], r = [r, n.value[1]]) : (P = 1, N = n.knobs[1], r = [n.value[0], r]) : (N = n.knobs[0], r = t * (n.max - n.min) + n.min), Ua(() => {
				D && N.addClass("range-knob-active-state");
			}, 70), n.on("change", te), n.setValue(r, !0);
		}
		function L(e) {
			if (!D) return;
			let t, r;
			if (e.type === "touchmove") for (let n = 0; n < e.targetTouches.length; n += 1) e.targetTouches[n].identifier === ee && (t = e.targetTouches[n].pageX, r = e.targetTouches[n].pageY);
			else t = e.pageX, r = e.pageY;
			if (t === void 0 && r === void 0) return;
			if (k === void 0 && !n.vertical && (k = !!(k || Math.abs(r - O.y) > Math.abs(t - O.x))), k) {
				D = !1;
				return;
			}
			e.preventDefault();
			let i;
			n.vertical ? (i = (r - M) / n.rangeHeight, n.verticalReversed || (i = 1 - i)) : i = n.app.rtl ? (j + n.rangeWidth - t) / n.rangeWidth : (t - j) / n.rangeWidth;
			let a = i * (n.max - n.min) + n.min;
			if (n.dual) {
				let e, t;
				P === 0 ? (e = a, t = n.value[1], e > t && (t = e)) : (e = n.value[0], t = a, t < e && (e = t)), a = [e, t];
			}
			n.setValue(a, !0);
		}
		function ne(e) {
			if (e.type === "touchend") {
				let t;
				for (let n = 0; n < e.changedTouches.length; n += 1) e.changedTouches[n].identifier === ee && (t = !0);
				if (!t) return;
			}
			if (!D) {
				k && N.removeClass("range-knob-active-state"), D = !1;
				return;
			}
			n.off("change", te), D = !1, N.removeClass("range-knob-active-state"), F && n.$inputEl && !n.dual && n.$inputEl.trigger("change"), F = !1, n.previousValue !== void 0 && (n.dual && (n.previousValue[0] !== n.value[0] || n.previousValue[1] !== n.value[1]) || !n.dual && n.previousValue !== n.value) && (n.$el.trigger("range:changed", n.value), n.emit("local::changed rangeChanged", n, n.value));
		}
		function re() {
			n.calcSize(), n.layout();
		}
		let ie, ae, oe;
		return n.attachEvents = function() {
			let t = r.passiveListener ? { passive: !0 } : !1;
			n.$el.on(e.touchEvents.start, I, t), e.on("touchmove", L), e.on("touchend:passive", ne), e.on("tabShow", re), e.on("resize", re), ie = n.$el.parents(".sheet-modal, .actions-modal, .popup, .popover, .login-screen, .dialog, .toast"), ie.on("modal:open", re), ae = n.$el.parents(".panel"), ae.on("panel:open panel:resize", re), oe = n.$el.parents(".page").eq(0), oe.on("page:reinit", re);
		}, n.detachEvents = function() {
			let t = r.passiveListener ? { passive: !0 } : !1;
			n.$el.off(e.touchEvents.start, I, t), e.off("touchmove", L), e.off("touchend:passive", ne), e.off("tabShow", re), e.off("resize", re), ie && ie.off("modal:open", re), ae && ae.off("panel:open panel:resize", re), oe && oe.off("page:reinit", re), ie = null, ae = null, oe = null;
		}, n.useModules(), n.init(), n;
	}
	calcSize() {
		let e = this;
		if (e.vertical) {
			let t = e.$el.outerHeight();
			if (t === 0) return;
			e.rangeHeight = t, e.knobHeight = e.knobs[0].outerHeight();
		} else {
			let t = e.$el.outerWidth();
			if (t === 0) return;
			e.rangeWidth = t, e.knobWidth = e.knobs[0].outerWidth();
		}
	}
	layout() {
		let e = this, { app: t, knobWidth: n, knobHeight: r, rangeWidth: i, rangeHeight: a, min: o, max: s, knobs: c, $barActiveEl: l, value: u, label: d, labels: f, vertical: p, verticalReversed: m, limitKnobPosition: h } = e, g = p ? r : n, _ = p ? a : i, v = p ? m ? "top" : "bottom" : t.rtl ? "right" : "left";
		if (e.dual) {
			let t = [(u[0] - o) / (s - o), (u[1] - o) / (s - o)];
			l.css({
				[v]: `${t[0] * 100}%`,
				[p ? "height" : "width"]: `${(t[1] - t[0]) * 100}%`
			}), c.forEach((n, r) => {
				let i = _ * t[r];
				if (h) {
					let e = _ * t[r] - g / 2;
					e < 0 && (i = g / 2), e + g > _ && (i = _ - g / 2);
				}
				n.css(v, `${i}px`), d && f[r].text(e.formatLabel(u[r], f[r][0]));
			});
		} else {
			let t = (u - o) / (s - o);
			l.css(p ? "height" : "width", `${t * 100}%`);
			let n = _ * t;
			if (h) {
				let e = _ * t - g / 2;
				e < 0 && (n = g / 2), e + g > _ && (n = _ - g / 2);
			}
			c[0].css(v, `${n}px`), d && f[0].text(e.formatLabel(u, f[0][0]));
		}
		e.dual && u.indexOf(o) >= 0 || !e.dual && u === o ? e.$el.addClass("range-slider-min") : e.$el.removeClass("range-slider-min"), e.dual && u.indexOf(s) >= 0 || !e.dual && u === s ? e.$el.addClass("range-slider-max") : e.$el.removeClass("range-slider-max");
	}
	setValue(e, t) {
		let n = this, { step: r, min: i, max: a } = n, o, s;
		if (n.dual) {
			s = [n.value[0], n.value[1]];
			let t = e;
			if (Array.isArray(t) || (t = [e, e]), e[0] > e[1] && (t = [t[0], t[0]]), t = t.map((e) => Math.max(Math.min(Math.round(e / r) * r, a), i)), t[0] === n.value[0] && t[1] === n.value[1]) return n;
			t.forEach((e, t) => {
				n.value[t] = e;
			}), o = s[0] !== t[0] || s[1] !== t[1], n.layout();
		} else {
			s = n.value;
			let t = Math.max(Math.min(Math.round(e / r) * r, a), i);
			n.value = t, n.layout(), o = s !== t;
		}
		return o && (n.previousValue = s), o ? (n.$el.trigger("range:change", n.value), n.$inputEl && !n.dual && (n.$inputEl.val(n.value), t ? n.$inputEl.trigger("input") : n.$inputEl.trigger("input change")), t || (n.$el.trigger("range:changed", n.value), n.emit("local::changed rangeChanged", n, n.value)), n.emit("local::change rangeChange", n, n.value), n) : n;
	}
	getValue() {
		return this.value;
	}
	formatLabel(e, t) {
		let n = this;
		return n.params.formatLabel ? n.params.formatLabel.call(n, e, t) : e;
	}
	formatScaleLabel(e) {
		let t = this;
		return t.params.formatScaleLabel ? t.params.formatScaleLabel.call(t, e) : e;
	}
	renderScale() {
		let e = this, { app: t, verticalReversed: n, vertical: r } = e, i = r ? n ? "top" : "bottom" : t.rtl ? "right" : "left", a = "";
		return Array.from({ length: e.scaleSteps + 1 }).forEach((t, n) => {
			let r = (e.max - e.min) / e.scaleSteps, o = e.min + r * n, s = (o - e.min) / (e.max - e.min);
			a += `<div class="range-scale-step" style="${i}: ${s * 100}%">${e.formatScaleLabel(o)}</div>`, e.scaleSubSteps && e.scaleSubSteps > 1 && n < e.scaleSteps && Array.from({ length: e.scaleSubSteps - 1 }).forEach((t, n) => {
				let s = (o + r / e.scaleSubSteps * (n + 1) - e.min) / (e.max - e.min);
				a += `<div class="range-scale-step range-scale-substep" style="${i}: ${s * 100}%"></div>`;
			});
		}), a;
	}
	updateScale() {
		let e = this;
		if (!e.scale || e.scaleSteps < 1) {
			e.$scaleEl && e.$scaleEl.remove(), delete e.$scaleEl;
			return;
		}
		e.$scaleEl || (e.$scaleEl = W("<div class=\"range-scale\"></div>"), e.$el.append(e.$scaleEl)), e.$scaleEl.html(e.renderScale());
	}
	init() {
		let e = this;
		return e.calcSize(), e.layout(), e.attachEvents(), e;
	}
	destroy() {
		let e = this;
		e.$el.trigger("range:beforedestroy"), e.emit("local::beforeDestroy rangeBeforeDestroy", e), delete e.$el[0].f7Range, e.detachEvents(), Ba(e), e = null;
	}
}, kc = {
	name: "range",
	create() {
		let e = this;
		e.range = J(ho({
			defaultSelector: ".range-slider",
			constructor: Oc,
			app: e,
			domProp: "f7Range"
		}), {
			getValue(t) {
				t === void 0 && (t = ".range-slider");
				let n = e.range.get(t);
				if (n) return n.getValue();
			},
			setValue(t, n) {
				t === void 0 && (t = ".range-slider");
				let r = e.range.get(t);
				if (r) return r.setValue(n);
			}
		});
	},
	static: { Range: Oc },
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".range-slider-init").each((e) => new Oc(t, { el: e }));
		},
		tabBeforeRemove(e) {
			W(e).find(".range-slider-init").each((e) => {
				e.f7Range && e.f7Range.destroy();
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".range-slider-init").each((e) => new Oc(t, { el: e }));
		},
		pageBeforeRemove(e) {
			e.$el.find(".range-slider-init").each((e) => {
				e.f7Range && e.f7Range.destroy();
			});
		}
	},
	vnode: { "range-slider-init": {
		insert(e) {
			let t = e.elm;
			this.range.create({ el: t });
		},
		destroy(e) {
			let t = e.elm;
			t.f7Range && t.f7Range.destroy();
		}
	} }
}, Ac = class extends Z {
	constructor(e, t) {
		super(t, [e]);
		let n = this, r = {
			el: null,
			inputEl: null,
			valueEl: null,
			value: 0,
			formatValue: null,
			step: 1,
			min: 0,
			max: 100,
			watchInput: !0,
			autorepeat: !1,
			autorepeatDynamic: !1,
			wraps: !1,
			manualInputMode: !1,
			decimalPoint: 4,
			buttonsEndInputMode: !0
		};
		n.useModulesParams(r), n.params = J(r, t), n.params.value < n.params.min && (n.params.value = n.params.min), n.params.value > n.params.max && (n.params.value = n.params.max);
		let i = n.params.el;
		if (!i) return n;
		let a = W(i);
		if (a.length === 0) return n;
		if (a[0].f7Stepper) return a[0].f7Stepper;
		let o;
		if (n.params.inputEl ? o = W(n.params.inputEl) : a.find(".stepper-input-wrap").find("input, textarea").length && (o = a.find(".stepper-input-wrap").find("input, textarea").eq(0)), o && o.length) {
			"step min max".split(" ").forEach((e) => {
				!t[e] && o.attr(e) && (n.params[e] = parseFloat(o.attr(e)));
			});
			let e = parseInt(n.params.decimalPoint, 10);
			Number.isNaN(e) ? n.params.decimalPoint = 0 : n.params.decimalPoint = e;
			let r = parseFloat(o.val());
			t.value === void 0 && !Number.isNaN(r) && (r || r === 0) && (n.params.value = r);
		}
		let s;
		n.params.valueEl ? s = W(n.params.valueEl) : a.find(".stepper-value").length && (s = a.find(".stepper-value").eq(0));
		let c = a.find(".stepper-button-plus"), l = a.find(".stepper-button-minus"), { step: u, min: d, max: f, value: p, decimalPoint: m } = n.params;
		J(n, {
			app: e,
			$el: a,
			el: a[0],
			$buttonPlusEl: c,
			buttonPlusEl: c[0],
			$buttonMinusEl: l,
			buttonMinusEl: l[0],
			$inputEl: o,
			inputEl: o ? o[0] : void 0,
			$valueEl: s,
			valueEl: s ? s[0] : void 0,
			step: u,
			min: d,
			max: f,
			value: p,
			decimalPoint: m,
			typeModeChanged: !1
		}), a[0].f7Stepper = n;
		let h = {}, g, _, v, y, b, x = null, S = !1, C = !1;
		function w(e, t, n, r, i, a) {
			clearTimeout(b), b = setTimeout(() => {
				e === 1 && (v = !0, S = !0), clearInterval(y), a(), y = setInterval(() => {
					a();
				}, i), e < t && w(e + 1, t, n, r, i / 2, a);
			}, e === 1 ? n : r);
		}
		function T(e) {
			g || C || (W(e.target).closest(c).length ? x = "increment" : W(e.target).closest(l).length && (x = "decrement"), x && (h.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, h.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, g = !0, _ = void 0, w(1, n.params.autorepeatDynamic ? 4 : 1, 500, 1e3, 300, () => {
				n[x]();
			})));
		}
		function E(e) {
			if (!g || C) return;
			let t = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX, n = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
			_ === void 0 && !S && (_ = !!(_ || Math.abs(n - h.y) > Math.abs(t - h.x)));
			let r = ((t - h.x) ** 2 + (n - h.y) ** 2) ** .5;
			(_ || r > 20) && (g = !1, clearTimeout(b), clearInterval(y));
		}
		function D() {
			clearTimeout(b), clearInterval(y), x = null, S = !1, g = !1;
		}
		function O() {
			if (C) {
				n.params.buttonsEndInputMode && (C = !1, n.endTypeMode(!0));
				return;
			}
			if (v) {
				v = !1;
				return;
			}
			n.decrement(!0);
		}
		function k() {
			if (C) {
				n.params.buttonsEndInputMode && (C = !1, n.endTypeMode(!0));
				return;
			}
			if (v) {
				v = !1;
				return;
			}
			n.increment(!0);
		}
		function A(e) {
			!e.target.readOnly && n.params.manualInputMode && (C = !0, typeof e.target.selectionStart == "number" && (e.target.selectionStart = e.target.value.length, e.target.selectionEnd = e.target.value.length));
		}
		function j(e) {
			(e.keyCode === 13 || e.which === 13) && (e.preventDefault(), C = !1, n.endTypeMode());
		}
		function M() {
			C = !1, n.endTypeMode(!0);
		}
		function N(e) {
			if (C) {
				n.typeValue(e.target.value);
				return;
			}
			e.detail && e.detail.sentByF7Stepper || n.setValue(e.target.value, !0);
		}
		return n.attachEvents = function() {
			l.on("click", O), c.on("click", k), n.params.watchInput && o && o.length && (o.on("input", N), o.on("click", A), o.on("blur", M), o.on("keyup", j)), n.params.autorepeat && (e.on("touchstart:passive", T), e.on("touchmove:active", E), e.on("touchend:passive", D));
		}, n.detachEvents = function() {
			l.off("click", O), c.off("click", k), n.params.watchInput && o && o.length && (o.off("input", N), o.off("click", A), o.off("blur", M), o.off("keyup", j));
		}, n.useModules(), n.init(), n;
	}
	minus() {
		return this.decrement();
	}
	plus() {
		return this.increment();
	}
	decrement() {
		let e = this;
		return e.setValue(e.value - e.step, !1, !0);
	}
	increment() {
		let e = this;
		return e.setValue(e.value + e.step, !1, !0);
	}
	setValue(e, t, n) {
		let r = this, { step: i, min: a, max: o } = r, s = r.value, c = Math.round(e / i) * i;
		if (r.params.wraps && n ? (c > o && (c = a), c < a && (c = o)) : c = Math.max(Math.min(c, o), a), Number.isNaN(c) && (c = s), r.value = c, s === c && !t) return r;
		r.$el.trigger("stepper:change", r.value);
		let l = r.formatValue(r.value);
		return r.$inputEl && r.$inputEl.length && (r.$inputEl.val(l), r.$inputEl.trigger("input change", { sentByF7Stepper: !0 })), r.$valueEl && r.$valueEl.length && r.$valueEl.html(l), r.emit("local::change stepperChange", r, r.value), r;
	}
	endTypeMode(e) {
		let t = this, { min: n, max: r } = t, i = parseFloat(t.value);
		if (Number.isNaN(i) && (i = 0), i = Math.max(Math.min(i, r), n), t.value = i, !t.typeModeChanged) return t.$inputEl && t.$inputEl.length && !e && t.$inputEl.blur(), t;
		t.typeModeChanged = !1, t.$el.trigger("stepper:change", t.value);
		let a = t.formatValue(t.value);
		return t.$inputEl && t.$inputEl.length && (t.$inputEl.val(a), t.$inputEl.trigger("input change", { sentByF7Stepper: !0 }), e || t.$inputEl.blur()), t.$valueEl && t.$valueEl.length && t.$valueEl.html(a), t.emit("local::change stepperChange", t, t.value), t;
	}
	typeValue(e) {
		let t = this;
		t.typeModeChanged = !0;
		let n = String(e);
		if (n.length === 1 && n === "-") return t;
		if (n.lastIndexOf(".") + 1 === n.length || n.lastIndexOf(",") + 1 === n.length) {
			if (n.lastIndexOf(".") !== n.indexOf(".") || n.lastIndexOf(",") !== n.indexOf(",")) return n = n.slice(0, -1), t.value = n, t.$inputEl.val(t.value), t;
		} else {
			let e = parseFloat(n.replace(",", "."));
			if (e === 0) return t.value = n.replace(",", "."), t.$inputEl.val(t.value), t;
			if (Number.isNaN(e)) return t.value = 0, t.$inputEl.val(t.value), t;
			let r = 10 ** t.params.decimalPoint;
			return e = Math.round(e * r).toFixed(t.params.decimalPoint + 1) / r, t.value = parseFloat(String(e).replace(",", ".")), t.$inputEl.val(t.value), t;
		}
		return t.value = n, t.$inputEl.val(n), t;
	}
	getValue() {
		return this.value;
	}
	formatValue(e) {
		let t = this;
		return t.params.formatValue ? t.params.formatValue.call(t, e) : e;
	}
	init() {
		let e = this;
		if (e.attachEvents(), e.$valueEl && e.$valueEl.length) {
			let t = e.formatValue(e.value);
			e.$valueEl.html(t);
		}
		return e;
	}
	destroy() {
		let e = this;
		e.$el.trigger("stepper:beforedestroy"), e.emit("local::beforeDestroy stepperBeforeDestroy", e), delete e.$el[0].f7Stepper, e.detachEvents(), Ba(e), e = null;
	}
}, jc = {
	name: "stepper",
	create() {
		let e = this;
		e.stepper = J(ho({
			defaultSelector: ".stepper",
			constructor: Ac,
			app: e,
			domProp: "f7Stepper"
		}), {
			getValue(t) {
				t === void 0 && (t = ".stepper");
				let n = e.stepper.get(t);
				if (n) return n.getValue();
			},
			setValue(t, n) {
				t === void 0 && (t = ".stepper");
				let r = e.stepper.get(t);
				if (r) return r.setValue(n);
			}
		});
	},
	static: { Stepper: Ac },
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".stepper-init").each((e) => {
				let n = W(e).dataset();
				t.stepper.create(J({ el: e }, n || {}));
			});
		},
		tabBeforeRemove(e) {
			W(e).find(".stepper-init").each((e) => {
				e.f7Stepper && e.f7Stepper.destroy();
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".stepper-init").each((e) => {
				let n = W(e).dataset();
				t.stepper.create(J({ el: e }, n || {}));
			});
		},
		pageBeforeRemove(e) {
			e.$el.find(".stepper-init").each((e) => {
				e.f7Stepper && e.f7Stepper.destroy();
			});
		}
	},
	vnode: { "stepper-init": {
		insert(e) {
			let t = this, n = e.elm, r = W(n).dataset();
			t.stepper.create(J({ el: n }, r || {}));
		},
		destroy(e) {
			let t = e.elm;
			t.f7Stepper && t.f7Stepper.destroy();
		}
	} }
}, Mc = [
	{
		base: "A",
		letters: "AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"
	},
	{
		base: "AA",
		letters: "Ꜳ"
	},
	{
		base: "AE",
		letters: "ÆǼǢ"
	},
	{
		base: "AO",
		letters: "Ꜵ"
	},
	{
		base: "AU",
		letters: "Ꜷ"
	},
	{
		base: "AV",
		letters: "ꜸꜺ"
	},
	{
		base: "AY",
		letters: "Ꜽ"
	},
	{
		base: "B",
		letters: "BⒷＢḂḄḆɃƂƁ"
	},
	{
		base: "C",
		letters: "CⒸＣĆĈĊČÇḈƇȻꜾ"
	},
	{
		base: "D",
		letters: "DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"
	},
	{
		base: "DZ",
		letters: "ǱǄ"
	},
	{
		base: "Dz",
		letters: "ǲǅ"
	},
	{
		base: "E",
		letters: "EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"
	},
	{
		base: "F",
		letters: "FⒻＦḞƑꝻ"
	},
	{
		base: "G",
		letters: "GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"
	},
	{
		base: "H",
		letters: "HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"
	},
	{
		base: "I",
		letters: "IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"
	},
	{
		base: "J",
		letters: "JⒿＪĴɈ"
	},
	{
		base: "K",
		letters: "KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"
	},
	{
		base: "L",
		letters: "LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"
	},
	{
		base: "LJ",
		letters: "Ǉ"
	},
	{
		base: "Lj",
		letters: "ǈ"
	},
	{
		base: "M",
		letters: "MⓂＭḾṀṂⱮƜ"
	},
	{
		base: "N",
		letters: "NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"
	},
	{
		base: "NJ",
		letters: "Ǌ"
	},
	{
		base: "Nj",
		letters: "ǋ"
	},
	{
		base: "O",
		letters: "OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"
	},
	{
		base: "OI",
		letters: "Ƣ"
	},
	{
		base: "OO",
		letters: "Ꝏ"
	},
	{
		base: "OU",
		letters: "Ȣ"
	},
	{
		base: "OE",
		letters: "Œ"
	},
	{
		base: "oe",
		letters: "œ"
	},
	{
		base: "P",
		letters: "PⓅＰṔṖƤⱣꝐꝒꝔ"
	},
	{
		base: "Q",
		letters: "QⓆＱꝖꝘɊ"
	},
	{
		base: "R",
		letters: "RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"
	},
	{
		base: "S",
		letters: "SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"
	},
	{
		base: "T",
		letters: "TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"
	},
	{
		base: "TZ",
		letters: "Ꜩ"
	},
	{
		base: "U",
		letters: "UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"
	},
	{
		base: "V",
		letters: "VⓋＶṼṾƲꝞɅ"
	},
	{
		base: "VY",
		letters: "Ꝡ"
	},
	{
		base: "W",
		letters: "WⓌＷẀẂŴẆẄẈⱲ"
	},
	{
		base: "X",
		letters: "XⓍＸẊẌ"
	},
	{
		base: "Y",
		letters: "YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"
	},
	{
		base: "Z",
		letters: "ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"
	},
	{
		base: "a",
		letters: "aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ"
	},
	{
		base: "aa",
		letters: "ꜳ"
	},
	{
		base: "ae",
		letters: "æǽǣ"
	},
	{
		base: "ao",
		letters: "ꜵ"
	},
	{
		base: "au",
		letters: "ꜷ"
	},
	{
		base: "av",
		letters: "ꜹꜻ"
	},
	{
		base: "ay",
		letters: "ꜽ"
	},
	{
		base: "b",
		letters: "bⓑｂḃḅḇƀƃɓ"
	},
	{
		base: "c",
		letters: "cⓒｃćĉċčçḉƈȼꜿↄ"
	},
	{
		base: "d",
		letters: "dⓓｄḋďḍḑḓḏđƌɖɗꝺ"
	},
	{
		base: "dz",
		letters: "ǳǆ"
	},
	{
		base: "e",
		letters: "eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"
	},
	{
		base: "f",
		letters: "fⓕｆḟƒꝼ"
	},
	{
		base: "g",
		letters: "gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"
	},
	{
		base: "h",
		letters: "hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"
	},
	{
		base: "hv",
		letters: "ƕ"
	},
	{
		base: "i",
		letters: "iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"
	},
	{
		base: "j",
		letters: "jⓙｊĵǰɉ"
	},
	{
		base: "k",
		letters: "kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"
	},
	{
		base: "l",
		letters: "lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"
	},
	{
		base: "lj",
		letters: "ǉ"
	},
	{
		base: "m",
		letters: "mⓜｍḿṁṃɱɯ"
	},
	{
		base: "n",
		letters: "nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ"
	},
	{
		base: "nj",
		letters: "ǌ"
	},
	{
		base: "o",
		letters: "oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"
	},
	{
		base: "oi",
		letters: "ƣ"
	},
	{
		base: "ou",
		letters: "ȣ"
	},
	{
		base: "oo",
		letters: "ꝏ"
	},
	{
		base: "p",
		letters: "pⓟｐṕṗƥᵽꝑꝓꝕ"
	},
	{
		base: "q",
		letters: "qⓠｑɋꝗꝙ"
	},
	{
		base: "r",
		letters: "rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"
	},
	{
		base: "s",
		letters: "sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"
	},
	{
		base: "t",
		letters: "tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"
	},
	{
		base: "tz",
		letters: "ꜩ"
	},
	{
		base: "u",
		letters: "uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"
	},
	{
		base: "v",
		letters: "vⓥｖṽṿʋꝟʌ"
	},
	{
		base: "vy",
		letters: "ꝡ"
	},
	{
		base: "w",
		letters: "wⓦｗẁẃŵẇẅẘẉⱳ"
	},
	{
		base: "x",
		letters: "xⓧｘẋẍ"
	},
	{
		base: "y",
		letters: "yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"
	},
	{
		base: "z",
		letters: "zⓩｚźẑżžẓẕƶȥɀⱬꝣ"
	}
], Nc = {};
for (let e = 0; e < Mc.length; e += 1) {
	let t = Mc[e].letters;
	for (let n = 0; n < t.length; n += 1) Nc[t[n]] = Mc[e].base;
}
function Pc(e) {
	return e.replace(/[^\u0000-\u007E]/g, (e) => Nc[e] || e);
}
//#endregion
//#region node_modules/framework7/components/smart-select/smart-select-class.js
var Fc = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = J({ on: {} }, e.params.smartSelect);
		n.useModulesParams(r), n.params = J({}, r, t), n.app = e;
		let i = W(n.params.el).eq(0);
		if (i.length === 0) return n;
		if (i[0].f7SmartSelect) return i[0].f7SmartSelect;
		let a = i.find("select").eq(0);
		if (a.length === 0) return n;
		let o;
		n.params.setValueText && (o = W(n.params.valueEl), o.length === 0 && (o = i.find(".item-after")), o.length === 0 && (o = W("<div class=\"item-after\"></div>"), o.insertAfter(i.find(".item-title"))));
		let s = t.url;
		s || (i.attr("href") && i.attr("href") !== "#" ? s = i.attr("href") : a.attr("name") && (s = `${a.attr("name").toLowerCase()}-select/`)), s ||= n.params.url;
		let c = a[0].multiple, l = c ? "checkbox" : "radio", u = Ia();
		J(n, {
			$el: i,
			el: i[0],
			$selectEl: a,
			selectEl: a[0],
			$valueEl: o,
			valueEl: o && o[0],
			url: s,
			multiple: c,
			inputType: l,
			id: u,
			inputName: `${l}-${u}`,
			selectName: a.attr("name"),
			maxLength: a.attr("maxlength") || t.maxLength
		}), i[0].f7SmartSelect = n;
		function d() {
			n.open();
		}
		function f() {
			let e = n.$selectEl.val();
			n.$el.trigger("smartselect:change", e), n.emit("local::change smartSelectChange", n, e), n.vl && n.vl.clearCache(), n.setValueText();
		}
		n.attachEvents = function() {
			i.on("click", d), i.on("change", "select", f);
		}, n.detachEvents = function() {
			i.off("click", d), i.off("change", "select", f);
		};
		function p() {
			let e, t, r = this, i = r.value, a = [], o;
			if (r.type === "checkbox") {
				for (let s = 0; s < n.selectEl.options.length; s += 1) e = n.selectEl.options[s], e.value === i && (e.selected = r.checked), e.selected && (o = e.dataset ? e.dataset.displayAs : W(e).data("display-value-as"), t = o && o !== void 0 ? o : e.textContent, a.push(t.trim()));
				n.maxLength && n.checkMaxLength();
			} else e = n.$selectEl.find(`option[value="${i}"]`)[0], e ||= n.$selectEl.find("option").filter((e) => e.value === i)[0], o = e.dataset ? e.dataset.displayAs : W(e).data("display-as"), t = o && o !== void 0 ? o : e.textContent, a = [t], n.selectEl.value = i;
			n.$selectEl.trigger("change"), n.params.setValueText && n.formatValueTextContent(a), n.params.closeOnSelect && n.inputType === "radio" && n.close();
		}
		return n.attachInputsEvents = function() {
			n.$containerEl.on("change", "input[type=\"checkbox\"], input[type=\"radio\"]", p);
		}, n.detachInputsEvents = function() {
			n.$containerEl.off("change", "input[type=\"checkbox\"], input[type=\"radio\"]", p);
		}, n.useModules(), n.init(), n;
	}
	setValue(e) {
		let t = this, n = e, r = [], i, a, o;
		if (t.multiple) {
			Array.isArray(n) || (n = [n]);
			for (let e = 0; e < t.selectEl.options.length; e += 1) i = t.selectEl.options[e], n.indexOf(i.value) >= 0 ? i.selected = !0 : i.selected = !1, i.selected && (a = i.dataset ? i.dataset.displayAs : W(i).data("display-value-as"), o = a && a !== void 0 ? a : i.textContent, r.push(o.trim()));
		} else i = t.$selectEl.find(`option[value="${n}"]`)[0], i && (a = i.dataset ? i.dataset.displayAs : W(i).data("display-as"), o = a && a !== void 0 ? a : i.textContent, r = [o]), t.selectEl.value = n;
		return t.params.setValueText && t.formatValueTextContent(r), t.$selectEl.trigger("change"), t;
	}
	unsetValue() {
		let e = this;
		e.params.setValueText && e.formatValueTextContent([]), e.$selectEl.find("option").each((e) => {
			e.selected = !1, e.checked = !1;
		}), e.$selectEl[0].value = null, e.$containerEl && e.$containerEl.find(`input[name="${e.inputName}"][type="checkbox"], input[name="${e.inputName}"][type="radio"]`).prop("checked", !1), e.$selectEl.trigger("change");
	}
	getValue() {
		return this.$selectEl.val();
	}
	get view() {
		let { params: e, $el: t } = this, n;
		if (e.view && (n = e.view), n ||= t.parents(".view").length && t.parents(".view")[0].f7View, !n && e.openIn === "page") throw Error("Smart Select requires initialized View");
		return n;
	}
	checkMaxLength() {
		let e = this, t = e.$containerEl;
		e.selectEl.selectedOptions.length >= e.maxLength ? t.find("input[type=\"checkbox\"]").each((e) => {
			e.checked ? W(e).parents("li").removeClass("disabled") : W(e).parents("li").addClass("disabled");
		}) : t.find(".disabled").removeClass("disabled");
	}
	formatValueTextContent(e) {
		let t = this, n = t.formatValueText(e);
		n.includes("<") && n.includes(">") ? t.$valueEl.html(n) : t.$valueEl.text(n);
	}
	formatValueText(e) {
		let t = this, n;
		return n = t.params.formatValueText ? t.params.formatValueText.call(t, e, t) : e.join(", "), n;
	}
	setValueText(e) {
		let t = this, n = [];
		e === void 0 ? t.$selectEl.find("option").each((e) => {
			let t = W(e);
			if (e.selected) {
				let r = e.dataset ? e.dataset.displayAs : t.data("display-value-as");
				r && r !== void 0 ? n.push(r) : n.push(e.textContent.trim());
			}
		}) : n = Array.isArray(e) ? e : [e], t.params.setValueText && t.formatValueTextContent(n);
	}
	getItemsData() {
		let e = this, t = e.app.theme, n = [], r;
		return e.$selectEl.find("option").each((i) => {
			let a = W(i), o = a.dataset(), s = o.optionImage || e.params.optionImage, c = o.optionIcon || e.params.optionIcon, l = t === "ios" && (o.optionIconIos || e.params.optionIconIos), u = t === "md" && (o.optionIconMd || e.params.optionIconMd), d = o.inputIconPosition || e.params.inputIconPosition || "", f = s || c || l || u, p = o.optionColor, m = o.optionClass || "";
			a[0].disabled && (m += " disabled");
			let h = a.parent("optgroup")[0], g = h && h.label, _ = !1;
			h && h !== r && (_ = !0, r = h, n.push({
				groupLabel: g,
				isLabel: _
			})), n.push({
				value: a[0].value,
				text: a[0].textContent.trim(),
				selected: a[0].selected,
				groupEl: h,
				groupLabel: g,
				image: s,
				icon: c,
				iconIos: l,
				iconMd: u,
				inputIconPosition: d,
				color: p,
				className: m,
				disabled: a[0].disabled,
				id: e.id,
				hasMedia: f,
				checkbox: e.inputType === "checkbox",
				radio: e.inputType === "radio",
				inputName: e.inputName,
				inputType: e.inputType
			});
		}), e.items = n, n;
	}
	renderSearchbar() {
		let e = this;
		return e.params.renderSearchbar ? e.params.renderSearchbar.call(e) : Q("form", { class: "searchbar" }, Q("div", { class: "searchbar-inner" }, Q("div", { class: "searchbar-input-wrap" }, Q("input", {
			type: "search",
			spellcheck: e.params.searchbarSpellcheck || "false",
			placeholder: e.params.searchbarPlaceholder
		}), Q("i", { class: "searchbar-icon" }), Q("span", { class: "input-clear-button" })), e.params.searchbarDisableButton && Q("span", { class: "searchbar-disable-button" }, e.params.searchbarDisableText)));
	}
	renderItem(e, t) {
		let n = this;
		if (n.params.renderItem) return n.params.renderItem.call(n, e, t);
		function r(e) {
			return e === void 0 && (e = ""), e.indexOf(":") >= 0 ? e.split(":")[1] : "";
		}
		function i(e) {
			if (e === void 0 && (e = ""), e.indexOf(":") >= 0) {
				let t = e.split(":")[0];
				return t === "f7" && (t = "f7-icons"), t === "material" && (t = "material-icons"), t;
			}
			return e;
		}
		let a;
		if (e.isLabel) a = `<li class="list-group-title">${e.groupLabel}</li>`;
		else {
			let t = e.selected, o;
			if (n.params.virtualList) {
				let r = n.getValue();
				t = n.multiple ? r.indexOf(e.value) >= 0 : r === e.value, n.multiple && (o = n.multiple && !t && r.length === parseInt(n.maxLength, 10));
			}
			let { icon: s, iconIos: c, iconMd: l } = e, u = s || c || l, d = r(s || c || l || ""), f = i(s || c || l || "");
			a = Q("li", { class: `${e.className || ""}${o ? " disabled" : ""}` }, Q("label", { class: `item-${e.inputType} ${e.inputIconPosition ? `item-${e.inputType}-icon-${e.inputIconPosition}` : ""} item-content` }, Q("input", {
				type: e.inputType,
				name: e.inputName,
				value: e.value,
				_checked: t
			}), Q("i", { class: `icon icon-${e.inputType}` }), e.hasMedia && Q("div", { class: "item-media" }, u && Q("i", { class: `icon ${f}` }, d), e.image && Q("img", { src: e.image })), Q("div", { class: "item-inner" }, Q("div", { class: `item-title${e.color ? ` text-color-${e.color}` : ""}` }, e.text))));
		}
		return a;
	}
	renderItems() {
		let e = this;
		return e.params.renderItems ? e.params.renderItems.call(e, e.items) : `
      ${e.items.map((t, n) => `${e.renderItem(t, n)}`).join("")}
    `;
	}
	renderPage() {
		let e = this;
		if (e.params.renderPage) return e.params.renderPage.call(e, e.items);
		let t = e.params.pageTitle;
		if (t === void 0) {
			let n = e.$el.find(".item-title");
			t = n.length ? n.text().trim() : "";
		}
		let n = e.params.cssClass;
		return Q("div", {
			class: `page smart-select-page ${n}`,
			"data-name": "smart-select-page",
			"data-select-name": e.selectName
		}, Q("div", { class: `navbar ${e.params.navbarColorTheme ? `color-${e.params.navbarColorTheme}` : ""}` }, Q("div", { class: "navbar-bg" }), Q("div", { class: `navbar-inner sliding ${e.params.navbarColorTheme ? `color-${e.params.navbarColorTheme}` : ""}` }, Q("div", { class: "left" }, Q("a", { class: "link back" }, Q("i", { class: "icon icon-back" }), Q("span", { class: "if-not-md" }, e.params.pageBackLinkText))), t && Q("div", { class: "title" }, t), e.params.searchbar && Q("div", { class: "subnavbar" }, e.renderSearchbar()))), e.params.searchbar && Q("div", { class: "searchbar-backdrop" }), Q("div", { class: "page-content" }, Q("div", { class: `list list-outline-ios list-strong-ios list-dividers-ios smart-select-list-${e.id} ${e.params.virtualList ? " virtual-list" : ""} ${e.params.formColorTheme ? `color-${e.params.formColorTheme}` : ""}` }, Q("ul", null, !e.params.virtualList && e.renderItems(e.items)))));
	}
	renderPopup() {
		let e = this;
		if (e.params.renderPopup) return e.params.renderPopup.call(e, e.items);
		let t = e.params.pageTitle;
		if (t === void 0) {
			let n = e.$el.find(".item-title");
			t = n.length ? n.text().trim() : "";
		}
		return Q("div", {
			class: `popup smart-select-popup ${e.params.cssClass || ""} ${e.params.popupTabletFullscreen ? "popup-tablet-fullscreen" : ""}`,
			"data-select-name": e.selectName
		}, Q("div", { class: "view" }, Q("div", {
			class: `page smart-select-page ${e.params.searchbar ? "page-with-subnavbar" : ""}`,
			"data-name": "smart-select-page"
		}, Q("div", { class: `navbar ${e.params.navbarColorTheme ? `color-${e.params.navbarColorTheme}` : ""}` }, Q("div", { class: "navbar-bg" }), Q("div", { class: "navbar-inner sliding" }, t && Q("div", { class: "title" }, t), Q("div", { class: "right" }, Q("a", {
			class: "link popup-close",
			"data-popup": `.smart-select-popup[data-select-name='${e.selectName}']`
		}, e.params.popupCloseLinkText)), e.params.searchbar && Q("div", { class: "subnavbar" }, e.renderSearchbar()))), e.params.searchbar && Q("div", { class: "searchbar-backdrop" }), Q("div", { class: "page-content" }, Q("div", { class: `list list-outline-ios list-strong-ios list-dividers-ios smart-select-list-${e.id} ${e.params.virtualList ? " virtual-list" : ""} ${e.params.formColorTheme ? `color-${e.params.formColorTheme}` : ""}` }, Q("ul", null, !e.params.virtualList && e.renderItems(e.items)))))));
	}
	renderSheet() {
		let e = this;
		if (e.params.renderSheet) return e.params.renderSheet.call(e, e.items);
		let t = e.params.cssClass;
		return Q("div", {
			class: `sheet-modal smart-select-sheet ${t}`,
			"data-select-name": e.selectName
		}, Q("div", { class: `toolbar toolbar-top ${e.params.toolbarColorTheme ? `color-${e.params.toolbarColorTheme}` : ""}` }, Q("div", { class: "toolbar-inner" }, Q("div", { class: "left" }), Q("div", { class: "right" }, Q("a", { class: "link sheet-close" }, e.params.sheetCloseLinkText)))), Q("div", { class: "sheet-modal-inner" }, Q("div", { class: "page-content" }, Q("div", { class: `list list-strong-ios list-dividers-ios smart-select-list-${e.id} ${e.params.virtualList ? " virtual-list" : ""} ${e.params.formColorTheme ? `color-${e.params.formColorTheme}` : ""}` }, Q("ul", null, !e.params.virtualList && e.renderItems(e.items))))));
	}
	renderPopover() {
		let e = this;
		if (e.params.renderPopover) return e.params.renderPopover.call(e, e.items);
		let t = e.params.cssClass;
		return Q("div", {
			class: `popover smart-select-popover ${t}`,
			"data-select-name": e.selectName
		}, Q("div", { class: "popover-inner" }, Q("div", { class: `list list-strong-ios list-dividers-ios smart-select-list-${e.id} ${e.params.virtualList ? " virtual-list" : ""} ${e.params.formColorTheme ? `color-${e.params.formColorTheme}` : ""}` }, Q("ul", null, !e.params.virtualList && e.renderItems(e.items)))));
	}
	scrollToSelectedItem() {
		let e = this, { params: t, $containerEl: n } = e;
		if (!e.opened) return e;
		if (t.virtualList) {
			let t;
			e.vl.items.forEach((e, n) => {
				t === void 0 && e.selected && (t = n);
			}), t !== void 0 && e.vl.scrollToItem(t);
		} else {
			let t = n.find("input:checked").parents("li");
			if (!t.length) return e;
			let r = n.find(".page-content, .popover-inner");
			if (!r.length) return e;
			r.scrollTop(t.offset().top - r.offset().top - parseInt(r.css("padding-top"), 10));
		}
		return e;
	}
	onOpen(e, t) {
		let n = this, r = n.app, i = W(t);
		if (n.$containerEl = i, n.openedIn = e, n.opened = !0, n.params.virtualList && (n.vl = r.virtualList.create({
			el: i.find(".virtual-list"),
			items: n.items,
			renderItem: n.renderItem.bind(n),
			height: n.params.virtualListHeight,
			searchByItem(e, t) {
				return !!(t.text && Pc(t.text).toLowerCase().indexOf(e.trim().toLowerCase()) >= 0);
			}
		})), n.params.scrollToSelectedItem && n.scrollToSelectedItem(), n.params.searchbar) {
			let t = i.find(".searchbar");
			if (e === "page" && r.theme === "ios" && (t = W(r.navbar.getElByPage(i)).find(".searchbar")), n.params.appendSearchbarNotFound && (e === "page" || e === "popup")) {
				let e = null;
				e = typeof n.params.appendSearchbarNotFound == "string" ? W(`<div class="block searchbar-not-found">${n.params.appendSearchbarNotFound}</div>`) : typeof n.params.appendSearchbarNotFound == "boolean" ? W("<div class=\"block searchbar-not-found\">Nothing found</div>") : n.params.appendSearchbarNotFound, e && i.find(".page-content").append(e[0]);
			}
			let a = J({
				el: t,
				backdropEl: i.find(".searchbar-backdrop"),
				searchContainer: `.smart-select-list-${n.id}`,
				searchIn: ".item-title"
			}, typeof n.params.searchbar == "object" ? n.params.searchbar : {});
			n.searchbar = r.searchbar.create(a);
		}
		n.maxLength && n.checkMaxLength(), n.params.closeOnSelect && n.$containerEl.find(`input[type="radio"][name="${n.inputName}"]:checked`).parents("label").once("click", () => {
			n.close();
		}), n.attachInputsEvents(), n.$el.trigger("smartselect:open"), n.emit("local::open smartSelectOpen", n);
	}
	onOpened() {
		let e = this;
		e.$el.trigger("smartselect:opened"), e.emit("local::opened smartSelectOpened", e);
	}
	onClose() {
		let e = this;
		e.destroyed || (e.vl && e.vl.destroy && (e.vl.destroy(), e.vl = null, delete e.vl), e.searchbar && e.searchbar.destroy && (e.searchbar.destroy(), e.searchbar = null, delete e.searchbar), e.detachInputsEvents(), e.$el.trigger("smartselect:close"), e.emit("local::close smartSelectClose", e));
	}
	onClosed() {
		let e = this;
		e.destroyed || (e.opened = !1, e.$containerEl = null, delete e.$containerEl, e.$el.trigger("smartselect:closed"), e.emit("local::closed smartSelectClosed", e));
	}
	openPage() {
		let e = this;
		if (e.opened) return e;
		e.getItemsData();
		let t = e.renderPage(e.items);
		return e.view.router.navigate({
			url: e.url,
			route: {
				content: t,
				path: e.url,
				on: {
					pageBeforeIn(t, n) {
						e.onOpen("page", n.el);
					},
					pageAfterIn(t, n) {
						e.onOpened("page", n.el);
					},
					pageBeforeOut(t, n) {
						e.onClose("page", n.el);
					},
					pageAfterOut(t, n) {
						e.onClosed("page", n.el);
					}
				}
			}
		}), e;
	}
	openPopup() {
		let e = this;
		if (e.opened) return e;
		e.getItemsData();
		let t = {
			content: e.renderPopup(e.items),
			push: e.params.popupPush,
			swipeToClose: e.params.popupSwipeToClose,
			closeByBackdropClick: e.params.closeByBackdropClick,
			on: {
				popupOpen(t) {
					e.onOpen("popup", t.el);
				},
				popupOpened(t) {
					e.onOpened("popup", t.el);
				},
				popupClose(t) {
					e.onClose("popup", t.el);
				},
				popupClosed(t) {
					e.onClosed("popup", t.el);
				}
			}
		};
		return e.params.routableModals && e.view ? e.view.router.navigate({
			url: e.url,
			route: {
				path: e.url,
				popup: t
			}
		}) : e.modal = e.app.popup.create(t).open(), e;
	}
	openSheet() {
		let e = this;
		if (e.opened) return e;
		e.getItemsData();
		let t = {
			content: e.renderSheet(e.items),
			backdrop: e.params.sheetBackdrop,
			scrollToEl: e.$el,
			closeByOutsideClick: !0,
			push: e.params.sheetPush,
			swipeToClose: e.params.sheetSwipeToClose,
			closeByBackdropClick: e.params.closeByBackdropClick,
			on: {
				sheetOpen(t) {
					e.onOpen("sheet", t.el);
				},
				sheetOpened(t) {
					e.onOpened("sheet", t.el);
				},
				sheetClose(t) {
					e.onClose("sheet", t.el);
				},
				sheetClosed(t) {
					e.onClosed("sheet", t.el);
				}
			}
		};
		return e.params.routableModals && e.view ? e.view.router.navigate({
			url: e.url,
			route: {
				path: e.url,
				sheet: t
			}
		}) : e.modal = e.app.sheet.create(t).open(), e;
	}
	openPopover() {
		let e = this;
		if (e.opened) return e;
		e.getItemsData();
		let t = {
			content: e.renderPopover(e.items),
			targetEl: e.$el,
			closeByBackdropClick: e.params.closeByBackdropClick,
			on: {
				popoverOpen(t) {
					e.onOpen("popover", t.el);
				},
				popoverOpened(t) {
					e.onOpened("popover", t.el);
				},
				popoverClose(t) {
					e.onClose("popover", t.el);
				},
				popoverClosed(t) {
					e.onClosed("popover", t.el);
				}
			}
		};
		return e.params.routableModals && e.view ? e.view.router.navigate({
			url: e.url,
			route: {
				path: e.url,
				popover: t
			}
		}) : e.modal = e.app.popover.create(t).open(), e;
	}
	open(e) {
		let t = this;
		if (t.opened) return t;
		let n = !1;
		function r() {
			n = !0;
		}
		return t.$el && t.$el.trigger("smartselect:beforeopen", { prevent: r }), t.emit("local::beforeOpen smartSelectBeforeOpen", t, r), n || t[`open${(e || t.params.openIn).split("").map((e, t) => t === 0 ? e.toUpperCase() : e).join("")}`](), t;
	}
	close() {
		let e = this;
		return e.opened && (e.params.routableModals && e.view || e.openedIn === "page" ? e.view.router.back() : (e.modal.once("modalClosed", () => {
			Ua(() => {
				e.destroyed || (e.modal.destroy(), delete e.modal);
			});
		}), e.modal.close())), e;
	}
	init() {
		let e = this;
		e.attachEvents(), e.setValueText();
	}
	destroy() {
		let e = this;
		e.emit("local::beforeDestroy smartSelectBeforeDestroy", e), e.$el.trigger("smartselect:beforedestroy"), e.detachEvents(), delete e.$el[0].f7SmartSelect, Ba(e), e.destroyed = !0;
	}
}, Ic = {
	name: "smartSelect",
	params: { smartSelect: {
		el: void 0,
		valueEl: void 0,
		setValueText: !0,
		formatValueText: null,
		openIn: "page",
		popupPush: !1,
		popupSwipeToClose: void 0,
		sheetPush: !1,
		sheetSwipeToClose: void 0,
		sheetBackdrop: !1,
		pageTitle: void 0,
		pageBackLinkText: "Back",
		popupCloseLinkText: "Close",
		popupTabletFullscreen: !1,
		closeByBackdropClick: !0,
		sheetCloseLinkText: "Done",
		searchbar: !1,
		searchbarPlaceholder: "Search",
		searchbarDisableText: "Cancel",
		searchbarDisableButton: !0,
		searchbarSpellcheck: !1,
		closeOnSelect: !1,
		virtualList: !1,
		virtualListHeight: void 0,
		scrollToSelectedItem: !1,
		formColorTheme: void 0,
		navbarColorTheme: void 0,
		routableModals: !1,
		url: "select/",
		inputIconPosition: "start",
		cssClass: "",
		renderPage: void 0,
		renderPopup: void 0,
		renderSheet: void 0,
		renderPopover: void 0,
		renderItems: void 0,
		renderItem: void 0,
		renderSearchbar: void 0
	} },
	static: { SmartSelect: Fc },
	create() {
		let e = this;
		e.smartSelect = J(ho({
			defaultSelector: ".smart-select",
			constructor: Fc,
			app: e,
			domProp: "f7SmartSelect"
		}), {
			open(t) {
				let n = e.smartSelect.get(t);
				if (n && n.open) return n.open();
			},
			close(t) {
				let n = e.smartSelect.get(t);
				if (n && n.close) return n.close();
			}
		});
	},
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".smart-select-init").each((e) => {
				t.smartSelect.create(J({ el: e }, W(e).dataset()));
			});
		},
		tabBeforeRemove(e) {
			W(e).find(".smart-select-init").each((e) => {
				e.f7SmartSelect && e.f7SmartSelect.destroy && e.f7SmartSelect.destroy();
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".smart-select-init").each((e) => {
				t.smartSelect.create(J({ el: e }, W(e).dataset()));
			});
		},
		pageBeforeRemove(e) {
			e.$el.find(".smart-select-init").each((e) => {
				e.f7SmartSelect && e.f7SmartSelect.destroy && e.f7SmartSelect.destroy();
			});
		}
	},
	clicks: { ".smart-select": function(e, t) {
		let n = this;
		e[0].f7SmartSelect || n.smartSelect.create(J({ el: e }, t)).open();
	} },
	vnode: { "smart-select-init": {
		insert(e) {
			let t = this, n = e.elm;
			t.smartSelect.create(J({ el: n }, W(n).dataset()));
		},
		destroy(e) {
			let t = e.elm;
			t.f7SmartSelect && t.f7SmartSelect.destroy && t.f7SmartSelect.destroy();
		}
	} }
}, Lc = { name: "grid" }, Rc = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this;
		n.params = J({}, e.params.calendar, t);
		let r;
		if (n.params.containerEl && (r = W(n.params.containerEl), r.length === 0)) return n;
		let i;
		n.params.inputEl && (i = W(n.params.inputEl));
		let a = n.params.direction === "horizontal", o = 1;
		a && (o = e.rtl ? -1 : 1), J(n, {
			app: e,
			$containerEl: r,
			containerEl: r && r[0],
			inline: r && r.length > 0,
			$inputEl: i,
			inputEl: i && i[0],
			initialized: !1,
			opened: !1,
			url: n.params.url,
			isHorizontal: a,
			inverter: o,
			animating: !1,
			allowTouchMove: !0,
			hasTimePicker: n.params.timePicker && !n.params.rangePicker && !n.params.multiple
		}), n.dayFormatter = (e) => new Intl.DateTimeFormat(n.params.locale, { day: "numeric" }).format(e).replace(/日/, ""), n.monthFormatter = (e) => new Intl.DateTimeFormat(n.params.locale, { month: "long" }).format(e), n.yearFormatter = (e) => new Intl.DateTimeFormat(n.params.locale, { year: "numeric" }).format(e), n.timeSelectorFormatter = (e) => new Intl.DateTimeFormat(n.params.locale, n.params.timePickerFormat).format(e);
		let s = n.timeSelectorFormatter(/* @__PURE__ */ new Date()).toLowerCase();
		n.is12HoursFormat = s.indexOf("pm") >= 0 || s.indexOf("am") >= 0;
		let { monthNames: c, monthNamesShort: l, dayNames: u, dayNamesShort: d } = n.params, { monthNamesIntl: f, monthNamesShortIntl: p, dayNamesIntl: m, dayNamesShortIntl: h } = n.getIntlNames();
		c === "auto" && (c = f), l === "auto" && (l = p), u === "auto" && (u = m), d === "auto" && (d = h), J(n, {
			monthNames: c,
			monthNamesShort: l,
			dayNames: u,
			dayNamesShort: d
		});
		function g() {
			n.open();
		}
		function _(e) {
			e.preventDefault();
		}
		function v() {
			n.setValue([]), n.opened && n.update();
		}
		function y(e) {
			let t = W(e.target);
			n.destroyed || !n.params || n.isPopover() || !n.opened || n.closing || t.closest("[class*=\"backdrop\"]").length || n.monthPickerPopover || n.yearPickerPopover || n.timePickerPopover || (i && i.length > 0 ? t[0] !== i[0] && t.closest(".sheet-modal, .calendar-modal").length === 0 && n.close() : W(e.target).closest(".sheet-modal, .calendar-modal").length === 0 && n.close());
		}
		return J(n, {
			attachInputEvents() {
				n.$inputEl.on("click", g), n.$inputEl.on("input:clear", v), n.params.inputReadOnly && (n.$inputEl.on("focus mousedown", _), n.$inputEl[0] && (n.$inputEl[0].f7ValidateReadonly = !0));
			},
			detachInputEvents() {
				n.$inputEl.off("click", g), n.$inputEl.off("input:clear", v), n.params.inputReadOnly && (n.$inputEl.off("focus mousedown", _), n.$inputEl[0] && delete n.$inputEl[0].f7ValidateReadonly);
			},
			attachHtmlEvents() {
				e.on("click", y);
			},
			detachHtmlEvents() {
				e.off("click", y);
			}
		}), n.attachCalendarEvents = function() {
			let t = !0, r, i, a, o, s, c, l, u, d, f, p, m, h, g, { $el: _, $wrapperEl: v } = n;
			function y(e) {
				i || r || !e.isTrusted || (r = !0, a = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, s = a, o = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, c = o, l = (/* @__PURE__ */ new Date()).getTime(), m = 0, t = !0, g = void 0, d = n.monthsTranslate);
			}
			function b(e) {
				if (!r || !e.isTrusted) return;
				let { isHorizontal: l } = n;
				if (s = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX, c = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY, g === void 0 && (g = !!(g || Math.abs(c - o) > Math.abs(s - a))), l && g || !n.allowTouchMove) {
					r = !1;
					return;
				}
				if (e.preventDefault(), n.animating) {
					r = !1;
					return;
				}
				t = !1, i || (i = !0, f = v[0].offsetWidth, p = v[0].offsetHeight, v.transition(0)), h = l ? s - a : c - o, m = h / (l ? f : p), d = (n.monthsTranslate * n.inverter + m) * 100, v.transform(`translate3d(${l ? d : 0}%, ${l ? 0 : d}%, 0)`);
			}
			function x(a) {
				if (!r || !i || !a.isTrusted) {
					r = !1, i = !1;
					return;
				}
				r = !1, i = !1, u = (/* @__PURE__ */ new Date()).getTime(), u - l < 300 ? Math.abs(h) < 10 ? n.resetMonth() : h >= 10 ? e.rtl ? n.nextMonth() : n.prevMonth() : e.rtl ? n.prevMonth() : n.nextMonth() : m <= -.5 ? e.rtl ? n.prevMonth() : n.nextMonth() : m >= .5 ? e.rtl ? n.nextMonth() : n.prevMonth() : n.resetMonth(), setTimeout(() => {
					t = !0;
				}, 100);
			}
			function S(e) {
				if (!t) return;
				let r = W(e.target).parents(".calendar-day");
				if (r.length === 0 && W(e.target).hasClass("calendar-day") && (r = W(e.target)), r.length === 0 || r.hasClass("calendar-day-disabled")) return;
				n.params.rangePicker || (r.hasClass("calendar-day-next") && n.nextMonth(), r.hasClass("calendar-day-prev") && n.prevMonth());
				let i = parseInt(r.attr("data-year"), 10), a = parseInt(r.attr("data-month"), 10), o = parseInt(r.attr("data-day"), 10);
				if (n.emit("local::dayClick calendarDayClick", n, r[0], i, a, o), !r.hasClass("calendar-day-selected") || n.params.multiple || n.params.rangePicker) {
					let e = new Date(i, a, o, 0, 0, 0);
					n.hasTimePicker && (n.value && n.value[0] ? e.setHours(n.value[0].getHours(), n.value[0].getMinutes()) : e.setHours((/* @__PURE__ */ new Date()).getHours(), (/* @__PURE__ */ new Date()).getMinutes())), n.addValue(e);
				}
				n.params.closeOnSelect && (n.params.rangePicker && n.value.length === 2 || !n.params.rangePicker) && n.close();
			}
			function C() {
				n.nextMonth();
			}
			function w() {
				n.prevMonth();
			}
			function T() {
				n.nextYear();
			}
			function E() {
				n.prevYear();
			}
			function D() {
				n.openMonthPicker();
			}
			function O() {
				n.openYearPicker();
			}
			function k() {
				n.openTimePicker();
			}
			let A = e.touchEvents.start === "touchstart" && Y().passiveListener ? {
				passive: !0,
				capture: !1
			} : !1;
			_.find(".calendar-prev-month-button").on("click", w), _.find(".calendar-next-month-button").on("click", C), _.find(".calendar-prev-year-button").on("click", E), _.find(".calendar-next-year-button").on("click", T), n.params.monthPicker && _.find(".current-month-value").on("click", D), n.params.yearPicker && _.find(".current-year-value").on("click", O), n.hasTimePicker && _.find(".calendar-time-selector a").on("click", k), v.on("click", S), n.params.touchMove && (v.on(e.touchEvents.start, y, A), e.on("touchmove:active", b), e.on("touchend:passive", x)), n.detachCalendarEvents = function() {
				_.find(".calendar-prev-month-button").off("click", w), _.find(".calendar-next-month-button").off("click", C), _.find(".calendar-prev-year-button").off("click", E), _.find(".calendar-next-year-button").off("click", T), n.params.monthPicker && _.find(".current-month-value").off("click", D), n.params.yearPicker && _.find(".current-year-value").off("click", O), n.hasTimePicker && _.find(".calendar-time-selector a").off("click", k), v.off("click", S), n.params.touchMove && (v.off(e.touchEvents.start, y, A), e.off("touchmove:active", b), e.off("touchend:passive", x));
			};
		}, n.init(), n;
	}
	get view() {
		let { $inputEl: e, app: t, params: n } = this, r;
		return n.view ? r = n.view : e && (r = e.parents(".view").length && e.parents(".view")[0].f7View), r ||= t.views.main, r;
	}
	getIntlNames() {
		let e = this, t = e.params.locale, n = [], r = [], i = [], a = [], o = new Intl.DateTimeFormat(t, { month: "long" }), s = new Intl.DateTimeFormat(t, { month: "short" }), c = new Intl.DateTimeFormat(t, { weekday: "long" }), l = new Intl.DateTimeFormat(t, { weekday: "short" }), u, d, f;
		for (let t = 0; t < 24; t += 1) {
			let i = (/* @__PURE__ */ new Date()).setMonth(t, 1), a = e.yearFormatter(i);
			u && a !== u && (d && (f = !0), d = !0, u = a), u ||= a, d && u === a && !f && (n.push(o.format(i)), r.push(s.format(i)));
		}
		let p = (/* @__PURE__ */ new Date()).getDay();
		for (let e = 0; e < 7; e += 1) {
			let t = (/* @__PURE__ */ new Date()).getTime() + (e - p) * 24 * 60 * 60 * 1e3;
			i.push(c.format(t)), a.push(l.format(t));
		}
		return {
			monthNamesIntl: n,
			monthNamesShortIntl: r,
			dayNamesIntl: i,
			dayNamesShortIntl: a
		};
	}
	normalizeDate(e) {
		let t = this, n = new Date(e);
		return t.hasTimePicker ? new Date(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes()) : new Date(n.getFullYear(), n.getMonth(), n.getDate());
	}
	normalizeValues(e) {
		let t = this, n = [];
		return e && Array.isArray(e) && (n = e.map((e) => t.normalizeDate(e))), n;
	}
	initInput() {
		let e = this;
		e.$inputEl && e.params.inputReadOnly && e.$inputEl.prop("readOnly", !0);
	}
	isPopover() {
		let e = this, { app: t, modal: n, params: r } = e, i = X();
		if (r.openIn === "sheet" || n && n.type !== "popover") return !1;
		if (!e.inline && e.inputEl) {
			if (r.openIn === "popover") return !0;
			if (i.ios) return !!i.ipad;
			if (t.width >= 768) return !0;
		}
		return !1;
	}
	formatDate(e) {
		let t = this, n = new Date(e), r = n.getFullYear(), i = n.getMonth(), a = i + 1, o = n.getDate(), s = n.getDay(), { monthNames: c, monthNamesShort: l, dayNames: u, dayNamesShort: d } = t, { dateFormat: f, locale: p } = t.params;
		function m(e) {
			return e < 10 ? `0${e}` : e;
		}
		if (typeof f == "string") {
			let e = {
				yyyy: r,
				yy: String(r).substring(2),
				mm: m(a),
				m: a,
				MM: c[i],
				M: l[i],
				dd: m(o),
				d: o,
				DD: u[s],
				D: d[s]
			};
			if (t.params.timePicker) {
				let t = n.getHours(), r = n.getMinutes(), i = n.getSeconds(), a = t;
				t > 12 && (a = t - 12), t === 0 && (a = 12);
				let o = t >= 12 && t !== 0 ? "pm" : "am";
				Object.assign(e, {
					HH: m(t),
					H: t,
					hh: m(a),
					h: a,
					ss: m(i),
					s: i,
					":mm": m(r),
					":m": r,
					a: o,
					A: o.toUpperCase()
				});
			}
			let p = new RegExp(Object.keys(e).map((e) => `(${e})`).join("|"), "g");
			return f.replace(p, (t) => t in e ? e[t] : t);
		}
		return typeof f == "function" ? f(n) : new Intl.DateTimeFormat(p, f).format(n);
	}
	formatValue() {
		let e = this, { value: t } = e;
		return e.params.formatValue ? e.params.formatValue.call(e, t) : t.map((t) => e.formatDate(t)).join(e.params.rangePicker ? " - " : ", ");
	}
	addValue(e) {
		let t = this, { multiple: n, rangePicker: r, rangePickerMinDays: i, rangePickerMaxDays: a } = t.params;
		if (n) {
			t.value ||= [];
			let n;
			for (let r = 0; r < t.value.length; r += 1) new Date(e).getTime() === new Date(t.value[r]).getTime() && (n = r);
			n === void 0 ? t.value.push(e) : t.value.splice(n, 1), t.updateValue();
		} else r ? (t.value ||= [], (t.value.length === 2 || t.value.length === 0) && (t.value = []), t.value.length === 0 || Math.abs(t.value[0].getTime() - e.getTime()) >= (i - 1) * 60 * 60 * 24 * 1e3 && (a === 0 || Math.abs(t.value[0].getTime() - e.getTime()) <= (a - 1) * 60 * 60 * 24 * 1e3) ? t.value.push(e) : t.value = [], t.value.sort((e, t) => e - t), t.updateValue()) : (t.value = [e], t.updateValue());
	}
	setValue(e) {
		let t = this, n = t.value;
		if (Array.isArray(n) && Array.isArray(e) && n.length === e.length) {
			let t = !0;
			if (n.forEach((n, r) => {
				n !== e[r] && (t = !1);
			}), t) return;
		}
		t.value = e, t.updateValue();
	}
	getValue() {
		return this.value;
	}
	updateValue(e) {
		let t = this, { $el: n, $wrapperEl: r, $inputEl: i, value: a, params: o } = t, s;
		if (n && n.length > 0) {
			r.find(".calendar-day-selected").removeClass("calendar-day-selected calendar-day-selected-range calendar-day-selected-left calendar-day-selected-right");
			let e;
			if (o.rangePicker && a.length === 2) {
				let t = new Date(a[0]).getTime(), n = new Date(a[1]).getTime();
				for (s = t; s <= n; s += 1440 * 60 * 1e3) {
					e = new Date(s);
					let i = "calendar-day-selected";
					t !== n && (s !== t && s !== n && (i += " calendar-day-selected-range"), s === t && (i += " calendar-day-selected-left"), s === n && (i += " calendar-day-selected-right")), r.find(`.calendar-day[data-date="${e.getFullYear()}-${e.getMonth()}-${e.getDate()}"]`).addClass(i);
				}
				e = new Date(t), r.find(`.calendar-day[data-date="${e.getFullYear()}-${e.getMonth()}-${e.getDate()}"]`).removeClass("calendar-day-selected-range").addClass("calendar-day-selected calendar-day-selected-left"), e = new Date(n), r.find(`.calendar-day[data-date="${e.getFullYear()}-${e.getMonth()}-${e.getDate()}"]`).removeClass("calendar-day-selected-range").addClass("calendar-day-selected calendar-day-selected-right");
			} else for (s = 0; s < t.value.length; s += 1) e = new Date(a[s]), r.find(`.calendar-day[data-date="${e.getFullYear()}-${e.getMonth()}-${e.getDate()}"]`).addClass("calendar-day-selected");
		}
		if (e || t.emit("local::change calendarChange", t, a), n && n.length > 0 && t.hasTimePicker && n.find(".calendar-time-selector a").text(a && a.length ? t.timeSelectorFormatter(a[0]) : t.params.timePickerPlaceholder), i && i.length || o.header) {
			let r = t.formatValue(a);
			o.header && n && n.length && n.find(".calendar-selected-date").text(r), i && i.length && !e && (i.val(r), i.trigger("change"));
		}
	}
	updateCurrentMonthYear(e) {
		let t = this, { $months: n, $el: r, monthNames: i } = t, a, o;
		e === void 0 ? (t.currentMonth = parseInt(n.eq(1).attr("data-month"), 10), t.currentYear = parseInt(n.eq(1).attr("data-year"), 10), a = n.eq(1).attr("data-locale-month"), o = n.eq(1).attr("data-locale-year")) : (t.currentMonth = parseInt(n.eq(e === "next" ? n.length - 1 : 0).attr("data-month"), 10), t.currentYear = parseInt(n.eq(e === "next" ? n.length - 1 : 0).attr("data-year"), 10), a = n.eq(e === "next" ? n.length - 1 : 0).attr("data-locale-month"), o = n.eq(e === "next" ? n.length - 1 : 0).attr("data-locale-year")), r.find(".current-month-value").text(i[a]), r.find(".current-year-value").text(o);
	}
	update() {
		let e = this, { currentYear: t, currentMonth: n, $wrapperEl: r } = e, i = new Date(t, n), a = e.renderMonth(i, "prev"), o = e.renderMonth(i), s = e.renderMonth(i, "next");
		r.transition(0).html(`${a}${o}${s}`).transform("translate3d(0,0,0)"), e.$months = r.find(".calendar-month"), e.monthsTranslate = 0, e.setMonthsTranslate(), e.$months.each((t) => {
			e.emit("local::monthAdd calendarMonthAdd", t);
		});
	}
	onMonthChangeStart(e) {
		let t = this, { $months: n, currentYear: r, currentMonth: i } = t;
		t.updateCurrentMonthYear(e), n.removeClass("calendar-month-current calendar-month-prev calendar-month-next");
		let a = e === "next" ? n.length - 1 : 0;
		n.eq(a).addClass("calendar-month-current"), n.eq(e === "next" ? a - 1 : a + 1).addClass(e === "next" ? "calendar-month-prev" : "calendar-month-next"), t.emit("local::monthYearChangeStart calendarMonthYearChangeStart", t, r, i);
	}
	onMonthChangeEnd(e, t) {
		let n = this, { currentYear: r, currentMonth: i, $wrapperEl: a, monthsTranslate: o } = n;
		n.animating = !1;
		let s, c, l;
		a.find(".calendar-month:not(.calendar-month-prev):not(.calendar-month-current):not(.calendar-month-next)").remove(), e === void 0 && (e = "next", t = !0), t ? (a.find(".calendar-month-next, .calendar-month-prev").remove(), c = n.renderMonth(new Date(r, i), "prev"), s = n.renderMonth(new Date(r, i), "next")) : l = n.renderMonth(new Date(r, i), e), (e === "next" || t) && a.append(l || s), (e === "prev" || t) && a.prepend(l || c);
		let u = a.find(".calendar-month");
		n.$months = u, n.setMonthsTranslate(o), n.emit("local::monthAdd calendarMonthAdd", n, e === "next" ? u.eq(u.length - 1)[0] : u.eq(0)[0]), n.emit("local::monthYearChangeEnd calendarMonthYearChangeEnd", n, r, i);
	}
	setMonthsTranslate(e) {
		let t = this, { $months: n, isHorizontal: r, inverter: i } = t;
		e = e || t.monthsTranslate || 0, t.monthsTranslate === void 0 && (t.monthsTranslate = e), n.removeClass("calendar-month-current calendar-month-prev calendar-month-next");
		let a = -(e + 1) * 100 * i, o = -e * 100 * i, s = -(e - 1) * 100 * i;
		n.eq(0).transform(`translate3d(${r ? a : 0}%, ${r ? 0 : a}%, 0)`).addClass("calendar-month-prev"), n.eq(1).transform(`translate3d(${r ? o : 0}%, ${r ? 0 : o}%, 0)`).addClass("calendar-month-current"), n.eq(2).transform(`translate3d(${r ? s : 0}%, ${r ? 0 : s}%, 0)`).addClass("calendar-month-next");
	}
	nextMonth(e) {
		let t = this, { params: n, $wrapperEl: r, inverter: i, isHorizontal: a } = t;
		(e === void 0 || typeof e == "object") && (e = "", n.animate || (e = 0));
		let o = parseInt(t.$months.eq(t.$months.length - 1).attr("data-month"), 10), s = parseInt(t.$months.eq(t.$months.length - 1).attr("data-year"), 10), c = new Date(s, o).getTime(), l = !t.animating;
		if (n.maxDate && c > new Date(n.maxDate).getTime()) {
			t.resetMonth();
			return;
		}
		if (--t.monthsTranslate, o === t.currentMonth) {
			let e = -t.monthsTranslate * 100 * i, n = W(t.renderMonth(c, "next")).transform(`translate3d(${a ? e : 0}%, ${a ? 0 : e}%, 0)`).addClass("calendar-month-next");
			r.append(n[0]), t.$months = r.find(".calendar-month"), t.emit("local::monthAdd calendarMonthAdd", t.$months.eq(t.$months.length - 1)[0]);
		}
		t.animating = !0, t.onMonthChangeStart("next");
		let u = t.monthsTranslate * 100 * i;
		r.transition(e).transform(`translate3d(${a ? u : 0}%, ${a ? 0 : u}%, 0)`), l && r.transitionEnd(() => {
			t.onMonthChangeEnd("next");
		}), n.animate || t.onMonthChangeEnd("next");
	}
	prevMonth(e) {
		let t = this, { params: n, $wrapperEl: r, inverter: i, isHorizontal: a } = t;
		(e === void 0 || typeof e == "object") && (e = "", n.animate || (e = 0));
		let o = parseInt(t.$months.eq(0).attr("data-month"), 10), s = parseInt(t.$months.eq(0).attr("data-year"), 10), c = new Date(s, o + 1, -1).getTime(), l = !t.animating;
		if (n.minDate) {
			let e = new Date(n.minDate);
			if (e = new Date(e.getFullYear(), e.getMonth(), 1), c < e.getTime()) {
				t.resetMonth();
				return;
			}
		}
		if (t.monthsTranslate += 1, o === t.currentMonth) {
			let e = -t.monthsTranslate * 100 * i, n = W(t.renderMonth(c, "prev")).transform(`translate3d(${a ? e : 0}%, ${a ? 0 : e}%, 0)`).addClass("calendar-month-prev");
			r.prepend(n[0]), t.$months = r.find(".calendar-month"), t.emit("local::monthAdd calendarMonthAdd", t.$months.eq(0)[0]);
		}
		t.animating = !0, t.onMonthChangeStart("prev");
		let u = t.monthsTranslate * 100 * i;
		r.transition(e).transform(`translate3d(${a ? u : 0}%, ${a ? 0 : u}%, 0)`), l && r.transitionEnd(() => {
			t.onMonthChangeEnd("prev");
		}), n.animate || t.onMonthChangeEnd("prev");
	}
	resetMonth(e) {
		e === void 0 && (e = "");
		let { $wrapperEl: t, inverter: n, isHorizontal: r, monthsTranslate: i } = this, a = i * 100 * n;
		t.transition(e).transform(`translate3d(${r ? a : 0}%, ${r ? 0 : a}%, 0)`);
	}
	setYearMonth(e, t, n) {
		let r = this, { params: i, isHorizontal: a, $wrapperEl: o, inverter: s } = r;
		e === void 0 && (e = r.currentYear), t === void 0 && (t = r.currentMonth), (n === void 0 || typeof n == "object") && (n = "", i.animate || (n = 0));
		let c;
		if (c = e < r.currentYear ? new Date(e, t + 1, -1).getTime() : new Date(e, t).getTime(), i.maxDate && c > new Date(i.maxDate).getTime()) return !1;
		if (i.minDate) {
			let e = new Date(i.minDate);
			if (e = new Date(e.getFullYear(), e.getMonth(), 1), c < e.getTime()) return !1;
		}
		let l = new Date(r.currentYear, r.currentMonth).getTime(), u = c > l ? "next" : "prev", d = r.renderMonth(new Date(e, t));
		r.monthsTranslate = r.monthsTranslate || 0;
		let f = r.monthsTranslate, p, m = !r.animating && n !== 0;
		c > l ? (--r.monthsTranslate, r.animating || r.$months.eq(r.$months.length - 1).remove(), o.append(d), r.$months = o.find(".calendar-month"), p = -(f - 1) * 100 * s, r.$months.eq(r.$months.length - 1).transform(`translate3d(${a ? p : 0}%, ${a ? 0 : p}%, 0)`).addClass("calendar-month-next")) : (r.monthsTranslate += 1, r.animating || r.$months.eq(0).remove(), o.prepend(d), r.$months = o.find(".calendar-month"), p = -(f + 1) * 100 * s, r.$months.eq(0).transform(`translate3d(${a ? p : 0}%, ${a ? 0 : p}%, 0)`).addClass("calendar-month-prev")), r.emit("local::monthAdd calendarMonthAdd", u === "next" ? r.$months.eq(r.$months.length - 1)[0] : r.$months.eq(0)[0]), r.animating = !0, r.onMonthChangeStart(u);
		let h = r.monthsTranslate * 100 * s;
		o.transition(n).transform(`translate3d(${a ? h : 0}%, ${a ? 0 : h}%, 0)`), m && o.transitionEnd(() => {
			r.onMonthChangeEnd(u, !0);
		}), (!i.animate || n === 0) && r.onMonthChangeEnd(u, !0);
	}
	nextYear() {
		let e = this;
		e.setYearMonth(e.currentYear + 1);
	}
	prevYear() {
		let e = this;
		e.setYearMonth(e.currentYear - 1);
	}
	dateInRange(e, t) {
		let n = !1, r;
		if (!t) return !1;
		if (Array.isArray(t)) for (r = 0; r < t.length; r += 1) t[r].from || t[r].to ? t[r].from && t[r].to ? e <= new Date(t[r].to).getTime() && e >= new Date(t[r].from).getTime() && (n = !0) : t[r].from ? e >= new Date(t[r].from).getTime() && (n = !0) : t[r].to && e <= new Date(t[r].to).getTime() && (n = !0) : t[r].date ? e === new Date(t[r].date).getTime() && (n = !0) : e === new Date(t[r]).getTime() && (n = !0);
		else t.from || t.to ? t.from && t.to ? e <= new Date(t.to).getTime() && e >= new Date(t.from).getTime() && (n = !0) : t.from ? e >= new Date(t.from).getTime() && (n = !0) : t.to && e <= new Date(t.to).getTime() && (n = !0) : t.date ? n = e === new Date(t.date).getTime() : typeof t == "function" && (n = t(new Date(e)));
		return n;
	}
	daysInMonth(e) {
		let t = new Date(e);
		return new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
	}
	renderMonths(e) {
		let t = this;
		return t.params.renderMonths ? t.params.renderMonths.call(t, e) : Q("div", { class: "calendar-months-wrapper" }, t.renderMonth(e, "prev"), t.renderMonth(e), t.renderMonth(e, "next"));
	}
	renderMonth(e, t) {
		let n = this, { params: r, value: i } = n;
		if (r.renderMonth) return r.renderMonth.call(n, e, t);
		let a = new Date(e), o = a.getFullYear(), s = a.getMonth(), c = n.monthNames.indexOf(n.monthFormatter(a));
		c < 0 && (c = s);
		let l = n.yearFormatter(a);
		t === "next" && (a = s === 11 ? new Date(o + 1, 0) : new Date(o, s + 1, 1)), t === "prev" && (a = s === 0 ? new Date(o - 1, 11) : new Date(o, s - 1, 1)), (t === "next" || t === "prev") && (s = a.getMonth(), o = a.getFullYear(), c = n.monthNames.indexOf(n.monthFormatter(a)), c < 0 && (c = s), l = n.yearFormatter(a));
		let u = [], d = (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0), f = r.minDate ? new Date(r.minDate).getTime() : null, p = r.maxDate ? new Date(r.maxDate).getTime() : null, m = n.daysInMonth(new Date(a.getFullYear(), a.getMonth()).getTime() - 14400 * 60 * 1e3), h = n.daysInMonth(a), g = r.firstDay === 6 ? 0 : 1, _ = "", v = 0 + (r.firstDay - 1), y, b, x = new Date(a.getFullYear(), a.getMonth()).getDay();
		if (x === 0 && (x = 7), i && i.length) for (let e = 0; e < i.length; e += 1) u.push(new Date(i[e]).setHours(0, 0, 0, 0));
		for (let e = 1; e <= 6; e += 1) {
			let t = "";
			for (let i = 1; i <= 7; i += 1) {
				v += 1;
				let a, c = v - x, l = "";
				e === 1 && i === 1 && c > g && r.firstDay !== 1 && (v -= 7, c = v - x);
				let _ = i - 1 + r.firstDay > 6 ? i - 1 - 7 + r.firstDay : i - 1 + r.firstDay;
				c < 0 ? (c = m + c + 1, l += " calendar-day-prev", a = new Date(s - 1 < 0 ? o - 1 : o, s - 1 < 0 ? 11 : s - 1, c).getTime()) : (c += 1, c > h ? (c -= h, l += " calendar-day-next", a = new Date(s + 1 > 11 ? o + 1 : o, s + 1 > 11 ? 0 : s + 1, c).getTime()) : a = new Date(o, s, c).getTime()), a === d && (l += " calendar-day-today"), r.rangePicker && u.length === 2 ? (a >= u[0] && a <= u[1] && (l += " calendar-day-selected"), u[0] !== u[1] && (a > u[0] && a < u[1] && (l += " calendar-day-selected-range"), a === u[0] && (l += " calendar-day-selected-left"), a === u[1] && (l += " calendar-day-selected-right"))) : u.indexOf(a) >= 0 && (l += " calendar-day-selected"), r.weekendDays.indexOf(_) >= 0 && (l += " calendar-day-weekend");
				let S = "";
				if (b = !1, r.events && n.dateInRange(a, r.events) && (b = !0), b && (l += " calendar-day-has-events", S = "\n            <span class=\"calendar-day-events\">\n              <span class=\"calendar-day-event\"></span>\n            </span>\n          ", Array.isArray(r.events))) {
					let e = [];
					r.events.forEach((t) => {
						let r = t.color || "";
						e.indexOf(r) < 0 && n.dateInRange(a, t) && e.push(r);
					}), S = `
              <span class="calendar-day-events">
                ${e.map((e) => `
                  <span class="calendar-day-event" style="${e ? `background-color: ${e}` : ""}"></span>
                `.trim()).join("")}
              </span>
            `;
				}
				if (r.rangesClasses) for (let e = 0; e < r.rangesClasses.length; e += 1) n.dateInRange(a, r.rangesClasses[e].range) && (l += ` ${r.rangesClasses[e].cssClass}`);
				y = !1, (f && a < f || p && a > p) && (y = !0), r.disabled && n.dateInRange(a, r.disabled) && (y = !0), y && (l += " calendar-day-disabled"), a = new Date(a);
				let C = a.getFullYear(), w = a.getMonth(), T = n.dayFormatter(a);
				t += `
          <div data-year="${C}" data-month="${w}" data-day="${c}" class="calendar-day${l}" data-date="${C}-${w}-${c}">
            <span class="calendar-day-number">${T}${S}</span>
          </div>`.trim();
			}
			_ += `<div class="calendar-row">${t}</div>`;
		}
		return _ = `<div class="calendar-month" data-year="${o}" data-month="${s}" data-locale-year="${l}" data-locale-month="${c}">${_}</div>`, _;
	}
	renderWeekHeader() {
		let e = this;
		if (e.params.renderWeekHeader) return e.params.renderWeekHeader.call(e);
		let { params: t } = e, n = "";
		for (let r = 0; r < 7; r += 1) {
			let i = r + t.firstDay > 6 ? r - 7 + t.firstDay : r + t.firstDay, a = e.dayNamesShort[i];
			n += `<div class="calendar-week-day">${a}</div>`;
		}
		return Q("div", { class: "calendar-week-header" }, n);
	}
	renderMonthSelector() {
		let e = this;
		return e.params.renderMonthSelector ? e.params.renderMonthSelector.call(e) : Q("div", { class: "calendar-month-selector" }, Q("a", { class: "link icon-only calendar-prev-month-button" }, Q("i", { class: "icon icon-prev" })), e.params.monthPicker ? Q("a", { class: "current-month-value link" }) : Q("span", { class: "current-month-value" }), Q("a", { class: "link icon-only calendar-next-month-button" }, Q("i", { class: "icon icon-next" })));
	}
	renderYearSelector() {
		let e = this;
		return e.params.renderYearSelector ? e.params.renderYearSelector.call(e) : Q("div", { class: "calendar-year-selector" }, Q("a", { class: "link icon-only calendar-prev-year-button" }, Q("i", { class: "icon icon-prev" })), e.params.yearPicker ? Q("a", { class: "current-year-value link" }) : Q("span", { class: "current-year-value" }), Q("a", { class: "link icon-only calendar-next-year-button" }, Q("i", { class: "icon icon-next" })));
	}
	renderTimeSelector() {
		let e = this, t = e.value && e.value[0], n;
		return t && (n = e.timeSelectorFormatter(t)), Q("div", { class: "calendar-time-selector" }, Q("span", null, e.params.timePickerLabel), Q("a", { class: "link" }, n || e.params.timePickerPlaceholder));
	}
	renderHeader() {
		let e = this;
		return e.params.renderHeader ? e.params.renderHeader.call(e) : Q("div", { class: "calendar-header" }, Q("div", { class: "calendar-selected-date" }, e.params.headerPlaceholder));
	}
	renderFooter() {
		let e = this, t = e.app;
		return e.params.renderFooter ? e.params.renderFooter.call(e) : Q("div", { class: "calendar-footer" }, Q("a", { class: `${t.theme === "md" ? "button button-round" : "link"} calendar-close sheet-close popover-close` }, e.params.toolbarCloseText));
	}
	renderToolbar() {
		let e = this;
		return e.params.renderToolbar ? e.params.renderToolbar.call(e, e) : Q("div", { class: "toolbar toolbar-top" }, Q("div", { class: "toolbar-inner" }, e.params.monthSelector ? e.renderMonthSelector() : "", e.params.yearSelector ? e.renderYearSelector() : ""));
	}
	renderInline() {
		let e = this, { cssClass: t, toolbar: n, header: r, footer: i, rangePicker: a, weekHeader: o } = e.params, { value: s, hasTimePicker: c } = e, l = s && s.length ? s[0] : (/* @__PURE__ */ new Date()).setHours(0, 0, 0);
		return Q("div", { class: `calendar calendar-inline ${a ? "calendar-range" : ""} ${t || ""}` }, r && e.renderHeader(), n && e.renderToolbar(), o && e.renderWeekHeader(), Q("div", { class: "calendar-months" }, e.renderMonths(l)), c && e.renderTimeSelector(), i && e.renderFooter());
	}
	renderCustomModal() {
		let e = this, { cssClass: t, toolbar: n, header: r, footer: i, rangePicker: a, weekHeader: o } = e.params, { value: s, hasTimePicker: c } = e, l = s && s.length ? s[0] : (/* @__PURE__ */ new Date()).setHours(0, 0, 0);
		return Q("div", { class: `calendar calendar-modal ${a ? "calendar-range" : ""} ${t || ""}` }, r && e.renderHeader(), n && e.renderToolbar(), o && e.renderWeekHeader(), Q("div", { class: "calendar-months" }, e.renderMonths(l)), c && e.renderTimeSelector(), i && e.renderFooter());
	}
	renderSheet() {
		let e = this, { cssClass: t, toolbar: n, header: r, footer: i, rangePicker: a, weekHeader: o } = e.params, { value: s, hasTimePicker: c } = e, l = s && s.length ? s[0] : (/* @__PURE__ */ new Date()).setHours(0, 0, 0);
		return Q("div", { class: `sheet-modal calendar calendar-sheet ${a ? "calendar-range" : ""} ${t || ""}` }, r && e.renderHeader(), n && e.renderToolbar(), o && e.renderWeekHeader(), Q("div", { class: "sheet-modal-inner calendar-months" }, e.renderMonths(l)), c && e.renderTimeSelector(), i && e.renderFooter());
	}
	renderPopover() {
		let e = this, { cssClass: t, toolbar: n, header: r, footer: i, rangePicker: a, weekHeader: o } = e.params, { value: s, hasTimePicker: c } = e, l = s && s.length ? s[0] : (/* @__PURE__ */ new Date()).setHours(0, 0, 0);
		return Q("div", { class: "popover calendar-popover" }, Q("div", { class: "popover-inner" }, Q("div", { class: `calendar ${a ? "calendar-range" : ""} ${t || ""}` }, r && e.renderHeader(), n && e.renderToolbar(), o && e.renderWeekHeader(), Q("div", { class: "calendar-months" }, e.renderMonths(l)), c && e.renderTimeSelector(), i && e.renderFooter())));
	}
	render() {
		let e = this, { params: t } = e;
		if (t.render) return t.render.call(e);
		if (!e.inline) {
			let n = t.openIn;
			return n === "auto" && (n = e.isPopover() ? "popover" : "sheet"), n === "popover" ? e.renderPopover() : n === "sheet" ? e.renderSheet() : e.renderCustomModal();
		}
		return e.renderInline();
	}
	openMonthPicker() {
		let e = this, { $el: t, app: n } = e;
		if (!t || !t.length) return;
		t.append("<div class=\"popover calendar-popover calendar-month-picker-popover\"><div class=\"popover-inner\"><div class=\"calendar-month-picker\"></div></div></div>"), e.monthPickerPopover = n.popover.create({
			el: t.find(".calendar-month-picker-popover"),
			targetEl: t.find(".calendar-month-selector"),
			backdrop: !0,
			backdropUnique: !0,
			on: {
				close() {
					e.closeMonthPicker();
				},
				closed() {
					e.monthPickerPopover.$el && e.monthPickerPopover.$el.remove(), e.monthPickerPopover.destroy(), e.monthPickerInstance && (e.monthPickerInstance.close(), e.monthPickerInstance.destroy()), delete e.monthPickerInstance, delete e.monthPickerPopover;
				}
			}
		}), e.monthPickerPopover.open();
		let r = parseInt(e.$el.find(".calendar-month-current").attr("data-locale-month"), 10), i = [], a = [];
		e.monthNames.forEach((e, t) => {
			i.push(t), a.push(e);
		}), e.monthPickerInstance = n.picker.create({
			containerEl: e.monthPickerPopover.$el.find(".calendar-month-picker"),
			value: [r],
			toolbar: e.params.monthPickerToolbar,
			rotateEffect: !1,
			toolbarCloseText: e.params.monthPickerCloseText,
			cols: [{
				values: i,
				displayValues: a
			}]
		});
	}
	closeMonthPicker() {
		let e = this;
		e.monthPickerPopover && e.monthPickerPopover.opened && e.monthPickerPopover.close();
		let t = e.monthPickerInstance.value[0] - (parseInt(e.$el.find(".calendar-month-current").attr("data-locale-month"), 10) - e.currentMonth);
		e.setYearMonth(e.currentYear, t, 0);
	}
	openYearPicker() {
		let e = this, { $el: t, app: n } = e;
		if (!t || !t.length) return;
		t.append("<div class=\"popover calendar-popover calendar-year-picker-popover\"><div class=\"popover-inner\"><div class=\"calendar-year-picker\"></div></div></div>"), e.yearPickerPopover = n.popover.create({
			el: t.find(".calendar-year-picker-popover"),
			targetEl: t.find(".calendar-year-selector"),
			backdrop: !0,
			backdropUnique: !0,
			on: {
				close() {
					e.closeYearPicker();
				},
				closed() {
					e.yearPickerPopover.$el && e.yearPickerPopover.$el.remove(), e.yearPickerPopover.destroy(), e.yearPickerInstance && (e.yearPickerInstance.close(), e.yearPickerInstance.destroy()), delete e.yearPickerInstance, delete e.yearPickerPopover;
				}
			}
		}), e.yearPickerPopover.open();
		let r = e.currentYear, i = e.params.yearPickerMin || (/* @__PURE__ */ new Date()).getFullYear() - 100;
		e.params.minDate && (i = Math.max(i, new Date(e.params.minDate).getFullYear()));
		let a = e.params.yearPickerMax || (/* @__PURE__ */ new Date()).getFullYear() + 100;
		e.params.maxDate && (a = Math.min(a, new Date(e.params.maxDate).getFullYear()));
		let o = [];
		for (let e = i; e <= a; e += 1) o.push(e);
		e.yearPickerInstance = n.picker.create({
			containerEl: e.yearPickerPopover.$el.find(".calendar-year-picker"),
			value: [r],
			toolbar: e.params.yearPickerToolbar,
			rotateEffect: !1,
			toolbarCloseText: e.params.yearPickerCloseText,
			cols: [{ values: o }]
		});
	}
	closeYearPicker() {
		let e = this;
		e.yearPickerPopover && e.yearPickerPopover.opened && e.yearPickerPopover.close(), e.setYearMonth(e.yearPickerInstance.value[0], void 0, 0);
	}
	openTimePicker() {
		let e = this, { $el: t, app: n, is12HoursFormat: r } = e;
		if (!t || !t.length) return;
		t.append("<div class=\"popover calendar-popover calendar-time-picker-popover\"><div class=\"popover-inner\"><div class=\"calendar-time-picker\"></div></div></div>");
		let i = [], a = [], o = +!!r, s = r ? 12 : 23;
		for (let e = o; e <= s; e += 1) i.push(e);
		for (let e = 0; e <= 59; e += 1) a.push(e);
		let c;
		c = e.value && e.value.length ? [e.value[0].getHours(), e.value[0].getMinutes()] : [(/* @__PURE__ */ new Date()).getHours(), (/* @__PURE__ */ new Date()).getMinutes()], r && (c.push(c[0] < 12 ? "AM" : "PM"), c[0] > 12 && (c[0] -= 12), c[0] === 0 && (c[0] = 12)), e.timePickerPopover = n.popover.create({
			el: t.find(".calendar-time-picker-popover"),
			targetEl: t.find(".calendar-time-selector .link"),
			backdrop: !0,
			backdropUnique: !0,
			on: {
				close() {
					e.closeTimePicker();
				},
				closed() {
					e.timePickerPopover.$el && e.timePickerPopover.$el.remove(), e.timePickerPopover.destroy(), e.timePickerInstance && (e.timePickerInstance.close(), e.timePickerInstance.destroy()), delete e.timePickerInstance, delete e.timePickerPopover;
				}
			}
		}), e.timePickerPopover.open(), e.timePickerInstance = n.picker.create({
			containerEl: e.timePickerPopover.$el.find(".calendar-time-picker"),
			value: c,
			toolbar: e.params.timePickerToolbar,
			rotateEffect: !1,
			toolbarCloseText: e.params.timePickerCloseText,
			cols: [
				{ values: i },
				{
					divider: !0,
					content: ":"
				},
				{
					values: a,
					displayValues: a.map((e) => e < 10 ? `0${e}` : e)
				},
				...r ? [{ values: ["AM", "PM"] }] : []
			]
		});
	}
	closeTimePicker() {
		let e = this, { is12HoursFormat: t } = e;
		if (e.timePickerInstance) {
			let n = e.timePickerInstance.value, r = parseInt(n[0], 10), i = parseInt(n[1], 10), a = e.timePickerInstance.value[2];
			t && (a === "AM" && r === 12 ? r = 0 : a === "PM" && r !== 12 && (r += 12));
			let o = e.value && e.value.length && e.value[0];
			o ? (o = new Date(o), o.setHours(r, i)) : (o = /* @__PURE__ */ new Date(), o.setHours(r, i, 0, 0)), e.setValue([o]), e.timePickerPopover && e.timePickerPopover.opened && e.timePickerPopover.close();
		}
	}
	onOpen() {
		let e = this, { initialized: t, $el: n, app: r, $inputEl: i, inline: a, value: o, params: s } = e;
		e.closing = !1, e.opened = !0, e.opening = !0, e.attachCalendarEvents();
		let c = !o && s.value;
		t ? o && e.setValue(o, 0) : o ? e.setValue(o, 0) : s.value && e.setValue(e.normalizeValues(s.value), 0), e.updateCurrentMonthYear(), e.monthsTranslate = 0, e.setMonthsTranslate(), c ? e.updateValue() : s.header && o && e.updateValue(!0), !a && i && i.length && r.theme === "md" && i.trigger("focus"), e.initialized = !0, e.$months.each((t) => {
			e.emit("local::monthAdd calendarMonthAdd", t);
		}), n && n.trigger("calendar:open"), i && i.trigger("calendar:open"), e.emit("local::open calendarOpen", e);
	}
	onOpened() {
		let e = this;
		e.opening = !1, e.$el && e.$el.trigger("calendar:opened"), e.$inputEl && e.$inputEl.trigger("calendar:opened"), e.emit("local::opened calendarOpened", e);
	}
	onClose() {
		let e = this, t = e.app;
		if (e.opening = !1, e.closing = !0, e.$inputEl) if (t.theme === "md") e.$inputEl.trigger("blur");
		else {
			let n = e.$inputEl.attr("validate"), r = e.$inputEl.attr("required");
			n && r && t.input.validate(e.$inputEl);
		}
		e.detachCalendarEvents && e.detachCalendarEvents(), e.$el && e.$el.trigger("calendar:close"), e.$inputEl && e.$inputEl.trigger("calendar:close"), e.emit("local::close calendarClose", e);
	}
	onClosed() {
		let e = this;
		e.opened = !1, e.closing = !1, e.inline || Ua(() => {
			e.modal && e.modal.el && e.modal.destroy && (e.params.routableModals || e.modal.destroy()), delete e.modal;
		}), e.timePickerInstance && (e.timePickerInstance.destroy && e.timePickerInstance.destroy(), delete e.timePickerInstance), e.$el && e.$el.trigger("calendar:closed"), e.$inputEl && e.$inputEl.trigger("calendar:closed"), e.emit("local::closed calendarClosed", e);
	}
	open() {
		let e = this, { app: t, opened: n, inline: r, $inputEl: i, params: a } = e;
		if (n) return;
		if (r) {
			e.$el = W(e.render()), e.$el[0].f7Calendar = e, e.$wrapperEl = e.$el.find(".calendar-months-wrapper"), e.$months = e.$wrapperEl.find(".calendar-month"), e.$containerEl.append(e.$el), e.onOpen(), e.onOpened();
			return;
		}
		let o = a.openIn;
		o === "auto" && (o = e.isPopover() ? "popover" : "sheet");
		let s = e.render(), c = {
			targetEl: i,
			scrollToEl: a.scrollToInput ? i : void 0,
			content: s,
			backdrop: a.backdrop === !0 || (o === "popover" || o === "customModal") && t.params.popover.backdrop !== !1 && a.backdrop !== !1,
			closeByBackdropClick: a.closeByBackdropClick,
			on: {
				open() {
					let t = this;
					e.modal = t, e.$el = o === "popover" ? t.$el.find(".calendar") : t.$el, e.$wrapperEl = e.$el.find(".calendar-months-wrapper"), e.$months = e.$wrapperEl.find(".calendar-month"), e.$el[0].f7Calendar = e, o === "customModal" && W(e.$el).find(".calendar-close").once("click", () => {
						e.close();
					}), e.onOpen();
				},
				opened() {
					e.onOpened();
				},
				close() {
					e.onClose();
				},
				closed() {
					e.onClosed();
				}
			}
		};
		o === "sheet" && (c.push = a.sheetPush, c.swipeToClose = a.sheetSwipeToClose), a.routableModals && e.view ? e.view.router.navigate({
			url: e.url,
			route: {
				path: e.url,
				[o]: c
			}
		}) : (e.modal = t[o].create(c), e.modal.open());
	}
	close() {
		let e = this, { opened: t, inline: n } = e;
		if (t) {
			if (n) {
				e.onClose(), e.onClosed();
				return;
			}
			e.params.routableModals && e.view ? e.view.router.back() : e.modal.close();
		}
	}
	init() {
		let e = this;
		if (e.initInput(), e.inline) {
			e.open(), e.emit("local::init calendarInit", e);
			return;
		}
		!e.initialized && e.params.value && e.setValue(e.normalizeValues(e.params.value)), e.$inputEl && e.attachInputEvents(), e.params.closeByOutsideClick && e.attachHtmlEvents(), e.emit("local::init calendarInit", e);
	}
	destroy() {
		let e = this;
		if (e.destroyed) return;
		let { $el: t } = e;
		e.emit("local::beforeDestroy calendarBeforeDestroy", e), t && t.trigger("calendar:beforedestroy"), e.close(), e.$inputEl && e.detachInputEvents(), e.params.closeByOutsideClick && e.detachHtmlEvents(), e.timePickerInstance && (e.timePickerInstance.destroy && e.timePickerInstance.destroy(), delete e.timePickerInstance), t && t.length && delete e.$el[0].f7Calendar, Ba(e), e.destroyed = !0;
	}
}, zc = {
	name: "calendar",
	static: { Calendar: Rc },
	create() {
		let e = this;
		e.calendar = ho({
			defaultSelector: ".calendar",
			constructor: Rc,
			app: e,
			domProp: "f7Calendar"
		}), e.calendar.close = function(e) {
			e === void 0 && (e = ".calendar");
			let t = W(e);
			if (t.length === 0) return;
			let n = t[0].f7Calendar;
			!n || n && !n.opened || n.close();
		};
	},
	params: { calendar: {
		dateFormat: void 0,
		monthNames: "auto",
		monthNamesShort: "auto",
		dayNames: "auto",
		dayNamesShort: "auto",
		locale: void 0,
		firstDay: 1,
		weekendDays: [0, 6],
		multiple: !1,
		rangePicker: !1,
		rangePickerMinDays: 1,
		rangePickerMaxDays: 0,
		direction: "horizontal",
		minDate: null,
		maxDate: null,
		disabled: null,
		events: null,
		rangesClasses: null,
		touchMove: !0,
		animate: !0,
		closeOnSelect: !1,
		monthSelector: !0,
		monthPicker: !0,
		monthPickerToolbar: !0,
		monthPickerCloseText: "Done",
		yearSelector: !0,
		yearPicker: !0,
		yearPickerToolbar: !0,
		yearPickerMin: void 0,
		yearPickerMax: void 0,
		yearPickerCloseText: "Done",
		timePicker: !1,
		timePickerToolbar: !0,
		timePickerLabel: "Time",
		timePickerFormat: {
			hour: "numeric",
			minute: "numeric"
		},
		timePickerPlaceholder: "Select time",
		timePickerCloseText: "Done",
		weekHeader: !0,
		value: null,
		containerEl: null,
		openIn: "auto",
		sheetPush: !1,
		sheetSwipeToClose: void 0,
		formatValue: null,
		inputEl: null,
		inputReadOnly: !0,
		closeByOutsideClick: !0,
		scrollToInput: !0,
		header: !1,
		headerPlaceholder: "Select date",
		toolbar: !0,
		toolbarCloseText: "Done",
		footer: !1,
		cssClass: null,
		routableModals: !1,
		view: null,
		url: "date/",
		backdrop: null,
		closeByBackdropClick: !0,
		renderWeekHeader: null,
		renderMonths: null,
		renderMonth: null,
		renderMonthSelector: null,
		renderYearSelector: null,
		renderHeader: null,
		renderFooter: null,
		renderToolbar: null,
		renderInline: null,
		renderPopover: null,
		renderSheet: null,
		render: null
	} }
};
//#endregion
//#region node_modules/framework7/components/picker/picker-column.js
function Bc(e, t) {
	let n = this, r = W(e), i = r.index(), a = n.cols[i];
	if (a.divider) return;
	a.$el = r, a.el = r[0], a.$itemsEl = a.$el.find(".picker-items"), a.items = a.$itemsEl.find(".picker-item");
	let o, s;
	a.replaceValues = function(e, t) {
		a.detachEvents(), a.values = e, a.displayValues = t, a.$itemsEl.html(n.renderColumn(a, !0)), a.items = a.$itemsEl.find(".picker-item"), a.calcSize(), a.setValue(a.values[0], !0), a.attachEvents();
	}, a.calcSize = function() {
		s = a.$el[0].offsetHeight, o = a.items[0].offsetHeight;
		let e = a.el.style.getPropertyValue("--f7-picker-scroll-padding");
		a.el.style.setProperty("--f7-picker-scroll-padding", `${(s - o) / 2}px`), e || (a.$itemsEl[0].scrollTop = 0);
	}, a.setValue = function(e, t) {
		let n = a.$itemsEl.find(`.picker-item[data-picker-value="${e}"]`).index();
		if (n === void 0 || n === -1) return;
		let r = n * o;
		a.$itemsEl[0].scrollTop = r, a.updateItems(n, r, t);
	}, a.updateItems = function(e, t, r) {
		t === void 0 && (t = a.$itemsEl[0].scrollTop), e === void 0 && (e = Math.round(t / o)), e < 0 && (e = 0), e >= a.items.length && (e = a.items.length - 1);
		let i = a.activeIndex;
		a.activeIndex = e, a.$itemsEl.find(".picker-item-selected").removeClass("picker-item-selected");
		let c = a.items.eq(e);
		c.addClass("picker-item-selected").children().transform(""), n.params.rotateEffect && a.items.each((e) => {
			let n = W(e), r = (e.offsetTop - (s - o) / 2 - t) / o, i = Math.ceil(a.height / o / 2) + 1, c = -24 * r;
			c > 180 && (c = 180), c < -180 && (c = -180), Math.abs(r) > i ? n.addClass("picker-item-far") : n.removeClass("picker-item-far"), n.children("span").transform(`translate3d(0, ${-r * o}px, -100px) rotateX(${c}deg)`);
		}), (r || r === void 0) && (a.value = c.attr("data-picker-value"), a.displayValue = a.displayValues ? a.displayValues[e] : a.value, i !== e && (a.onChange && a.onChange(n, a.value, a.displayValue), n.updateValue()));
	};
	function c() {
		a.updateItems();
	}
	function l() {
		let e = W(this).attr("data-picker-value");
		a.setValue(e);
	}
	a.attachEvents = function() {
		a.$itemsEl.on("scroll", c), a.items.on("click", l);
	}, a.detachEvents = function() {
		a.items.off("click", l);
	}, a.init = function() {
		a.calcSize(), i === 0 && a.$el.addClass("picker-column-first"), i === n.cols.length - 1 && a.$el.addClass("picker-column-last"), n.params.freeMode && a.$el.addClass("picker-column-free-mode"), t && a.updateItems(0), a.attachEvents();
	}, a.destroy = function() {
		a.detachEvents();
	}, a.init();
}
//#endregion
//#region node_modules/framework7/components/picker/picker-class.js
var Vc = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = X(), i = H();
		n.params = J({}, e.params.picker, t);
		let a;
		if (n.params.containerEl && (a = W(n.params.containerEl), a.length === 0)) return n;
		let o;
		n.params.inputEl && (o = W(n.params.inputEl));
		let s = n.params.scrollToInput ? o : void 0;
		if (n.params.scrollToEl) {
			let e = W(n.params.scrollToEl);
			e.length > 0 && (s = e);
		}
		J(n, {
			app: e,
			$containerEl: a,
			containerEl: a && a[0],
			inline: a && a.length > 0,
			needsOriginFix: r.ios || i.navigator.userAgent.toLowerCase().indexOf("safari") >= 0 && i.navigator.userAgent.toLowerCase().indexOf("chrome") < 0 && !r.android,
			cols: [],
			$inputEl: o,
			inputEl: o && o[0],
			$scrollToEl: s,
			initialized: !1,
			opened: !1,
			url: n.params.url
		});
		function c() {
			n.resizeCols();
		}
		function l() {
			n.open();
		}
		function u(e) {
			e.preventDefault();
		}
		let d = null;
		function f(e) {
			d = e.target;
		}
		function p(e) {
			if (n.destroyed || !n.params) return;
			let t = W(e.target);
			n.isPopover() || !n.opened || n.closing || t.closest("[class*=\"backdrop\"]").length || (o && o.length > 0 ? d === e.target && t[0] !== o[0] && t.closest(".sheet-modal").length === 0 && n.close() : W(e.target).closest(".sheet-modal").length === 0 && n.close());
		}
		return J(n, {
			attachResizeEvent() {
				e.on("resize", c);
			},
			detachResizeEvent() {
				e.off("resize", c);
			},
			attachInputEvents() {
				n.$inputEl.on("click", l), n.params.inputReadOnly && (n.$inputEl.on("focus mousedown", u), n.$inputEl[0] && (n.$inputEl[0].f7ValidateReadonly = !0));
			},
			detachInputEvents() {
				n.$inputEl.off("click", l), n.params.inputReadOnly && (n.$inputEl.off("focus mousedown", u), n.$inputEl[0] && delete n.$inputEl[0].f7ValidateReadonly);
			},
			attachHtmlEvents() {
				e.on("click", p), e.on("touchstart", f);
			},
			detachHtmlEvents() {
				e.off("click", p), e.off("touchstart", f);
			}
		}), n.init(), n;
	}
	get view() {
		let { app: e, params: t, $inputEl: n } = this, r;
		return t.view ? r = t.view : n && (r = n.parents(".view").length && n.parents(".view")[0].f7View), r ||= e.views.main, r;
	}
	initInput() {
		let e = this;
		e.$inputEl && e.params.inputReadOnly && e.$inputEl.prop("readOnly", !0);
	}
	resizeCols() {
		let e = this;
		if (e.opened) for (let t = 0; t < e.cols.length; t += 1) e.cols[t].divider || (e.cols[t].calcSize(), e.cols[t].setValue(e.cols[t].value, !1));
	}
	isPopover() {
		let e = this, { app: t, modal: n, params: r } = e, i = X();
		if (r.openIn === "sheet" || n && n.type !== "popover") return !1;
		if (!e.inline && e.inputEl) {
			if (r.openIn === "popover") return !0;
			if (i.ios) return !!i.ipad;
			if (t.width >= 768) return !0;
		}
		return !1;
	}
	formatValue() {
		let e = this, { value: t, displayValue: n } = e;
		return e.params.formatValue ? e.params.formatValue.call(e, t, n) : t.join(" ");
	}
	setValue(e) {
		let t = this, n = 0;
		if (t.cols.length === 0) {
			t.value = e, t.updateValue(e);
			return;
		}
		for (let r = 0; r < t.cols.length; r += 1) t.cols[r] && !t.cols[r].divider && (t.cols[r].setValue(e[n]), n += 1);
	}
	getValue() {
		return this.value;
	}
	updateValue(e) {
		let t = this, n = e || [], r = [], i;
		if (t.cols.length === 0) {
			let e = t.params.cols.filter((e) => !e.divider);
			for (let t = 0; t < e.length; t += 1) i = e[t], i.displayValues !== void 0 && i.values !== void 0 && i.values.indexOf(n[t]) !== -1 ? r.push(i.displayValues[i.values.indexOf(n[t])]) : r.push(n[t]);
		} else for (let e = 0; e < t.cols.length; e += 1) t.cols[e].divider || (n.push(t.cols[e].value), r.push(t.cols[e].displayValue));
		n.indexOf(void 0) >= 0 || (t.value = n, t.displayValue = r, t.emit("local::change pickerChange", t, t.value, t.displayValue), t.inputEl && (t.$inputEl.val(t.formatValue()), t.$inputEl.trigger("change")));
	}
	initColumn(e, t) {
		let n = this;
		Bc.call(n, e, t);
	}
	destroyColumn(e) {
		let t = this, n = W(e).index();
		t.cols[n] && t.cols[n].destroy && t.cols[n].destroy();
	}
	renderToolbar() {
		let e = this;
		return e.params.renderToolbar ? e.params.renderToolbar.call(e, e) : Q("div", { class: "toolbar toolbar-top" }, Q("div", { class: "toolbar-inner" }, Q("div", { class: "left" }), Q("div", { class: "right" }, Q("a", { class: "link sheet-close popover-close" }, e.params.toolbarCloseText))));
	}
	renderColumn(e, t) {
		let n = `picker-column ${e.textAlign ? `picker-column-${e.textAlign}` : ""} ${e.cssClass || ""}`, r, i;
		return e.divider ? r = `
        <div class="${n} picker-column-divider">${e.content}</div>
      ` : (i = e.values.map((t, n) => `
        <div class="picker-item" data-picker-value="${t}">
          <span>${e.displayValues ? e.displayValues[n] : t}</span>
        </div>
      `).join(""), r = `
        <div class="${n}">
          <div class="picker-items">${i}</div>
        </div>
      `), t ? i.trim() : r.trim();
	}
	renderInline() {
		let e = this, { rotateEffect: t, cssClass: n, toolbar: r } = e.params;
		return Q("div", { class: `picker picker-inline ${t ? "picker-3d" : ""} ${n || ""}` }, r && e.renderToolbar(), Q("div", { class: "picker-columns" }, e.cols.map((t) => e.renderColumn(t)), Q("div", { class: "picker-center-highlight" })));
	}
	renderSheet() {
		let e = this, { rotateEffect: t, cssClass: n, toolbar: r } = e.params;
		return Q("div", { class: `sheet-modal picker picker-sheet ${t ? "picker-3d" : ""} ${n || ""}` }, r && e.renderToolbar(), Q("div", { class: "sheet-modal-inner picker-columns" }, e.cols.map((t) => e.renderColumn(t)), Q("div", { class: "picker-center-highlight" })));
	}
	renderPopover() {
		let e = this, { rotateEffect: t, cssClass: n, toolbar: r } = e.params;
		return Q("div", { class: "popover picker-popover" }, Q("div", { class: "popover-inner" }, Q("div", { class: `picker ${t ? "picker-3d" : ""} ${n || ""}` }, r && e.renderToolbar(), Q("div", { class: "picker-columns" }, e.cols.map((t) => e.renderColumn(t)), Q("div", { class: "picker-center-highlight" })))));
	}
	render() {
		let e = this;
		return e.params.render ? e.params.render.call(e) : e.inline ? e.renderInline() : e.isPopover() ? e.renderPopover() : e.renderSheet();
	}
	onOpen() {
		let e = this, { initialized: t, $el: n, app: r, $inputEl: i, inline: a, value: o, params: s } = e;
		e.opened = !0, e.closing = !1, e.opening = !0, e.attachResizeEvent(), n.find(".picker-column").each((n) => {
			let r = !0;
			(!t && s.value || t && o) && (r = !1), e.initColumn(n, r);
		}), t ? o && e.setValue(o) : o ? e.setValue(o) : s.value && e.setValue(s.value), !a && i && i.length && r.theme === "md" && i.trigger("focus"), e.initialized = !0, n && n.trigger("picker:open"), i && i.trigger("picker:open"), e.emit("local::open pickerOpen", e);
	}
	onOpened() {
		let e = this;
		e.opening = !1, e.$el && e.$el.trigger("picker:opened"), e.$inputEl && e.$inputEl.trigger("picker:opened"), e.emit("local::opened pickerOpened", e);
	}
	onClose() {
		let e = this, t = e.app;
		if (e.opening = !1, e.closing = !0, e.detachResizeEvent(), e.cols.forEach((e) => {
			e.destroy && e.destroy();
		}), e.$inputEl) if (t.theme === "md") e.$inputEl.trigger("blur");
		else {
			let n = e.$inputEl.attr("validate"), r = e.$inputEl.attr("required");
			n && r && t.input.validate(e.$inputEl);
		}
		e.$el && e.$el.trigger("picker:close"), e.$inputEl && e.$inputEl.trigger("picker:close"), e.emit("local::close pickerClose", e);
	}
	onClosed() {
		let e = this;
		e.opened = !1, e.closing = !1, e.inline || Ua(() => {
			e.modal && e.modal.el && e.modal.destroy && (e.params.routableModals || e.modal.destroy()), delete e.modal;
		}), e.$el && e.$el.trigger("picker:closed"), e.$inputEl && e.$inputEl.trigger("picker:closed"), e.emit("local::closed pickerClosed", e);
	}
	open() {
		let e = this, { app: t, opened: n, inline: r, $inputEl: i, $scrollToEl: a, params: o } = e;
		if (n) return;
		if (e.cols.length === 0 && o.cols.length && o.cols.forEach((t) => {
			e.cols.push(t);
		}), r) {
			e.$el = W(e.render()), e.$el[0].f7Picker = e, e.$containerEl.append(e.$el), e.onOpen(), e.onOpened();
			return;
		}
		let s = e.isPopover(), c = s ? "popover" : "sheet", l = {
			targetEl: i,
			scrollToEl: a,
			content: e.render(),
			backdrop: o.backdrop === void 0 ? s : o.backdrop,
			on: {
				open() {
					let t = this;
					e.modal = t, e.$el = s ? t.$el.find(".picker") : t.$el, e.$el[0].f7Picker = e, e.onOpen();
				},
				opened() {
					e.onOpened();
				},
				close() {
					e.onClose();
				},
				closed() {
					e.onClosed();
				}
			}
		};
		c === "sheet" && (l.push = o.sheetPush, l.swipeToClose = o.sheetSwipeToClose), o.routableModals && e.view ? e.view.router.navigate({
			url: e.url,
			route: {
				path: e.url,
				[c]: l
			}
		}) : (e.modal = t[c].create(l), e.modal.open());
	}
	close() {
		let e = this, { opened: t, inline: n } = e;
		if (t) {
			if (n) {
				e.onClose(), e.onClosed();
				return;
			}
			e.params.routableModals && e.view ? e.view.router.back() : e.modal.close();
		}
	}
	init() {
		let e = this;
		if (e.initInput(), e.inline) {
			e.open(), e.emit("local::init pickerInit", e);
			return;
		}
		!e.initialized && e.params.value && e.setValue(e.params.value), e.$inputEl && e.attachInputEvents(), e.params.closeByOutsideClick && e.attachHtmlEvents(), e.emit("local::init pickerInit", e);
	}
	destroy() {
		let e = this;
		if (e.destroyed) return;
		let { $el: t } = e;
		e.emit("local::beforeDestroy pickerBeforeDestroy", e), t && t.trigger("picker:beforedestroy"), e.close(), e.$inputEl && e.detachInputEvents(), e.params.closeByOutsideClick && e.detachHtmlEvents(), t && t.length && delete e.$el[0].f7Picker, Ba(e), e.destroyed = !0;
	}
}, Hc = {
	name: "picker",
	static: { Picker: Vc },
	create() {
		let e = this;
		e.picker = ho({
			defaultSelector: ".picker",
			constructor: Vc,
			app: e,
			domProp: "f7Picker"
		}), e.picker.close = function(e) {
			e === void 0 && (e = ".picker");
			let t = W(e);
			if (t.length === 0) return;
			let n = t[0].f7Picker;
			!n || n && !n.opened || n.close();
		};
	},
	params: { picker: {
		rotateEffect: !1,
		freeMode: !1,
		cols: [],
		containerEl: null,
		openIn: "auto",
		sheetPush: !1,
		sheetSwipeToClose: void 0,
		backdrop: void 0,
		formatValue: null,
		inputEl: null,
		inputReadOnly: !0,
		closeByOutsideClick: !0,
		scrollToInput: !0,
		scrollToEl: void 0,
		toolbar: !0,
		toolbarCloseText: "Done",
		cssClass: null,
		routableModals: !1,
		view: null,
		url: "select/",
		renderToolbar: null,
		render: null
	} }
}, Uc = {
	handle(e, t) {
		let n = this, r = W(e), i = r[0].scrollTop, a = r[0].scrollHeight, o = r[0].offsetHeight, s = r[0].getAttribute("data-infinite-distance"), c = r.find(".virtual-list"), l, u = r.hasClass("infinite-scroll-top");
		if (s ||= 50, typeof s == "string" && s.indexOf("%") >= 0 && (s = parseInt(s, 10) / 100 * o), s > o && (s = o), u) i < s && (r.trigger("infinite", t), n.emit("infinite", r[0], t));
		else if (i + o >= a - s) {
			if (c.length > 0 && (l = c.eq(-1)[0].f7VirtualList, l && !l.reachEnd && !l.params.updatableScroll)) return;
			r.trigger("infinite", t), n.emit("infinite", r[0], t);
		}
	},
	create(e) {
		let t = W(e), n = this;
		function r(e) {
			n.infiniteScroll.handle(this, e);
		}
		t.each((e) => {
			e.f7InfiniteScrollHandler = r, e.addEventListener("scroll", e.f7InfiniteScrollHandler);
		});
	},
	destroy(e) {
		W(e).each((e) => {
			e.removeEventListener("scroll", e.f7InfiniteScrollHandler), delete e.f7InfiniteScrollHandler;
		});
	}
}, Wc = {
	name: "infiniteScroll",
	create() {
		ao(this, { infiniteScroll: Uc });
	},
	on: {
		tabMounted(e) {
			let t = this, n = W(e), r = n.find(".infinite-scroll-content");
			n.is(".infinite-scroll-content") && r.add(n), r.each((e) => {
				t.infiniteScroll.create(e);
			});
		},
		tabBeforeRemove(e) {
			let t = W(e), n = this, r = t.find(".infinite-scroll-content");
			t.is(".infinite-scroll-content") && r.add(t), r.each((e) => {
				n.infiniteScroll.destroy(e);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".infinite-scroll-content").each((e) => {
				t.infiniteScroll.create(e);
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".infinite-scroll-content").each((e) => {
				t.infiniteScroll.destroy(e);
			});
		}
	}
}, Gc = class extends Z {
	constructor(e, t) {
		super({}, [e]);
		let n = this, r = X(), i = Y(), a = W(t), o = a.find(".ptr-preloader");
		n.$el = a, n.el = a[0], n.app = e, n.bottom = n.$el.hasClass("ptr-bottom"), n.useModulesParams({});
		let s = e.theme === "md", c = e.theme === "ios";
		n.done = function() {
			let e = s ? o : a, t = (r) => {
				W(r.target).closest(o).length || (a.removeClass("ptr-transitioning ptr-pull-up ptr-pull-down ptr-closing"), a.trigger("ptr:done"), n.emit("local::done ptrDone", a[0]), e.off("transitionend", t));
			};
			return e.on("transitionend", t), a.removeClass("ptr-refreshing").addClass("ptr-transitioning ptr-closing"), n;
		}, n.refresh = function() {
			return a.hasClass("ptr-refreshing") ? n : (a.addClass("ptr-transitioning ptr-refreshing"), a.trigger("ptr:refresh", n.done), n.emit("local::refresh ptrRefresh", a[0], n.done), n);
		}, n.mousewheel = a.attr("data-ptr-mousewheel") === "true";
		let l, u, d, f = {}, p, m, h = !1, g = !1, _ = !1, v = 0, y, b, x, S, C, w, T = !1, E, D, O, k = a.parents(".page");
		if ((k.find(".navbar").length > 0 || k.parents(".view").children(".navbars").length > 0) && (T = !0), k.hasClass("no-navbar") && (T = !1), !n.bottom) {
			let t = e.navbar.getElByPage(k[0]);
			if (t) {
				let e = W(t), n = e.hasClass("navbar-large-transparent") || e.hasClass("navbar-large") && e.hasClass("navbar-transparent"), r = e.hasClass("navbar-transparent") && !e.hasClass("navbar-large");
				n ? a.addClass("ptr-with-navbar-large-transparent") : r && a.addClass("ptr-with-navbar-transparent");
			}
		}
		!T && !n.bottom && a.addClass("ptr-no-navbar"), a.attr("data-ptr-distance") ? C = !0 : s ? S = 66 : c && (S = 44);
		function A(e) {
			e === void 0 && (e = 0);
			let t = o.find(".preloader-inner-line"), n = 1 / t.length;
			t.forEach((t, r) => {
				let i = (e - r * n) / n;
				t.style.opacity = Math.max(Math.min(i, 1), 0) * .27;
			});
		}
		function j() {
			o.find(".preloader-inner-line").css("opacity", "");
		}
		function M(e) {
			if (e.isTrusted) {
				if (u) if (r.os === "android") {
					if ("targetTouches" in e && e.targetTouches.length > 1) return;
				} else return;
				a.hasClass("ptr-refreshing") || W(e.target).closest(".sortable-handler, .ptr-ignore, .card-expandable.card-opened").length || (d = !1, w = !1, u = !0, p = void 0, x = void 0, e.type === "touchstart" && (l = e.targetTouches[0].identifier), f.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, f.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY);
			}
		}
		function N(e) {
			if (!u || !e.isTrusted) return;
			let i, T, k;
			if (e.type === "touchmove") {
				if (l && e.touches) for (let t = 0; t < e.touches.length; t += 1) e.touches[t].identifier === l && (k = e.touches[t]);
				k ||= e.targetTouches[0], i = k.pageX, T = k.pageY;
			} else i = e.pageX, T = e.pageY;
			if (!(!i || !T)) {
				if (p === void 0 && (p = !!(p || Math.abs(T - f.y) > Math.abs(i - f.x))), !p) {
					u = !1;
					return;
				}
				if (b = a[0].scrollTop, !d) {
					a.removeClass("ptr-transitioning"), c && A(0);
					let i;
					if (E = a[0].scrollHeight, D = a[0].offsetHeight, n.bottom && (O = E - D), b > E) {
						u = !1;
						return;
					}
					let o = W(e.target).closest(".ptr-watch-scroll");
					if (o.length && o.each((e) => {
						e !== t && e.scrollHeight > e.offsetHeight && W(e).css("overflow") === "auto" && (!n.bottom && e.scrollTop > 0 || n.bottom && e.scrollTop < e.scrollHeight - e.offsetHeight) && (i = !0);
					}), i) {
						u = !1;
						return;
					}
					C && (S = a.attr("data-ptr-distance"), S.indexOf("%") >= 0 && (S = E * parseInt(S, 10) / 100)), v = a.hasClass("ptr-refreshing") ? S : 0, g = !!(E === D || r.os !== "ios" || s), _ = !1;
				}
				if (d = !0, m = T - f.y, x === void 0 && (n.bottom ? b !== O : b !== 0) && (x = !0), n.bottom ? m < 0 && b >= O || b > O : m > 0 && b <= 0 || b < 0) {
					r.os === "ios" && parseInt(r.osVersion.split(".")[0], 10) > 7 && (!n.bottom && b === 0 && !x && (g = !0), n.bottom && b === O && !x && (g = !0)), !g && n.bottom && !s && (a.css("-webkit-overflow-scrolling", "auto"), a.scrollTop(O), _ = !0), g || _ ? (e.cancelable && e.preventDefault(), y = (n.bottom ? -1 * Math.abs(m) ** .85 : m ** .85) + v, s ? o.transform(`translate3d(0,${y}px,0)`).find(".ptr-arrow").transform(`rotate(${Math.abs(m) / 66 * 180 + 100}deg)`) : (n.bottom || c ? a.children().transform(`translate3d(0,${y}px,0)`) : a.transform(`translate3d(0,${y}px,0)`), c && o.transform("translate3d(0,0px,0)"))) : c && !n.bottom && o.transform(`translate3d(0,${b}px,0)`);
					let t;
					c && !h && (t = g || _ ? Math.abs(m) ** .85 / S : Math.abs(m) / (S * 2), A(t)), (g || _) && Math.abs(m) ** .85 > S || !g && Math.abs(m) >= S * 2 ? (h = !0, a.addClass("ptr-pull-up").removeClass("ptr-pull-down"), j()) : (h = !1, a.removeClass("ptr-pull-up").addClass("ptr-pull-down")), w ||= (a.trigger("ptr:pullstart"), n.emit("local::pullStart ptrPullStart", a[0]), !0), a.trigger("ptr:pullmove", {
						event: e,
						scrollTop: b,
						translate: y,
						touchesDiff: m
					}), n.emit("local::pullMove ptrPullMove", a[0], {
						event: e,
						scrollTop: b,
						translate: y,
						touchesDiff: m
					});
				} else w = !1, a.removeClass("ptr-pull-up ptr-pull-down"), h = !1;
			}
		}
		function P(e) {
			if (e.isTrusted) {
				if (e.type === "touchend" && e.changedTouches && e.changedTouches.length > 0 && l && e.changedTouches[0].identifier !== l) {
					u = !1, p = !1, d = !1, l = null;
					return;
				}
				if (!u || !d) {
					u = !1, d = !1;
					return;
				}
				y &&= (a.addClass("ptr-transitioning"), 0), s ? o.transform("").find(".ptr-arrow").transform("") : (o.transform(""), n.bottom || c ? a.children().transform("") : a.transform("")), !g && n.bottom && !s && a.css("-webkit-overflow-scrolling", ""), h ? (a.addClass("ptr-refreshing"), a.trigger("ptr:refresh", n.done), n.emit("local::refresh ptrRefresh", a[0], n.done)) : a.removeClass("ptr-pull-down"), u = !1, d = !1, w && (a.trigger("ptr:pullend"), n.emit("local::pullEnd ptrPullEnd", a[0]));
			}
		}
		let F, ee, te = !0, I = 0;
		function L() {
			te = !0, ee = !1, I = 0, y &&= (a.addClass("ptr-transitioning"), 0), s ? o.transform("").find(".ptr-arrow").transform("") : (o.transform(""), n.bottom ? a.children().transform("") : a.transform("")), h ? (a.addClass("ptr-refreshing"), a.trigger("ptr:refresh", n.done), n.emit("local::refresh ptrRefresh", a[0], n.done)) : a.removeClass("ptr-pull-down"), w && (a.trigger("ptr:pullend"), n.emit("local::pullEnd ptrPullEnd", a[0]));
		}
		function ne(e) {
			if (!te) return;
			let { deltaX: r, deltaY: i } = e;
			if (!(Math.abs(r) > Math.abs(i)) && !a.hasClass("ptr-refreshing") && !W(e.target).closest(".sortable-handler, .ptr-ignore, .card-expandable.card-opened").length) {
				if (clearTimeout(F), b = a[0].scrollTop, !ee) {
					a.removeClass("ptr-transitioning"), c && A(0);
					let r;
					if (E = a[0].scrollHeight, D = a[0].offsetHeight, n.bottom && (O = E - D), b > E) {
						te = !1;
						return;
					}
					let i = W(e.target).closest(".ptr-watch-scroll");
					if (i.length && i.each((e) => {
						e !== t && e.scrollHeight > e.offsetHeight && W(e).css("overflow") === "auto" && (!n.bottom && e.scrollTop > 0 || n.bottom && e.scrollTop < e.scrollHeight - e.offsetHeight) && (r = !0);
					}), r) {
						te = !1;
						return;
					}
					C && (S = a.attr("data-ptr-distance"), S.indexOf("%") >= 0 && (S = E * parseInt(S, 10) / 100));
				}
				if (d = !0, I -= i, m = I, x === void 0 && (n.bottom ? b !== O : b !== 0) && (x = !0), n.bottom ? m < 0 && b >= O || b > O : m > 0 && b <= 0 || b < 0) {
					e.cancelable && e.preventDefault(), y = m, Math.abs(y) > S && (y = S + (Math.abs(y) - S) ** .7, n.bottom && (y = -y)), s ? o.transform(`translate3d(0,${y}px,0)`).find(".ptr-arrow").transform(`rotate(${Math.abs(m) / 66 * 180 + 100}deg)`) : n.bottom ? a.children().transform(`translate3d(0,${y}px,0)`) : (a.transform(`translate3d(0,${y}px,0)`), c && o.transform(`translate3d(0,${-y}px,0)`));
					let t;
					c && !h && (t = Math.abs(y) / S, A(t)), Math.abs(y) > S ? (h = !0, a.addClass("ptr-pull-up").removeClass("ptr-pull-down"), j()) : (h = !1, a.removeClass("ptr-pull-up").addClass("ptr-pull-down")), w ||= (a.trigger("ptr:pullstart"), n.emit("local::pullStart ptrPullStart", a[0]), !0), a.trigger("ptr:pullmove", {
						event: e,
						scrollTop: b,
						translate: y,
						touchesDiff: m
					}), n.emit("local::pullMove ptrPullMove", a[0], {
						event: e,
						scrollTop: b,
						translate: y,
						touchesDiff: m
					});
				} else w = !1, a.removeClass("ptr-pull-up ptr-pull-down"), h = !1;
				F = setTimeout(L, 300);
			}
		}
		return !k.length || !a.length ? n : (a[0].f7PullToRefresh = n, n.attachEvents = function() {
			let t = i.passiveListener ? { passive: !0 } : !1;
			a.on(e.touchEvents.start, M, t), e.on("touchmove:active", N), e.on("touchend:passive", P), n.mousewheel && !n.bottom && a.on("wheel", ne);
		}, n.detachEvents = function() {
			let t = i.passiveListener ? { passive: !0 } : !1;
			a.off(e.touchEvents.start, M, t), e.off("touchmove:active", N), e.off("touchend:passive", P), n.mousewheel && !n.bottom && a.off("wheel", ne);
		}, n.useModules(), n.init(), n);
	}
	init() {
		this.attachEvents();
	}
	destroy() {
		let e = this;
		e.emit("local::beforeDestroy ptrBeforeDestroy", e), e.$el.trigger("ptr:beforedestroy"), delete e.el.f7PullToRefresh, e.detachEvents(), Ba(e), e = null;
	}
}, Kc = {
	name: "pullToRefresh",
	create() {
		let e = this;
		e.ptr = J(ho({
			defaultSelector: ".ptr-content",
			constructor: Gc,
			app: e,
			domProp: "f7PullToRefresh"
		}), {
			done(t) {
				let n = e.ptr.get(t);
				if (n) return n.done();
			},
			refresh(t) {
				let n = e.ptr.get(t);
				if (n) return n.refresh();
			}
		});
	},
	static: { PullToRefresh: Gc },
	on: {
		tabMounted(e) {
			let t = this, n = W(e), r = n.find(".ptr-content");
			n.is(".ptr-content") && r.add(n), r.each((e) => {
				t.ptr.create(e);
			});
		},
		tabBeforeRemove(e) {
			let t = W(e), n = this, r = t.find(".ptr-content");
			t.is(".ptr-content") && r.add(t), r.each((e) => {
				n.ptr.destroy(e);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".ptr-content").each((e) => {
				t.ptr.create(e);
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".ptr-content").each((e) => {
				t.ptr.destroy(e);
			});
		}
	}
}, qc = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = {};
		n.useModulesParams(r), n.params = J(r, t);
		let i = W(n.params.el);
		if (i.length === 0) return;
		if (n.$el = i, n.el = i[0], n.$el[0].f7DataTable) {
			let e = n.$el[0].f7DataTable;
			return n.destroy(), e;
		}
		n.$el[0].f7DataTable = n, J(n, {
			collapsible: i.hasClass("data-table-collapsible"),
			$headerEl: i.find(".data-table-header"),
			$headerSelectedEl: i.find(".data-table-header-selected")
		});
		function a(e) {
			if (e.detail && e.detail.sentByF7DataTable) return;
			let t = W(this), r = t[0].checked, a = t.parents("td,th").index();
			if (t.parents("thead").length > 0) a === 0 && i.find("tbody tr")[r ? "addClass" : "removeClass"]("data-table-row-selected"), i.find(`tbody tr td:nth-child(${a + 1}) input`).prop("checked", r).trigger("change", { sentByF7DataTable: !0 }), t.prop("indeterminate", !1);
			else {
				a === 0 && t.parents("tr")[r ? "addClass" : "removeClass"]("data-table-row-selected");
				let e = i.find(`tbody .checkbox-cell:nth-child(${a + 1}) input[type="checkbox"]:checked`).length, n = i.find("tbody tr").length, o = i.find(`thead .checkbox-cell:nth-child(${a + 1}) input[type="checkbox"]`);
				r ? e === n && o.prop("checked", !0).trigger("change", { sentByF7DataTable: !0 }) : o.prop("checked", !1), o.prop("indeterminate", e > 0 && e < n);
			}
			n.checkSelectedHeader();
		}
		function o() {
			let e = W(this), t = e.hasClass("sortable-cell-active"), r = e.hasClass("sortable-desc") ? "desc" : "asc", a;
			t ? (a = r === "desc" ? "asc" : "desc", e.removeClass("sortable-desc sortable-asc").addClass(`sortable-${a}`)) : (i.find("thead .sortable-cell-active").removeClass("sortable-cell-active"), e.addClass("sortable-cell-active"), a = r), e.trigger("datatable:sort", a), n.emit("local::sort dataTableSort", n, a);
		}
		return n.attachEvents = function() {
			n.$el.on("change", ".checkbox-cell input[type=\"checkbox\"]", a), n.$el.find("thead .sortable-cell").on("click", o);
		}, n.detachEvents = function() {
			n.$el.off("change", ".checkbox-cell input[type=\"checkbox\"]", a), n.$el.find("thead .sortable-cell").off("click", o);
		}, n.useModules(), n.init(), n;
	}
	setCollapsibleLabels() {
		let e = this;
		e.collapsible && e.$el.find("tbody td:not(.checkbox-cell)").each((t) => {
			let n = W(t), r = n.index(), i = n.attr("data-collapsible-title");
			!i && i !== "" && n.attr("data-collapsible-title", e.$el.find("thead th").eq(r).text());
		});
	}
	checkSelectedHeader() {
		let e = this;
		if (e.$headerEl.length > 0 && e.$headerSelectedEl.length > 0) {
			let t = e.$el.find("tbody .checkbox-cell input:checked").length;
			e.$el[t > 0 ? "addClass" : "removeClass"]("data-table-has-checked"), e.$headerSelectedEl.find(".data-table-selected-count").text(t);
		}
	}
	init() {
		let e = this;
		e.attachEvents(), e.setCollapsibleLabels(), e.checkSelectedHeader();
	}
	destroy() {
		let e = this;
		e.$el.trigger("datatable:beforedestroy"), e.emit("local::beforeDestroy dataTableBeforeDestroy", e), e.detachEvents(), e.$el[0] && (e.$el[0].f7DataTable = null, delete e.$el[0].f7DataTable), Ba(e), e = null;
	}
}, Jc = {
	name: "dataTable",
	static: { DataTable: qc },
	create() {
		let e = this;
		e.dataTable = ho({
			defaultSelector: ".data-table",
			constructor: qc,
			app: e,
			domProp: "f7DataTable"
		});
	},
	on: {
		tabBeforeRemove(e) {
			let t = this;
			W(e).find(".data-table-init").each((e) => {
				t.dataTable.destroy(e);
			});
		},
		tabMounted(e) {
			let t = this;
			W(e).find(".data-table-init").each((e) => {
				t.dataTable.create({ el: e });
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".data-table-init").each((e) => {
				t.dataTable.destroy(e);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".data-table-init").each((e) => {
				t.dataTable.create({ el: e });
			});
		}
	},
	vnode: { "data-table-init": {
		insert(e) {
			let t = this, n = e.elm;
			t.dataTable.create({ el: n });
		},
		destroy(e) {
			let t = this, n = e.elm;
			t.dataTable.destroy(n);
		}
	} }
}, Yc = {
	morphOpen(e, t) {
		let n = this, r = W(e), i = W(t);
		if (i.length === 0) return;
		i.transition(0).addClass("fab-morph-target-visible");
		let a = {
			width: i[0].offsetWidth,
			height: i[0].offsetHeight,
			offset: i.offset(),
			borderRadius: i.css("border-radius"),
			zIndex: i.css("z-index")
		}, o = {
			width: r[0].offsetWidth,
			height: r[0].offsetHeight,
			offset: r.offset(),
			translateX: qa(r[0], "x"),
			translateY: qa(r[0], "y")
		};
		r[0].f7FabMorphData = {
			$targetEl: i,
			target: a,
			fab: o
		};
		let s = o.offset.left + o.width / 2 - (a.offset.left + a.width / 2) - o.translateX, c = o.offset.top + o.height / 2 - (a.offset.top + a.height / 2) - o.translateY, l = a.width / o.width, u = a.height / o.height, d = Math.ceil(parseInt(a.borderRadius, 10) / Math.max(l, u));
		d > 0 && (d += 2), r[0].f7FabMorphResizeHandler = function() {
			r.transition(0).transform(""), i.transition(0), a.width = i[0].offsetWidth, a.height = i[0].offsetHeight, a.offset = i.offset(), o.offset = r.offset();
			let e = o.offset.left + o.width / 2 - (a.offset.left + a.width / 2) - o.translateX, t = o.offset.top + o.height / 2 - (a.offset.top + a.height / 2) - o.translateY, n = a.width / o.width, s = a.height / o.height;
			r.transform(`translate3d(${-e}px, ${-t}px, 0) scale(${n}, ${s})`);
		}, i.css("opacity", 0).transform(`scale(${1 / l}, ${1 / u})`), r.addClass("fab-opened").css("z-index", a.zIndex - 1).transform(`translate3d(${-s}px, ${-c}px, 0)`), r.transitionEnd(() => {
			i.transition(""), Wa(() => {
				i.css("opacity", 1).transform("scale(1,1)"), r.transform(`translate3d(${-s}px, ${-c}px, 0) scale(${l}, ${u})`).css("border-radius", `${d}px`).css("box-shadow", "none").css("opacity", "0");
			}), n.on("resize", r[0].f7FabMorphResizeHandler), i.parents(".page-content").length > 0 && i.parents(".page-content").on("scroll", r[0].f7FabMorphResizeHandler);
		});
	},
	morphClose(e) {
		let t = this, n = W(e), r = n[0].f7FabMorphData;
		if (!r) return;
		let { $targetEl: i, target: a, fab: o } = r;
		if (i.length === 0) return;
		let s = o.offset.left + o.width / 2 - (a.offset.left + a.width / 2) - o.translateX, c = o.offset.top + o.height / 2 - (a.offset.top + a.height / 2) - o.translateY, l = a.width / o.width, u = a.height / o.height;
		t.off("resize", n[0].f7FabMorphResizeHandler), i.parents(".page-content").length > 0 && i.parents(".page-content").off("scroll", n[0].f7FabMorphResizeHandler), i.css("opacity", 0).transform(`scale(${1 / l}, ${1 / u})`), n.transition("").css("box-shadow", "").css("border-radius", "").css("opacity", "1").transform(`translate3d(${-s}px, ${-c}px, 0)`), n.transitionEnd(() => {
			n.css("z-index", "").removeClass("fab-opened").transform(""), Wa(() => {
				n.transitionEnd(() => {
					i.removeClass("fab-morph-target-visible").css("opacity", "").transform("").transition("");
				});
			});
		});
	},
	open(e, t) {
		let n = this, r = W(e).eq(0), i = r.find(".fab-buttons");
		if (r.length && !r.hasClass("fab-opened") && !(!i.length && !r.hasClass("fab-morph"))) {
			if (n.fab.openedEl) {
				if (n.fab.openedEl === r[0]) return;
				n.fab.close(n.fab.openedEl);
			}
			n.fab.openedEl = r[0], r.hasClass("fab-morph") ? n.fab.morphOpen(r, t || r.attr("data-morph-to")) : r.addClass("fab-opened"), r.siblings(".fab-backdrop").addClass("backdrop-in"), r.trigger("fab:open");
		}
	},
	close(e) {
		e === void 0 && (e = ".fab-opened");
		let t = this, n = W(e).eq(0), r = n.find(".fab-buttons");
		n.length && n.hasClass("fab-opened") && (!r.length && !n.hasClass("fab-morph") || (t.fab.openedEl = null, n.hasClass("fab-morph") ? t.fab.morphClose(n) : n.removeClass("fab-opened"), n.siblings(".fab-backdrop").removeClass("backdrop-in"), n.trigger("fab:close")));
	},
	toggle(e) {
		let t = this;
		W(e).hasClass("fab-opened") ? t.fab.close(e) : t.fab.open(e);
	}
}, Xc = {
	name: "fab",
	create() {
		ao(this, { fab: {
			openedEl: null,
			...Yc
		} });
	},
	clicks: {
		".fab > a": function(e) {
			this.fab.toggle(e.parents(".fab"));
		},
		".fab-open": function(e, t) {
			t === void 0 && (t = {}), this.fab.open(t.fab);
		},
		".fab-close": function(e, t) {
			t === void 0 && (t = {}), this.fab.close(t.fab);
		},
		".fab-backdrop": function() {
			this.fab.close();
		}
	}
}, Zc = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = {
			el: void 0,
			inputEl: void 0,
			inputEvents: "change input compositionend",
			disableButton: !0,
			disableButtonEl: void 0,
			backdropEl: void 0,
			searchContainer: void 0,
			searchItem: "li",
			searchIn: void 0,
			searchGroup: ".list-group",
			searchGroupTitle: ".list-group-title",
			ignore: ".searchbar-ignore",
			foundEl: ".searchbar-found",
			notFoundEl: ".searchbar-not-found",
			hideOnEnableEl: ".searchbar-hide-on-enable",
			hideOnSearchEl: ".searchbar-hide-on-search",
			backdrop: !0,
			removeDiacritics: !0,
			customSearch: !1,
			hideGroupTitles: !0,
			hideGroups: !0,
			disableOnBackdropClick: !0,
			expandable: !1,
			inline: !1
		};
		n.useModulesParams(r), n.params = J(r, t);
		let i = W(n.params.el);
		if (i.length === 0) return n;
		if (i[0].f7Searchbar) return i[0].f7Searchbar;
		i[0].f7Searchbar = n;
		let a, o = i.parents(".navbar");
		if (i.parents(".page").length > 0) a = i.parents(".page");
		else if (o.length > 0 && (a = W(e.navbar.getPageByEl(o[0])), !a.length)) {
			let e = i.parents(".view").find(".page-current");
			e[0] && e[0].f7Page && e[0].f7Page.navbarEl === o[0] && (a = e);
		}
		let s;
		t.foundEl ? s = W(t.foundEl) : typeof n.params.foundEl == "string" && a && (s = a.find(n.params.foundEl));
		let c;
		t.notFoundEl ? c = W(t.notFoundEl) : typeof n.params.notFoundEl == "string" && a && (c = a.find(n.params.notFoundEl));
		let l;
		t.hideOnEnableEl ? l = W(t.hideOnEnableEl) : typeof n.params.hideOnEnableEl == "string" && a && (l = a.find(n.params.hideOnEnableEl));
		let u;
		t.hideOnSearchEl ? u = W(t.hideOnSearchEl) : typeof n.params.hideOnSearchEl == "string" && a && (u = a.find(n.params.hideOnSearchEl));
		let d = n.params.expandable || i.hasClass("searchbar-expandable"), f = n.params.inline || i.hasClass("searchbar-inline");
		n.params.backdrop === void 0 && (n.params.backdrop = !f);
		let p;
		n.params.backdrop && (p = n.params.backdropEl ? W(n.params.backdropEl) : a && a.length > 0 ? a.find(".searchbar-backdrop") : i.siblings(".searchbar-backdrop"), p.length === 0 && (p = W("<div class=\"searchbar-backdrop\"></div>"), a && a.length ? i.parents(a).length > 0 && o && i.parents(o).length === 0 ? p.insertBefore(i) : p.insertBefore(a.find(".page-content").eq(0)) : p.insertBefore(i)));
		let m;
		n.params.searchContainer && (m = W(n.params.searchContainer));
		let h;
		h = n.params.inputEl ? W(n.params.inputEl) : i.find("input[type=\"search\"]").eq(0);
		let g;
		n.params.disableButton && (g = n.params.disableButtonEl ? W(n.params.disableButtonEl) : i.find(".searchbar-disable-button")), J(n, {
			app: e,
			view: e.views.get(i.parents(".view")),
			$el: i,
			el: i[0],
			$backdropEl: p,
			backdropEl: p && p[0],
			$searchContainer: m,
			searchContainer: m && m[0],
			$inputEl: h,
			inputEl: h[0],
			$disableButtonEl: g,
			disableButtonEl: g && g[0],
			disableButtonHasMargin: !1,
			$pageEl: a,
			pageEl: a && a[0],
			$navbarEl: o,
			navbarEl: o && o[0],
			$foundEl: s,
			foundEl: s && s[0],
			$notFoundEl: c,
			notFoundEl: c && c[0],
			$hideOnEnableEl: l,
			hideOnEnableEl: l && l[0],
			$hideOnSearchEl: u,
			hideOnSearchEl: u && u[0],
			previousQuery: "",
			query: "",
			isVirtualList: m && m.hasClass("virtual-list"),
			virtualList: void 0,
			enabled: !1,
			expandable: d,
			inline: f
		});
		function _(e) {
			e.preventDefault();
		}
		function v(e) {
			n.enable(e), n.$el.addClass("searchbar-focused");
		}
		function y() {
			n.$el.removeClass("searchbar-focused");
		}
		function b() {
			let e = n.$inputEl.val().trim();
			(n.$searchContainer && n.$searchContainer.length > 0 && (n.params.searchIn || n.isVirtualList || n.params.searchIn === n.params.searchItem) || n.params.customSearch) && n.search(e, !0);
		}
		function x(e, t) {
			n.$el.trigger("searchbar:clear", t), n.emit("local::clear searchbarClear", n, t);
		}
		function S(e) {
			n.disable(e);
		}
		function C() {
			!n || n && !n.$el || n.enabled && (n.$el.removeClass("searchbar-enabled"), n.expandable && n.$el.parents(".navbar").removeClass("with-searchbar-expandable-enabled with-searchbar-expandable-enabled-no-transition"));
		}
		function w() {
			!n || n && !n.$el || n.enabled && (n.$el.addClass("searchbar-enabled"), n.expandable && n.$el.parents(".navbar").addClass("with-searchbar-expandable-enabled-no-transition"));
		}
		return n.attachEvents = function() {
			i.on("submit", _), n.params.disableButton && n.$disableButtonEl.on("click", S), n.params.disableOnBackdropClick && n.$backdropEl && n.$backdropEl.on("click", S), n.expandable && e.theme === "ios" && n.view && o.length && n.$pageEl && (n.$pageEl.on("page:beforeout", C), n.$pageEl.on("page:beforein", w)), n.$inputEl.on("focus", v), n.$inputEl.on("blur", y), n.$inputEl.on(n.params.inputEvents, b), n.$inputEl.on("input:clear", x);
		}, n.detachEvents = function() {
			i.off("submit", _), n.params.disableButton && n.$disableButtonEl.off("click", S), n.params.disableOnBackdropClick && n.$backdropEl && n.$backdropEl.off("click", S), n.expandable && e.theme === "ios" && n.view && o.length && n.$pageEl && (n.$pageEl.off("page:beforeout", C), n.$pageEl.off("page:beforein", w)), n.$inputEl.off("focus", v), n.$inputEl.off("blur", y), n.$inputEl.off(n.params.inputEvents, b), n.$inputEl.off("input:clear", x);
		}, n.useModules(), n.init(), n;
	}
	clear(e) {
		let t = this;
		if (!t.query && e && W(e.target).hasClass("searchbar-clear")) return t.disable(), t;
		let n = t.value;
		return t.$inputEl.val("").trigger("change").focus(), t.$el.trigger("searchbar:clear", n), t.emit("local::clear searchbarClear", t, n), t;
	}
	setDisableButtonMargin() {
		let e = this;
		if (e.expandable) return;
		let t = e.app;
		e.$disableButtonEl.transition(0).show(), e.$disableButtonEl.css(`margin-${t.rtl ? "left" : "right"}`, `${-e.disableButtonEl.offsetWidth}px`), e._clientLeft = e.$disableButtonEl[0].clientLeft, e.$disableButtonEl.transition(""), e.disableButtonHasMargin = !0;
	}
	enable(e) {
		let t = this;
		if (t.enabled) return t;
		let n = t.app, r = V(), i = X();
		t.enabled = !0;
		function a() {
			if (t.$backdropEl && (t.$searchContainer && t.$searchContainer.length || t.params.customSearch) && !t.$el.hasClass("searchbar-enabled") && !t.query && t.backdropShow(), t.$el.addClass("searchbar-enabled"), (!t.$disableButtonEl || t.$disableButtonEl && t.$disableButtonEl.length === 0) && t.$el.addClass("searchbar-enabled-no-disable-button"), !t.expandable && t.$disableButtonEl && t.$disableButtonEl.length > 0 && n.theme !== "md" && (t.disableButtonHasMargin || t.setDisableButtonMargin(), t.$disableButtonEl.css(`margin-${n.rtl ? "left" : "right"}`, "0px")), t.expandable) {
				let e = t.$el.parents(".navbar");
				if (e.hasClass("navbar-large") && t.$pageEl) {
					let n = t.$pageEl.find(".page-content"), r = e.find(".title-large");
					n.addClass("with-searchbar-expandable-enabled"), e.hasClass("navbar-large") && e.hasClass("navbar-large-collapsed") && r.length && n.length && (n.transition(0), n[0].scrollTop -= r[0].offsetHeight, setTimeout(() => {
						n.transition("");
					}, 200));
				}
				n.theme === "md" && e.length ? e.addClass("with-searchbar-expandable-enabled") : (e.addClass("with-searchbar-expandable-enabled"), e.hasClass("navbar-large") && e.addClass("navbar-large-collapsed"));
			}
			t.$hideOnEnableEl && t.$hideOnEnableEl.addClass("hidden-by-searchbar"), t.$el.trigger("searchbar:enable"), t.emit("local::enable searchbarEnable", t);
		}
		let o = !1;
		return e === !0 && r.activeElement !== t.inputEl && (o = !0), i.ios && n.theme === "ios" ? t.expandable ? (o && t.$inputEl.focus(), a()) : (o && t.$inputEl.focus(), e && (e.type === "focus" || e === !0) ? Ua(() => {
			a();
		}, 400) : a()) : (o && t.$inputEl.focus(), n.theme === "md" && t.expandable && t.$el.parents(".page, .view, .navbar-inner, .navbar").scrollLeft(n.rtl ? 100 : 0), a()), t;
	}
	disable() {
		let e = this;
		if (!e.enabled) return e;
		let t = e.app;
		if (e.$inputEl.val("").trigger("change"), e.$el.removeClass("searchbar-enabled searchbar-focused searchbar-enabled-no-disable-button"), e.expandable) {
			let n = e.$el.parents(".navbar"), r = e.$pageEl && e.$pageEl.find(".page-content");
			if (n.hasClass("navbar-large") && r.length) {
				let t = n.find(".title-large");
				if (e.$el.transitionEnd(() => {
					r.removeClass("with-searchbar-expandable-closing");
				}), n.hasClass("navbar-large") && n.hasClass("navbar-large-collapsed") && t.length) {
					let e = r[0].scrollTop, n = t[0].offsetHeight;
					e > n && (r.transition(0), r[0].scrollTop = e + n, setTimeout(() => {
						r.transition("");
					}, 200));
				}
				r.removeClass("with-searchbar-expandable-enabled").addClass("with-searchbar-expandable-closing");
			}
			t.theme === "md" && n.length ? (n.removeClass("with-searchbar-expandable-enabled with-searchbar-expandable-enabled-no-transition").addClass("with-searchbar-expandable-closing"), e.$el.transitionEnd(() => {
				n.removeClass("with-searchbar-expandable-closing");
			})) : (n.removeClass("with-searchbar-expandable-enabled with-searchbar-expandable-enabled-no-transition").addClass("with-searchbar-expandable-closing"), e.$el.transitionEnd(() => {
				n.removeClass("with-searchbar-expandable-closing");
			}), e.$pageEl && e.$pageEl.find(".page-content").trigger("scroll"));
		}
		return !e.expandable && e.$disableButtonEl && e.$disableButtonEl.length > 0 && t.theme !== "md" && e.$disableButtonEl.css(`margin-${t.rtl ? "left" : "right"}`, `${-e.disableButtonEl.offsetWidth}px`), e.$backdropEl && (e.$searchContainer && e.$searchContainer.length || e.params.customSearch) && e.backdropHide(), e.enabled = !1, e.$inputEl.blur(), e.$hideOnEnableEl && e.$hideOnEnableEl.removeClass("hidden-by-searchbar"), e.$el.trigger("searchbar:disable"), e.emit("local::disable searchbarDisable", e), e;
	}
	toggle() {
		let e = this;
		return e.enabled ? e.disable() : e.enable(!0), e;
	}
	backdropShow() {
		let e = this;
		return e.$backdropEl && e.$backdropEl.addClass("searchbar-backdrop-in"), e;
	}
	backdropHide() {
		let e = this;
		return e.$backdropEl && e.$backdropEl.removeClass("searchbar-backdrop-in"), e;
	}
	search(e, t) {
		let n = this;
		if (n.previousQuery = n.query || "", e === n.previousQuery) return n;
		t || (n.enabled || n.enable(), n.$inputEl.val(e), n.$inputEl.trigger("input")), n.query = e, n.value = e;
		let { $searchContainer: r, $el: i, $foundEl: a, $notFoundEl: o, $hideOnSearchEl: s, isVirtualList: c } = n;
		if (e.length > 0 && s ? s.addClass("hidden-by-searchbar") : s && s.removeClass("hidden-by-searchbar"), (r && r.length && i.hasClass("searchbar-enabled") || n.params.customSearch && i.hasClass("searchbar-enabled")) && (e.length === 0 ? n.backdropShow() : n.backdropHide()), n.params.customSearch) return i.trigger("searchbar:search", {
			query: e,
			previousQuery: n.previousQuery
		}), n.emit("local::search searchbarSearch", n, e, n.previousQuery), n;
		let l = [], u;
		if (c) {
			if (n.virtualList = r[0].f7VirtualList, e.trim() === "") return n.virtualList.resetFilter(), o && o.hide(), a && a.show(), i.trigger("searchbar:search", {
				query: e,
				previousQuery: n.previousQuery
			}), n.emit("local::search searchbarSearch", n, e, n.previousQuery), n;
			if (u = n.params.removeDiacritics ? Pc(e) : e, n.virtualList.params.searchAll) l = n.virtualList.params.searchAll(u, n.virtualList.items) || [];
			else if (n.virtualList.params.searchByItem) for (let e = 0; e < n.virtualList.items.length; e += 1) n.virtualList.params.searchByItem(u, n.virtualList.items[e], e) && l.push(e);
		} else {
			let t;
			t = n.params.removeDiacritics ? Pc(e.trim().toLowerCase()).split(" ") : e.trim().toLowerCase().split(" "), r.find(n.params.searchItem).removeClass("hidden-by-searchbar").each((e) => {
				let r = W(e), i = [], a = n.params.searchIn ? r.find(n.params.searchIn) : r;
				n.params.searchIn === n.params.searchItem && (a = r), a.each((e) => {
					let t = W(e).text().trim().toLowerCase();
					n.params.removeDiacritics && (t = Pc(t)), i.push(t);
				}), i = i.join(" ");
				let o = 0;
				for (let e = 0; e < t.length; e += 1) i.indexOf(t[e]) >= 0 && (o += 1);
				o !== t.length && !(n.params.ignore && r.is(n.params.ignore)) ? r.addClass("hidden-by-searchbar") : l.push(r[0]);
			}), n.params.hideGroupTitles && r.find(n.params.searchGroupTitle).each((e) => {
				let t = W(e), r = t.nextAll(n.params.searchItem), i = !0;
				for (let e = 0; e < r.length; e += 1) {
					let t = r.eq(e);
					if (t.is(n.params.searchGroupTitle)) break;
					t.hasClass("hidden-by-searchbar") || (i = !1);
				}
				let a = n.params.ignore && t.is(n.params.ignore);
				i && !a ? t.addClass("hidden-by-searchbar") : t.removeClass("hidden-by-searchbar");
			}), n.params.hideGroups && r.find(n.params.searchGroup).each((e) => {
				let t = W(e), r = n.params.ignore && t.is(n.params.ignore);
				t.find(n.params.searchItem).filter((e) => !W(e).hasClass("hidden-by-searchbar")).length === 0 && !r ? t.addClass("hidden-by-searchbar") : t.removeClass("hidden-by-searchbar");
			});
		}
		return l.length === 0 ? (o && o.show(), a && a.hide()) : (o && o.hide(), a && a.show()), c && n.virtualList && n.virtualList.filterItems(l), i.trigger("searchbar:search", {
			query: e,
			previousQuery: n.previousQuery,
			foundItems: l
		}), n.emit("local::search searchbarSearch", n, e, n.previousQuery, l), n;
	}
	init() {
		let e = this;
		e.expandable && e.$el && e.$el.addClass("searchbar-expandable"), e.inline && e.$el && e.$el.addClass("searchbar-inline"), e.attachEvents();
	}
	destroy() {
		let e = this;
		e.emit("local::beforeDestroy searchbarBeforeDestroy", e), e.$el.trigger("searchbar:beforedestroy"), e.detachEvents(), e.$el[0] && (e.$el[0].f7Searchbar = null, delete e.$el[0].f7Searchbar), Ba(e);
	}
}, Qc = {
	name: "searchbar",
	static: { Searchbar: Zc },
	create() {
		let e = this;
		e.searchbar = ho({
			defaultSelector: ".searchbar",
			constructor: Zc,
			app: e,
			domProp: "f7Searchbar",
			addMethods: "clear enable disable toggle search".split(" ")
		});
	},
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".searchbar-init").each((e) => {
				let n = W(e);
				t.searchbar.create(J(n.dataset(), { el: e }));
			});
		},
		tabBeforeRemove(e) {
			W(e).find(".searchbar-init").each((e) => {
				e.f7Searchbar && e.f7Searchbar.destroy && e.f7Searchbar.destroy();
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".searchbar-init").each((e) => {
				let n = W(e);
				t.searchbar.create(J(n.dataset(), { el: e }));
			}), t.theme === "ios" && e.view && e.view.router.dynamicNavbar && e.$navbarEl && e.$navbarEl.length > 0 && e.$navbarEl.find(".searchbar-init").each((e) => {
				let n = W(e);
				t.searchbar.create(J(n.dataset(), { el: e }));
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".searchbar-init").each((e) => {
				e.f7Searchbar && e.f7Searchbar.destroy && e.f7Searchbar.destroy();
			}), t.theme === "ios" && e.view && e.view.router.dynamicNavbar && e.$navbarEl && e.$navbarEl.length > 0 && e.$navbarEl.find(".searchbar-init").each((e) => {
				e.f7Searchbar && e.f7Searchbar.destroy && e.f7Searchbar.destroy();
			});
		}
	},
	clicks: {
		".searchbar-clear": function(e, t) {
			t === void 0 && (t = {});
			let n = this.searchbar.get(t.searchbar);
			n && n.clear();
		},
		".searchbar-enable": function(e, t) {
			t === void 0 && (t = {});
			let n = this.searchbar.get(t.searchbar);
			n && n.enable(!0);
		},
		".searchbar-disable": function(e, t) {
			t === void 0 && (t = {});
			let n = this.searchbar.get(t.searchbar);
			n && n.disable();
		},
		".searchbar-toggle": function(e, t) {
			t === void 0 && (t = {});
			let n = this.searchbar.get(t.searchbar);
			n && n.toggle();
		}
	},
	vnode: { "searchbar-init": {
		insert(e) {
			let t = this, n = e.elm, r = W(n);
			t.searchbar.create(J(r.dataset(), { el: n }));
		},
		destroy(e) {
			let t = e.elm;
			t.f7Searchbar && t.f7Searchbar.destroy && t.f7Searchbar.destroy();
		}
	} }
};
//#endregion
//#region node_modules/framework7/components/messages/messages-class.js
function $c() {
	return $c = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, $c.apply(this, arguments);
}
var el = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = {
			autoLayout: !0,
			messages: [],
			newMessagesFirst: !1,
			scrollMessages: !0,
			scrollMessagesOnEdge: !0,
			firstMessageRule: void 0,
			lastMessageRule: void 0,
			tailMessageRule: void 0,
			sameNameMessageRule: void 0,
			sameHeaderMessageRule: void 0,
			sameFooterMessageRule: void 0,
			sameAvatarMessageRule: void 0,
			customClassMessageRule: void 0,
			renderMessage: void 0
		};
		n.useModulesParams(r), n.params = J(r, t);
		let i = W(t.el).eq(0);
		if (i.length === 0) return n;
		if (i[0].f7Messages) return i[0].f7Messages;
		i[0].f7Messages = n;
		let a = i.closest(".page-content").eq(0);
		return J(n, {
			messages: n.params.messages,
			$el: i,
			el: i[0],
			$pageContentEl: a,
			pageContentEl: a[0]
		}), n.useModules(), n.init(), n;
	}
	getMessageData(e) {
		let t = W(e), n = {
			name: t.find(".message-name").html(),
			header: t.find(".message-header").html(),
			textHeader: t.find(".message-text-header").html(),
			textFooter: t.find(".message-text-footer").html(),
			footer: t.find(".message-footer").html(),
			isTitle: t.hasClass("messages-title"),
			type: t.hasClass("message-sent") ? "sent" : "received",
			text: t.find(".message-text").html(),
			image: t.find(".message-image").html(),
			imageSrc: t.find(".message-image img").attr("src"),
			typing: t.hasClass("message-typing")
		};
		n.isTitle && (n.text = t.html()), n.text && n.textHeader && (n.text = n.text.replace(`<div class="message-text-header">${n.textHeader}</div>`, "")), n.text && n.textFooter && (n.text = n.text.replace(`<div class="message-text-footer">${n.textFooter}</div>`, ""));
		let r = t.find(".message-avatar").css("background-image");
		return (r === "none" || r === "") && (r = void 0), r = r && typeof r == "string" ? r.replace("url(", "").replace(")", "").replace(/"/g, "").replace(/'/g, "") : void 0, n.avatar = r, n;
	}
	getMessagesData() {
		let e = this, t = [];
		return e.$el.find(".message, .messages-title").each((n) => {
			t.push(e.getMessageData(n));
		}), t;
	}
	renderMessage(e) {
		let t = this, n = J({
			type: "sent",
			attrs: {}
		}, e);
		return t.params.renderMessage ? t.params.renderMessage.call(t, n) : n.isTitle ? `<div class="messages-title">${n.text}</div>` : Q("div", $c({ class: `message message-${n.type} ${n.isTyping ? "message-typing" : ""} ${n.cssClass || ""}` }, n.attrs), n.avatar && Q("div", {
			class: "message-avatar",
			style: `background-image:url(${n.avatar})`
		}), Q("div", { class: "message-content" }, n.name && Q("div", { class: "message-name" }, n.name), n.header && Q("div", { class: "message-header" }, n.header), Q("div", { class: "message-bubble" }, n.textHeader && Q("div", { class: "message-text-header" }, n.textHeader), n.image && Q("div", { class: "message-image" }, n.image), n.imageSrc && !n.image && Q("div", { class: "message-image" }, Q("img", { src: n.imageSrc })), (n.text || n.isTyping) && Q("div", { class: "message-text" }, n.text || "", n.isTyping && Q("div", { class: "message-typing-indicator" }, Q("div", null), Q("div", null), Q("div", null))), n.textFooter && Q("div", { class: "message-text-footer" }, n.textFooter)), n.footer && Q("div", { class: "message-footer" }, n.footer)));
	}
	renderMessages(e, t) {
		e === void 0 && (e = this.messages), t === void 0 && (t = this.params.newMessagesFirst ? "prepend" : "append");
		let n = this, r = e.map((e) => n.renderMessage(e)).join("");
		n.$el[t](r);
	}
	isFirstMessage() {
		let e = this;
		return e.params.firstMessageRule ? e.params.firstMessageRule(...arguments) : !1;
	}
	isLastMessage() {
		let e = this;
		return e.params.lastMessageRule ? e.params.lastMessageRule(...arguments) : !1;
	}
	isTailMessage() {
		let e = this;
		return e.params.tailMessageRule ? e.params.tailMessageRule(...arguments) : !1;
	}
	isSameNameMessage() {
		let e = this;
		return e.params.sameNameMessageRule ? e.params.sameNameMessageRule(...arguments) : !1;
	}
	isSameHeaderMessage() {
		let e = this;
		return e.params.sameHeaderMessageRule ? e.params.sameHeaderMessageRule(...arguments) : !1;
	}
	isSameFooterMessage() {
		let e = this;
		return e.params.sameFooterMessageRule ? e.params.sameFooterMessageRule(...arguments) : !1;
	}
	isSameAvatarMessage() {
		let e = this;
		return e.params.sameAvatarMessageRule ? e.params.sameAvatarMessageRule(...arguments) : !1;
	}
	isCustomClassMessage() {
		let e = this;
		if (e.params.customClassMessageRule) return e.params.customClassMessageRule(...arguments);
	}
	layout() {
		let e = this;
		e.$el.find(".message, .messages-title").each((t, n) => {
			let r = W(t);
			e.messages ||= e.getMessagesData();
			let i = [], a = e.messages[n], o = e.messages[n - 1], s = e.messages[n + 1];
			e.isFirstMessage(a, o, s) && i.push("message-first"), e.isLastMessage(a, o, s) && i.push("message-last"), e.isTailMessage(a, o, s) && i.push("message-tail"), e.isSameNameMessage(a, o, s) && i.push("message-same-name"), e.isSameHeaderMessage(a, o, s) && i.push("message-same-header"), e.isSameFooterMessage(a, o, s) && i.push("message-same-footer"), e.isSameAvatarMessage(a, o, s) && i.push("message-same-avatar");
			let c = e.isCustomClassMessage(a, o, s);
			c && c.length && (typeof c == "string" && (c = c.split(" ")), c.forEach((e) => {
				i.push(e);
			})), r.removeClass("message-first message-last message-tail message-same-name message-same-header message-same-footer message-same-avatar"), i.forEach((e) => {
				r.addClass(e);
			});
		});
	}
	clear() {
		let e = this;
		e.messages = [], e.$el.html("");
	}
	removeMessage(e, t) {
		t === void 0 && (t = !0);
		let n = this, r, i;
		return typeof e == "number" ? (r = e, i = n.$el.find(".message, .messages-title").eq(r)) : n.messages && n.messages.indexOf(e) >= 0 ? (r = n.messages.indexOf(e), i = n.$el.children().eq(r)) : (i = W(e), r = i.index()), i.length === 0 ? n : (i.remove(), n.messages.splice(r, 1), n.params.autoLayout && t && n.layout(), n);
	}
	removeMessages(e, t) {
		t === void 0 && (t = !0);
		let n = this;
		if (Array.isArray(e)) {
			let t = [];
			e.forEach((e) => {
				t.push(n.$el.find(".message, .messages-title").eq(e));
			}), t.forEach((e) => {
				n.removeMessage(e, !1);
			});
		} else W(e).each((e) => {
			n.removeMessage(e, !1);
		});
		return n.params.autoLayout && t && n.layout(), n;
	}
	addMessage() {
		let e = this, t, n, r;
		var i = [...arguments];
		return typeof i[1] == "boolean" ? [t, n, r] = i : [t, r, n] = i, n === void 0 && (n = !0), r === void 0 && (r = e.params.newMessagesFirst ? "prepend" : "append"), e.addMessages([t], n, r);
	}
	setScrollData() {
		let e = this, t = e.pageContentEl.scrollHeight, n = e.pageContentEl.offsetHeight, r = e.pageContentEl.scrollTop;
		return e.scrollData = {
			scrollHeightBefore: t,
			heightBefore: n,
			scrollBefore: r
		}, {
			scrollHeightBefore: t,
			heightBefore: n,
			scrollBefore: r
		};
	}
	addMessages() {
		let e = this, t, n, r;
		var i = [...arguments];
		typeof i[1] == "boolean" ? [t, n, r] = i : [t, r, n] = i, n === void 0 && (n = !0), r === void 0 && (r = e.params.newMessagesFirst ? "prepend" : "append");
		let { scrollHeightBefore: a, scrollBefore: o } = e.setScrollData(), s = "", c = e.messages.filter((e) => e.isTyping)[0];
		t.forEach((t) => {
			c ? r === "append" ? e.messages.splice(e.messages.indexOf(c), 0, t) : e.messages.splice(e.messages.indexOf(c) + 1, 0, t) : e.messages[r === "append" ? "push" : "unshift"](t), s += e.renderMessage(t);
		});
		let l = W(s);
		return n && (r === "append" && !e.params.newMessagesFirst && l.addClass("message-appear-from-bottom"), r === "prepend" && e.params.newMessagesFirst && l.addClass("message-appear-from-top")), c ? r === "append" ? l.insertBefore(e.$el.find(".message-typing")) : l.insertAfter(e.$el.find(".message-typing")) : e.$el[r](l), e.params.autoLayout && e.layout(), r === "prepend" && !c && (e.pageContentEl.scrollTop = o + (e.pageContentEl.scrollHeight - a)), e.params.scrollMessages && (r === "append" && !e.params.newMessagesFirst || r === "prepend" && e.params.newMessagesFirst && !c) && e.scrollWithEdgeCheck(n), e;
	}
	showTyping(e) {
		e === void 0 && (e = {});
		let t = this, n = t.messages.filter((e) => e.isTyping)[0];
		return n && t.removeMessage(t.messages.indexOf(n)), t.addMessage(J({
			type: "received",
			isTyping: !0
		}, e)), t;
	}
	hideTyping() {
		let e = this, t, n;
		if (e.messages.forEach((e, n) => {
			e.isTyping && (t = n);
		}), t !== void 0 && e.$el.find(".message").eq(t).hasClass("message-typing") && (n = !0, e.removeMessage(t)), !n) {
			let t = e.$el.find(".message-typing");
			t.length && e.removeMessage(t);
		}
		return e;
	}
	scrollWithEdgeCheck(e) {
		let t = this, { scrollBefore: n, scrollHeightBefore: r, heightBefore: i } = t.scrollData;
		if (t.params.scrollMessagesOnEdge) {
			let a = !1;
			t.params.newMessagesFirst && n === 0 && (a = !0), !t.params.newMessagesFirst && n - (r - i) >= -10 && (a = !0), a && t.scroll(e ? void 0 : 0);
		} else t.scroll(e ? void 0 : 0);
	}
	scroll(e, t) {
		e === void 0 && (e = 300);
		let n = this, r = n.pageContentEl.scrollTop, i;
		if (t !== void 0) i = t;
		else if (i = n.params.newMessagesFirst ? 0 : n.pageContentEl.scrollHeight - n.pageContentEl.offsetHeight, i === r) return n;
		return n.$pageContentEl.scrollTop(i, e), n;
	}
	init() {
		let e = this;
		(!e.messages || e.messages.length === 0) && (e.messages = e.getMessagesData()), e.params.messages && e.params.messages.length && e.renderMessages(), e.params.autoLayout && e.layout(), e.params.scrollMessages && e.scroll(0);
	}
	destroy() {
		let e = this;
		e.emit("local::beforeDestroy messagesBeforeDestroy", e), e.$el.trigger("messages:beforedestroy"), e.$el[0] && (e.$el[0].f7Messages = null, delete e.$el[0].f7Messages), Ba(e);
	}
}, tl = {
	name: "messages",
	static: { Messages: el },
	create() {
		let e = this;
		e.messages = ho({
			defaultSelector: ".messages",
			constructor: el,
			app: e,
			domProp: "f7Messages",
			addMethods: "renderMessages layout scroll clear removeMessage removeMessages addMessage addMessages".split(" ")
		});
	},
	on: {
		tabBeforeRemove(e) {
			let t = this;
			W(e).find(".messages-init").each((e) => {
				t.messages.destroy(e);
			});
		},
		tabMounted(e) {
			let t = this;
			W(e).find(".messages-init").each((e) => {
				t.messages.create({ el: e });
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".messages-init").each((e) => {
				t.messages.destroy(e);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".messages-init").each((e) => {
				t.messages.create({ el: e });
			});
		}
	},
	vnode: { "messages-init": {
		insert(e) {
			let t = this, n = e.elm;
			t.messages.create({ el: n });
		},
		destroy(e) {
			let t = this, n = e.elm;
			t.messages.destroy(n);
		}
	} }
}, nl = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = {
			top: !1,
			topOffset: 0,
			bottomOffset: 0,
			attachments: [],
			renderAttachments: void 0,
			renderAttachment: void 0,
			maxHeight: null,
			resizePage: !0
		};
		n.useModulesParams(r), n.params = J(r, t);
		let i = W(n.params.el);
		if (i.length === 0) return n;
		if (i[0].f7Messagebar) return i[0].f7Messagebar;
		i[0].f7Messagebar = n;
		let a = i.parents(".page").eq(0), o = a.find(".page-content").eq(0), s = i.find(".messagebar-area"), c;
		c = n.params.textareaEl ? W(n.params.textareaEl) : i.find("textarea");
		let l = i.find(".messagebar-attachments"), u = i.find(".messagebar-sheet");
		n.params.top && i.addClass("messagebar-top"), J(n, {
			$el: i,
			el: i[0],
			$areaEl: s,
			areaEl: s[0],
			$textareaEl: c,
			textareaEl: c[0],
			$attachmentsEl: l,
			attachmentsEl: l[0],
			attachmentsVisible: l.hasClass("messagebar-attachments-visible"),
			$sheetEl: u,
			sheetEl: u[0],
			sheetVisible: u.hasClass("messagebar-sheet-visible"),
			$pageEl: a,
			pageEl: a[0],
			$pageContentEl: o,
			pageContentEl: o,
			top: i.hasClass("messagebar-top") || n.params.top,
			attachments: []
		});
		function d() {
			n.params.resizePage && n.resizePage();
		}
		function f(e) {
			e.preventDefault();
		}
		function p(e) {
			let t = W(this).index();
			W(e.target).closest(".messagebar-attachment-delete").length ? (W(this).trigger("messagebar:attachmentdelete", t), n.emit("local::attachmentDelete messagebarAttachmentDelete", n, this, t)) : (W(this).trigger("messagebar:attachmentclick", t), n.emit("local::attachmentClick messagebarAttachmentClick", n, this, t));
		}
		function m() {
			n.checkEmptyState(), n.$el.trigger("messagebar:change"), n.emit("local::change messagebarChange", n);
		}
		function h() {
			n.sheetHide(), n.$el.addClass("messagebar-focused"), n.$el.trigger("messagebar:focus"), n.emit("local::focus messagebarFocus", n);
		}
		function g() {
			n.$el.removeClass("messagebar-focused"), n.$el.trigger("messagebar:blur"), n.emit("local::blur messagebarBlur", n);
		}
		return n.attachEvents = function() {
			i.on("textarea:resize", d), i.on("submit", f), i.on("click", ".messagebar-attachment", p), c.on("change input", m), c.on("focus", h), c.on("blur", g), e.on("resize", d);
		}, n.detachEvents = function() {
			i.off("textarea:resize", d), i.off("submit", f), i.off("click", ".messagebar-attachment", p), c.off("change input", m), c.off("focus", h), c.off("blur", g), e.off("resize", d);
		}, n.useModules(), n.init(), n;
	}
	focus() {
		let e = this;
		return e.$textareaEl.focus(), e;
	}
	blur() {
		let e = this;
		return e.$textareaEl.blur(), e;
	}
	clear() {
		let e = this;
		return e.$textareaEl.val("").trigger("change"), e;
	}
	getValue() {
		return this.$textareaEl.val().trim();
	}
	setValue(e) {
		let t = this;
		return t.$textareaEl.val(e).trigger("change"), t;
	}
	setPlaceholder(e) {
		let t = this;
		return t.$textareaEl.attr("placeholder", e), t;
	}
	resizePage() {
		let e = this, { params: t, $el: n, top: r, $pageEl: i, $pageContentEl: a, $areaEl: o, $textareaEl: s, $sheetEl: c, $attachmentsEl: l } = e, u = n[0].offsetHeight, d = t.maxHeight;
		if (!r) {
			let r = parseInt(a.css("padding-bottom"), 10), f = u + t.bottomOffset;
			if (f !== r && a.length) {
				let t = parseInt(a.css("padding-top"), 10), r = a[0].scrollHeight, u = a[0].offsetHeight, p = a[0].scrollTop === r - u;
				d ||= i[0].offsetHeight - t - c.outerHeight() - l.outerHeight() - parseInt(o.css("margin-top"), 10) - parseInt(o.css("margin-bottom"), 10), s.css("max-height", `${d}px`), a.css("padding-bottom", `${f}px`), p && a.scrollTop(a[0].scrollHeight - u), n.trigger("messagebar:resizepage"), e.emit("local::resizePage messagebarResizePage", e);
			}
		}
	}
	checkEmptyState() {
		let { $el: e, $textareaEl: t } = this, n = t.val().trim();
		n && n.length ? e.addClass("messagebar-with-value") : e.removeClass("messagebar-with-value");
	}
	attachmentsCreate(e) {
		e === void 0 && (e = "");
		let t = this, n = W(`<div class="messagebar-attachments">${e}</div>`);
		return n.insertBefore(t.$textareaEl), J(t, {
			$attachmentsEl: n,
			attachmentsEl: n[0]
		}), t;
	}
	attachmentsShow(e) {
		e === void 0 && (e = "");
		let t = this;
		return t.$attachmentsEl = t.$el.find(".messagebar-attachments"), t.$attachmentsEl.length === 0 && t.attachmentsCreate(e), t.$el.addClass("messagebar-attachments-visible"), t.attachmentsVisible = !0, t.params.resizePage && t.resizePage(), t;
	}
	attachmentsHide() {
		let e = this;
		return e.$el.removeClass("messagebar-attachments-visible"), e.attachmentsVisible = !1, e.params.resizePage && e.resizePage(), e;
	}
	attachmentsToggle() {
		let e = this;
		return e.attachmentsVisible ? e.attachmentsHide() : e.attachmentsShow(), e;
	}
	renderAttachment(e) {
		let t = this;
		return t.params.renderAttachment ? t.params.renderAttachment.call(t, e) : `
      <div class="messagebar-attachment">
        <img src="${e}">
        <span class="messagebar-attachment-delete"></span>
      </div>
    `;
	}
	renderAttachments() {
		let e = this, t;
		t = e.params.renderAttachments ? e.params.renderAttachments.call(e, e.attachments) : `${e.attachments.map((t) => e.renderAttachment(t)).join("")}`, e.$attachmentsEl.length === 0 ? e.attachmentsCreate(t) : e.$attachmentsEl.html(t);
	}
	sheetCreate(e) {
		e === void 0 && (e = "");
		let t = this, n = W(`<div class="messagebar-sheet">${e}</div>`);
		return t.$el.append(n), J(t, {
			$sheetEl: n,
			sheetEl: n[0]
		}), t;
	}
	sheetShow(e) {
		e === void 0 && (e = "");
		let t = this;
		return t.$sheetEl = t.$el.find(".messagebar-sheet"), t.$sheetEl.length === 0 && t.sheetCreate(e), t.$el.addClass("messagebar-sheet-visible"), t.sheetVisible = !0, t.params.resizePage && t.resizePage(), t;
	}
	sheetHide() {
		let e = this;
		return e.$el.removeClass("messagebar-sheet-visible"), e.sheetVisible = !1, e.params.resizePage && e.resizePage(), e;
	}
	sheetToggle() {
		let e = this;
		return e.sheetVisible ? e.sheetHide() : e.sheetShow(), e;
	}
	init() {
		let e = this;
		return e.attachEvents(), e.checkEmptyState(), e;
	}
	destroy() {
		let e = this;
		e.emit("local::beforeDestroy messagebarBeforeDestroy", e), e.$el.trigger("messagebar:beforedestroy"), e.detachEvents(), e.$el[0] && (e.$el[0].f7Messagebar = null, delete e.$el[0].f7Messagebar), Ba(e);
	}
}, rl = {
	name: "messagebar",
	static: { Messagebar: nl },
	create() {
		let e = this;
		e.messagebar = ho({
			defaultSelector: ".messagebar",
			constructor: nl,
			app: e,
			domProp: "f7Messagebar",
			addMethods: "clear getValue setValue setPlaceholder resizePage focus blur attachmentsCreate attachmentsShow attachmentsHide attachmentsToggle renderAttachments sheetCreate sheetShow sheetHide sheetToggle".split(" ")
		});
	},
	on: {
		tabBeforeRemove(e) {
			let t = this;
			W(e).find(".messagebar-init").each((e) => {
				t.messagebar.destroy(e);
			});
		},
		tabMounted(e) {
			let t = this;
			W(e).find(".messagebar-init").each((e) => {
				t.messagebar.create(J({ el: e }, W(e).dataset()));
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".messagebar-init").each((e) => {
				t.messagebar.destroy(e);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".messagebar-init").each((e) => {
				t.messagebar.create(J({ el: e }, W(e).dataset()));
			});
		}
	},
	vnode: { "messagebar-init": {
		insert(e) {
			let t = this, n = e.elm;
			t.messagebar.create(J({ el: n }, W(n).dataset()));
		},
		destroy(e) {
			let t = this, n = e.elm;
			t.messagebar.destroy(n);
		}
	} }
};
//#endregion
//#region node_modules/swiper/shared/ssr-window.esm.mjs
function il(e) {
	return typeof e == "object" && !!e && "constructor" in e && e.constructor === Object;
}
function al(e, t) {
	e === void 0 && (e = {}), t === void 0 && (t = {}), Object.keys(t).forEach((n) => {
		e[n] === void 0 ? e[n] = t[n] : il(t[n]) && il(e[n]) && Object.keys(t[n]).length > 0 && al(e[n], t[n]);
	});
}
var ol = {
	body: {},
	addEventListener() {},
	removeEventListener() {},
	activeElement: {
		blur() {},
		nodeName: ""
	},
	querySelector() {
		return null;
	},
	querySelectorAll() {
		return [];
	},
	getElementById() {
		return null;
	},
	createEvent() {
		return { initEvent() {} };
	},
	createElement() {
		return {
			children: [],
			childNodes: [],
			style: {},
			setAttribute() {},
			getElementsByTagName() {
				return [];
			}
		};
	},
	createElementNS() {
		return {};
	},
	importNode() {
		return null;
	},
	location: {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		protocol: "",
		search: ""
	}
};
function sl() {
	let e = typeof document < "u" ? document : {};
	return al(e, ol), e;
}
var cl = {
	document: ol,
	navigator: { userAgent: "" },
	location: {
		hash: "",
		host: "",
		hostname: "",
		href: "",
		origin: "",
		pathname: "",
		protocol: "",
		search: ""
	},
	history: {
		replaceState() {},
		pushState() {},
		go() {},
		back() {}
	},
	CustomEvent: function() {
		return this;
	},
	addEventListener() {},
	removeEventListener() {},
	getComputedStyle() {
		return { getPropertyValue() {
			return "";
		} };
	},
	Image() {},
	Date() {},
	screen: {},
	setTimeout() {},
	clearTimeout() {},
	matchMedia() {
		return {};
	},
	requestAnimationFrame(e) {
		return typeof setTimeout > "u" ? (e(), null) : setTimeout(e, 0);
	},
	cancelAnimationFrame(e) {
		typeof setTimeout > "u" || clearTimeout(e);
	}
};
function ll() {
	let e = typeof window < "u" ? window : {};
	return al(e, cl), e;
}
//#endregion
//#region node_modules/swiper/shared/utils.mjs
function ul(e) {
	let t = e;
	Object.keys(t).forEach((e) => {
		try {
			t[e] = null;
		} catch {}
		try {
			delete t[e];
		} catch {}
	});
}
function dl(e, t) {
	return t === void 0 && (t = 0), setTimeout(e, t);
}
function fl() {
	return Date.now();
}
function pl(e) {
	let t = ll(), n;
	return t.getComputedStyle && (n = t.getComputedStyle(e, null)), !n && e.currentStyle && (n = e.currentStyle), n ||= e.style, n;
}
function ml(e, t) {
	t === void 0 && (t = "x");
	let n = ll(), r, i, a, o = pl(e);
	return n.WebKitCSSMatrix ? (i = o.transform || o.webkitTransform, i.split(",").length > 6 && (i = i.split(", ").map((e) => e.replace(",", ".")).join(", ")), a = new n.WebKitCSSMatrix(i === "none" ? "" : i)) : (a = o.MozTransform || o.OTransform || o.MsTransform || o.msTransform || o.transform || o.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), r = a.toString().split(",")), t === "x" && (i = n.WebKitCSSMatrix ? a.m41 : r.length === 16 ? parseFloat(r[12]) : parseFloat(r[4])), t === "y" && (i = n.WebKitCSSMatrix ? a.m42 : r.length === 16 ? parseFloat(r[13]) : parseFloat(r[5])), i || 0;
}
function hl(e) {
	return typeof e == "object" && !!e && e.constructor && Object.prototype.toString.call(e).slice(8, -1) === "Object";
}
function gl(e) {
	return typeof window < "u" && window.HTMLElement !== void 0 ? e instanceof HTMLElement : e && (e.nodeType === 1 || e.nodeType === 11);
}
function _l() {
	let e = Object(arguments.length <= 0 ? void 0 : arguments[0]), t = [
		"__proto__",
		"constructor",
		"prototype"
	];
	for (let n = 1; n < arguments.length; n += 1) {
		let r = n < 0 || arguments.length <= n ? void 0 : arguments[n];
		if (r != null && !gl(r)) {
			let n = Object.keys(Object(r)).filter((e) => t.indexOf(e) < 0);
			for (let t = 0, i = n.length; t < i; t += 1) {
				let i = n[t], a = Object.getOwnPropertyDescriptor(r, i);
				a !== void 0 && a.enumerable && (hl(e[i]) && hl(r[i]) ? r[i].__swiper__ ? e[i] = r[i] : _l(e[i], r[i]) : !hl(e[i]) && hl(r[i]) ? (e[i] = {}, r[i].__swiper__ ? e[i] = r[i] : _l(e[i], r[i])) : e[i] = r[i]);
			}
		}
	}
	return e;
}
function vl(e, t, n) {
	e.style.setProperty(t, n);
}
function yl(e) {
	let { swiper: t, targetPosition: n, side: r } = e, i = ll(), a = -t.translate, o = null, s, c = t.params.speed;
	t.wrapperEl.style.scrollSnapType = "none", i.cancelAnimationFrame(t.cssModeFrameID);
	let l = n > a ? "next" : "prev", u = (e, t) => l === "next" && e >= t || l === "prev" && e <= t, d = () => {
		s = (/* @__PURE__ */ new Date()).getTime(), o === null && (o = s);
		let e = Math.max(Math.min((s - o) / c, 1), 0), l = a + (.5 - Math.cos(e * Math.PI) / 2) * (n - a);
		if (u(l, n) && (l = n), t.wrapperEl.scrollTo({ [r]: l }), u(l, n)) {
			t.wrapperEl.style.overflow = "hidden", t.wrapperEl.style.scrollSnapType = "", setTimeout(() => {
				t.wrapperEl.style.overflow = "", t.wrapperEl.scrollTo({ [r]: l });
			}), i.cancelAnimationFrame(t.cssModeFrameID);
			return;
		}
		t.cssModeFrameID = i.requestAnimationFrame(d);
	};
	d();
}
function bl(e) {
	return e.querySelector(".swiper-slide-transform") || e.shadowRoot && e.shadowRoot.querySelector(".swiper-slide-transform") || e;
}
function xl(e, t) {
	return t === void 0 && (t = ""), [...e.children].filter((e) => e.matches(t));
}
function Sl(e, t) {
	t === void 0 && (t = []);
	let n = document.createElement(e);
	return n.classList.add(...Array.isArray(t) ? t : [t]), n;
}
function Cl(e) {
	let t = ll(), n = sl(), r = e.getBoundingClientRect(), i = n.body, a = e.clientTop || i.clientTop || 0, o = e.clientLeft || i.clientLeft || 0, s = e === t ? t.scrollY : e.scrollTop, c = e === t ? t.scrollX : e.scrollLeft;
	return {
		top: r.top + s - a,
		left: r.left + c - o
	};
}
function wl(e, t) {
	let n = [];
	for (; e.previousElementSibling;) {
		let r = e.previousElementSibling;
		t ? r.matches(t) && n.push(r) : n.push(r), e = r;
	}
	return n;
}
function Tl(e, t) {
	let n = [];
	for (; e.nextElementSibling;) {
		let r = e.nextElementSibling;
		t ? r.matches(t) && n.push(r) : n.push(r), e = r;
	}
	return n;
}
function El(e, t) {
	return ll().getComputedStyle(e, null).getPropertyValue(t);
}
function Dl(e) {
	let t = e, n;
	if (t) {
		for (n = 0; (t = t.previousSibling) !== null;) t.nodeType === 1 && (n += 1);
		return n;
	}
}
function Ol(e, t) {
	let n = [], r = e.parentElement;
	for (; r;) t ? r.matches(t) && n.push(r) : n.push(r), r = r.parentElement;
	return n;
}
function kl(e, t) {
	function n(r) {
		r.target === e && (t.call(e, r), e.removeEventListener("transitionend", n));
	}
	t && e.addEventListener("transitionend", n);
}
function Al(e, t, n) {
	let r = ll();
	return n ? e[t === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(r.getComputedStyle(e, null).getPropertyValue(t === "width" ? "margin-right" : "margin-top")) + parseFloat(r.getComputedStyle(e, null).getPropertyValue(t === "width" ? "margin-left" : "margin-bottom")) : e.offsetWidth;
}
//#endregion
//#region node_modules/swiper/shared/swiper-core.mjs
var jl;
function Ml() {
	let e = ll(), t = sl();
	return {
		smoothScroll: t.documentElement && t.documentElement.style && "scrollBehavior" in t.documentElement.style,
		touch: !!("ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch)
	};
}
function Nl() {
	return jl ||= Ml(), jl;
}
var Pl;
function Fl(e) {
	let { userAgent: t } = e === void 0 ? {} : e, n = Nl(), r = ll(), i = r.navigator.platform, a = t || r.navigator.userAgent, o = {
		ios: !1,
		android: !1
	}, s = r.screen.width, c = r.screen.height, l = a.match(/(Android);?[\s\/]+([\d.]+)?/), u = a.match(/(iPad).*OS\s([\d_]+)/), d = a.match(/(iPod)(.*OS\s([\d_]+))?/), f = !u && a.match(/(iPhone\sOS|iOS)\s([\d_]+)/), p = i === "Win32", m = i === "MacIntel";
	return !u && m && n.touch && [
		"1024x1366",
		"1366x1024",
		"834x1194",
		"1194x834",
		"834x1112",
		"1112x834",
		"768x1024",
		"1024x768",
		"820x1180",
		"1180x820",
		"810x1080",
		"1080x810"
	].indexOf(`${s}x${c}`) >= 0 && (u = a.match(/(Version)\/([\d.]+)/), u ||= [
		0,
		1,
		"13_0_0"
	], m = !1), l && !p && (o.os = "android", o.android = !0), (u || f || d) && (o.os = "ios", o.ios = !0), o;
}
function Il(e) {
	return e === void 0 && (e = {}), Pl ||= Fl(e), Pl;
}
var Ll;
function Rl() {
	let e = ll(), t = !1;
	function n() {
		let t = e.navigator.userAgent.toLowerCase();
		return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0;
	}
	if (n()) {
		let n = String(e.navigator.userAgent);
		if (n.includes("Version/")) {
			let [e, r] = n.split("Version/")[1].split(" ")[0].split(".").map((e) => Number(e));
			t = e < 16 || e === 16 && r < 2;
		}
	}
	return {
		isSafari: t || n(),
		needPerspectiveFix: t,
		isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent)
	};
}
function zl() {
	return Ll ||= Rl(), Ll;
}
function Bl(e) {
	let { swiper: t, on: n, emit: r } = e, i = ll(), a = null, o = null, s = () => {
		!t || t.destroyed || !t.initialized || (r("beforeResize"), r("resize"));
	}, c = () => {
		!t || t.destroyed || !t.initialized || (a = new ResizeObserver((e) => {
			o = i.requestAnimationFrame(() => {
				let { width: n, height: r } = t, i = n, a = r;
				e.forEach((e) => {
					let { contentBoxSize: n, contentRect: r, target: o } = e;
					o && o !== t.el || (i = r ? r.width : (n[0] || n).inlineSize, a = r ? r.height : (n[0] || n).blockSize);
				}), (i !== n || a !== r) && s();
			});
		}), a.observe(t.el));
	}, l = () => {
		o && i.cancelAnimationFrame(o), a && a.unobserve && t.el && (a.unobserve(t.el), a = null);
	}, u = () => {
		!t || t.destroyed || !t.initialized || r("orientationchange");
	};
	n("init", () => {
		if (t.params.resizeObserver && i.ResizeObserver !== void 0) {
			c();
			return;
		}
		i.addEventListener("resize", s), i.addEventListener("orientationchange", u);
	}), n("destroy", () => {
		l(), i.removeEventListener("resize", s), i.removeEventListener("orientationchange", u);
	});
}
function Vl(e) {
	let { swiper: t, extendParams: n, on: r, emit: i } = e, a = [], o = ll(), s = function(e, n) {
		n === void 0 && (n = {});
		let r = new (o.MutationObserver || o.WebkitMutationObserver)((e) => {
			if (t.__preventObserver__) return;
			if (e.length === 1) {
				i("observerUpdate", e[0]);
				return;
			}
			let n = function() {
				i("observerUpdate", e[0]);
			};
			o.requestAnimationFrame ? o.requestAnimationFrame(n) : o.setTimeout(n, 0);
		});
		r.observe(e, {
			attributes: n.attributes === void 0 ? !0 : n.attributes,
			childList: n.childList === void 0 ? !0 : n.childList,
			characterData: n.characterData === void 0 ? !0 : n.characterData
		}), a.push(r);
	};
	n({
		observer: !1,
		observeParents: !1,
		observeSlideChildren: !1
	}), r("init", () => {
		if (t.params.observer) {
			if (t.params.observeParents) {
				let e = Ol(t.hostEl);
				for (let t = 0; t < e.length; t += 1) s(e[t]);
			}
			s(t.hostEl, { childList: t.params.observeSlideChildren }), s(t.wrapperEl, { attributes: !1 });
		}
	}), r("destroy", () => {
		a.forEach((e) => {
			e.disconnect();
		}), a.splice(0, a.length);
	});
}
var Hl = {
	on(e, t, n) {
		let r = this;
		if (!r.eventsListeners || r.destroyed || typeof t != "function") return r;
		let i = n ? "unshift" : "push";
		return e.split(" ").forEach((e) => {
			r.eventsListeners[e] || (r.eventsListeners[e] = []), r.eventsListeners[e][i](t);
		}), r;
	},
	once(e, t, n) {
		let r = this;
		if (!r.eventsListeners || r.destroyed || typeof t != "function") return r;
		function i() {
			r.off(e, i), i.__emitterProxy && delete i.__emitterProxy;
			var n = [...arguments];
			t.apply(r, n);
		}
		return i.__emitterProxy = t, r.on(e, i, n);
	},
	onAny(e, t) {
		let n = this;
		if (!n.eventsListeners || n.destroyed || typeof e != "function") return n;
		let r = t ? "unshift" : "push";
		return n.eventsAnyListeners.indexOf(e) < 0 && n.eventsAnyListeners[r](e), n;
	},
	offAny(e) {
		let t = this;
		if (!t.eventsListeners || t.destroyed || !t.eventsAnyListeners) return t;
		let n = t.eventsAnyListeners.indexOf(e);
		return n >= 0 && t.eventsAnyListeners.splice(n, 1), t;
	},
	off(e, t) {
		let n = this;
		return !n.eventsListeners || n.destroyed || !n.eventsListeners || e.split(" ").forEach((e) => {
			t === void 0 ? n.eventsListeners[e] = [] : n.eventsListeners[e] && n.eventsListeners[e].forEach((r, i) => {
				(r === t || r.__emitterProxy && r.__emitterProxy === t) && n.eventsListeners[e].splice(i, 1);
			});
		}), n;
	},
	emit() {
		let e = this;
		if (!e.eventsListeners || e.destroyed || !e.eventsListeners) return e;
		let t, n, r;
		var i = [...arguments];
		return typeof i[0] == "string" || Array.isArray(i[0]) ? (t = i[0], n = i.slice(1, i.length), r = e) : (t = i[0].events, n = i[0].data, r = i[0].context || e), n.unshift(r), (Array.isArray(t) ? t : t.split(" ")).forEach((t) => {
			e.eventsAnyListeners && e.eventsAnyListeners.length && e.eventsAnyListeners.forEach((e) => {
				e.apply(r, [t, ...n]);
			}), e.eventsListeners && e.eventsListeners[t] && e.eventsListeners[t].forEach((e) => {
				e.apply(r, n);
			});
		}), e;
	}
};
function Ul() {
	let e = this, t, n, r = e.el;
	t = e.params.width !== void 0 && e.params.width !== null ? e.params.width : r.clientWidth, n = e.params.height !== void 0 && e.params.height !== null ? e.params.height : r.clientHeight, !(t === 0 && e.isHorizontal() || n === 0 && e.isVertical()) && (t = t - parseInt(El(r, "padding-left") || 0, 10) - parseInt(El(r, "padding-right") || 0, 10), n = n - parseInt(El(r, "padding-top") || 0, 10) - parseInt(El(r, "padding-bottom") || 0, 10), Number.isNaN(t) && (t = 0), Number.isNaN(n) && (n = 0), Object.assign(e, {
		width: t,
		height: n,
		size: e.isHorizontal() ? t : n
	}));
}
function Wl() {
	let e = this;
	function t(t) {
		return e.isHorizontal() ? t : {
			width: "height",
			"margin-top": "margin-left",
			"margin-bottom ": "margin-right",
			"margin-left": "margin-top",
			"margin-right": "margin-bottom",
			"padding-left": "padding-top",
			"padding-right": "padding-bottom",
			marginRight: "marginBottom"
		}[t];
	}
	function n(e, n) {
		return parseFloat(e.getPropertyValue(t(n)) || 0);
	}
	let r = e.params, { wrapperEl: i, slidesEl: a, size: o, rtlTranslate: s, wrongRTL: c } = e, l = e.virtual && r.virtual.enabled, u = l ? e.virtual.slides.length : e.slides.length, d = xl(a, `.${e.params.slideClass}, swiper-slide`), f = l ? e.virtual.slides.length : d.length, p = [], m = [], h = [], g = r.slidesOffsetBefore;
	typeof g == "function" && (g = r.slidesOffsetBefore.call(e));
	let _ = r.slidesOffsetAfter;
	typeof _ == "function" && (_ = r.slidesOffsetAfter.call(e));
	let v = e.snapGrid.length, y = e.slidesGrid.length, b = r.spaceBetween, x = -g, S = 0, C = 0;
	if (o === void 0) return;
	typeof b == "string" && b.indexOf("%") >= 0 ? b = parseFloat(b.replace("%", "")) / 100 * o : typeof b == "string" && (b = parseFloat(b)), e.virtualSize = -b, d.forEach((e) => {
		s ? e.style.marginLeft = "" : e.style.marginRight = "", e.style.marginBottom = "", e.style.marginTop = "";
	}), r.centeredSlides && r.cssMode && (vl(i, "--swiper-centered-offset-before", ""), vl(i, "--swiper-centered-offset-after", ""));
	let w = r.grid && r.grid.rows > 1 && e.grid;
	w && e.grid.initSlides(f);
	let T, E = r.slidesPerView === "auto" && r.breakpoints && Object.keys(r.breakpoints).filter((e) => r.breakpoints[e].slidesPerView !== void 0).length > 0;
	for (let i = 0; i < f; i += 1) {
		T = 0;
		let a;
		if (d[i] && (a = d[i]), w && e.grid.updateSlide(i, a, f, t), !(d[i] && El(a, "display") === "none")) {
			if (r.slidesPerView === "auto") {
				E && (d[i].style[t("width")] = "");
				let o = getComputedStyle(a), s = a.style.transform, c = a.style.webkitTransform;
				if (s && (a.style.transform = "none"), c && (a.style.webkitTransform = "none"), r.roundLengths) T = e.isHorizontal() ? Al(a, "width", !0) : Al(a, "height", !0);
				else {
					let e = n(o, "width"), t = n(o, "padding-left"), r = n(o, "padding-right"), i = n(o, "margin-left"), s = n(o, "margin-right"), c = o.getPropertyValue("box-sizing");
					if (c && c === "border-box") T = e + i + s;
					else {
						let { clientWidth: n, offsetWidth: o } = a;
						T = e + t + r + i + s + (o - n);
					}
				}
				s && (a.style.transform = s), c && (a.style.webkitTransform = c), r.roundLengths && (T = Math.floor(T));
			} else T = (o - (r.slidesPerView - 1) * b) / r.slidesPerView, r.roundLengths && (T = Math.floor(T)), d[i] && (d[i].style[t("width")] = `${T}px`);
			d[i] && (d[i].swiperSlideSize = T), h.push(T), r.centeredSlides ? (x = x + T / 2 + S / 2 + b, S === 0 && i !== 0 && (x = x - o / 2 - b), i === 0 && (x = x - o / 2 - b), Math.abs(x) < 1 / 1e3 && (x = 0), r.roundLengths && (x = Math.floor(x)), C % r.slidesPerGroup === 0 && p.push(x), m.push(x)) : (r.roundLengths && (x = Math.floor(x)), (C - Math.min(e.params.slidesPerGroupSkip, C)) % e.params.slidesPerGroup === 0 && p.push(x), m.push(x), x = x + T + b), e.virtualSize += T + b, S = T, C += 1;
		}
	}
	if (e.virtualSize = Math.max(e.virtualSize, o) + _, s && c && (r.effect === "slide" || r.effect === "coverflow") && (i.style.width = `${e.virtualSize + b}px`), r.setWrapperSize && (i.style[t("width")] = `${e.virtualSize + b}px`), w && e.grid.updateWrapperSize(T, p, t), !r.centeredSlides) {
		let t = [];
		for (let n = 0; n < p.length; n += 1) {
			let i = p[n];
			r.roundLengths && (i = Math.floor(i)), p[n] <= e.virtualSize - o && t.push(i);
		}
		p = t, Math.floor(e.virtualSize - o) - Math.floor(p[p.length - 1]) > 1 && p.push(e.virtualSize - o);
	}
	if (l && r.loop) {
		let t = h[0] + b;
		if (r.slidesPerGroup > 1) {
			let n = Math.ceil((e.virtual.slidesBefore + e.virtual.slidesAfter) / r.slidesPerGroup), i = t * r.slidesPerGroup;
			for (let e = 0; e < n; e += 1) p.push(p[p.length - 1] + i);
		}
		for (let n = 0; n < e.virtual.slidesBefore + e.virtual.slidesAfter; n += 1) r.slidesPerGroup === 1 && p.push(p[p.length - 1] + t), m.push(m[m.length - 1] + t), e.virtualSize += t;
	}
	if (p.length === 0 && (p = [0]), b !== 0) {
		let n = e.isHorizontal() && s ? "marginLeft" : t("marginRight");
		d.filter((e, t) => !r.cssMode || r.loop ? !0 : t !== d.length - 1).forEach((e) => {
			e.style[n] = `${b}px`;
		});
	}
	if (r.centeredSlides && r.centeredSlidesBounds) {
		let e = 0;
		h.forEach((t) => {
			e += t + (b || 0);
		}), e -= b;
		let t = e - o;
		p = p.map((e) => e <= 0 ? -g : e > t ? t + _ : e);
	}
	if (r.centerInsufficientSlides) {
		let e = 0;
		if (h.forEach((t) => {
			e += t + (b || 0);
		}), e -= b, e < o) {
			let t = (o - e) / 2;
			p.forEach((e, n) => {
				p[n] = e - t;
			}), m.forEach((e, n) => {
				m[n] = e + t;
			});
		}
	}
	if (Object.assign(e, {
		slides: d,
		snapGrid: p,
		slidesGrid: m,
		slidesSizesGrid: h
	}), r.centeredSlides && r.cssMode && !r.centeredSlidesBounds) {
		vl(i, "--swiper-centered-offset-before", `${-p[0]}px`), vl(i, "--swiper-centered-offset-after", `${e.size / 2 - h[h.length - 1] / 2}px`);
		let t = -e.snapGrid[0], n = -e.slidesGrid[0];
		e.snapGrid = e.snapGrid.map((e) => e + t), e.slidesGrid = e.slidesGrid.map((e) => e + n);
	}
	if (f !== u && e.emit("slidesLengthChange"), p.length !== v && (e.params.watchOverflow && e.checkOverflow(), e.emit("snapGridLengthChange")), m.length !== y && e.emit("slidesGridLengthChange"), r.watchSlidesProgress && e.updateSlidesOffset(), !l && !r.cssMode && (r.effect === "slide" || r.effect === "fade")) {
		let t = `${r.containerModifierClass}backface-hidden`, n = e.el.classList.contains(t);
		f <= r.maxBackfaceHiddenSlides ? n || e.el.classList.add(t) : n && e.el.classList.remove(t);
	}
}
function Gl(e) {
	let t = this, n = [], r = t.virtual && t.params.virtual.enabled, i = 0, a;
	typeof e == "number" ? t.setTransition(e) : e === !0 && t.setTransition(t.params.speed);
	let o = (e) => r ? t.slides[t.getSlideIndexByData(e)] : t.slides[e];
	if (t.params.slidesPerView !== "auto" && t.params.slidesPerView > 1) if (t.params.centeredSlides) (t.visibleSlides || []).forEach((e) => {
		n.push(e);
	});
	else for (a = 0; a < Math.ceil(t.params.slidesPerView); a += 1) {
		let e = t.activeIndex + a;
		if (e > t.slides.length && !r) break;
		n.push(o(e));
	}
	else n.push(o(t.activeIndex));
	for (a = 0; a < n.length; a += 1) if (n[a] !== void 0) {
		let e = n[a].offsetHeight;
		i = e > i ? e : i;
	}
	(i || i === 0) && (t.wrapperEl.style.height = `${i}px`);
}
function Kl() {
	let e = this, t = e.slides, n = e.isElement ? e.isHorizontal() ? e.wrapperEl.offsetLeft : e.wrapperEl.offsetTop : 0;
	for (let r = 0; r < t.length; r += 1) t[r].swiperSlideOffset = (e.isHorizontal() ? t[r].offsetLeft : t[r].offsetTop) - n - e.cssOverflowAdjustment();
}
function ql(e) {
	e === void 0 && (e = this && this.translate || 0);
	let t = this, n = t.params, { slides: r, rtlTranslate: i, snapGrid: a } = t;
	if (r.length === 0) return;
	r[0].swiperSlideOffset === void 0 && t.updateSlidesOffset();
	let o = -e;
	i && (o = e), r.forEach((e) => {
		e.classList.remove(n.slideVisibleClass);
	}), t.visibleSlidesIndexes = [], t.visibleSlides = [];
	let s = n.spaceBetween;
	typeof s == "string" && s.indexOf("%") >= 0 ? s = parseFloat(s.replace("%", "")) / 100 * t.size : typeof s == "string" && (s = parseFloat(s));
	for (let e = 0; e < r.length; e += 1) {
		let c = r[e], l = c.swiperSlideOffset;
		n.cssMode && n.centeredSlides && (l -= r[0].swiperSlideOffset);
		let u = (o + (n.centeredSlides ? t.minTranslate() : 0) - l) / (c.swiperSlideSize + s), d = (o - a[0] + (n.centeredSlides ? t.minTranslate() : 0) - l) / (c.swiperSlideSize + s), f = -(o - l), p = f + t.slidesSizesGrid[e];
		(f >= 0 && f < t.size - 1 || p > 1 && p <= t.size || f <= 0 && p >= t.size) && (t.visibleSlides.push(c), t.visibleSlidesIndexes.push(e), r[e].classList.add(n.slideVisibleClass)), c.progress = i ? -u : u, c.originalProgress = i ? -d : d;
	}
}
function Jl(e) {
	let t = this;
	if (e === void 0) {
		let n = t.rtlTranslate ? -1 : 1;
		e = t && t.translate && t.translate * n || 0;
	}
	let n = t.params, r = t.maxTranslate() - t.minTranslate(), { progress: i, isBeginning: a, isEnd: o, progressLoop: s } = t, c = a, l = o;
	if (r === 0) i = 0, a = !0, o = !0;
	else {
		i = (e - t.minTranslate()) / r;
		let n = Math.abs(e - t.minTranslate()) < 1, s = Math.abs(e - t.maxTranslate()) < 1;
		a = n || i <= 0, o = s || i >= 1, n && (i = 0), s && (i = 1);
	}
	if (n.loop) {
		let n = t.getSlideIndexByData(0), r = t.getSlideIndexByData(t.slides.length - 1), i = t.slidesGrid[n], a = t.slidesGrid[r], o = t.slidesGrid[t.slidesGrid.length - 1], c = Math.abs(e);
		s = c >= i ? (c - i) / o : (c + o - a) / o, s > 1 && --s;
	}
	Object.assign(t, {
		progress: i,
		progressLoop: s,
		isBeginning: a,
		isEnd: o
	}), (n.watchSlidesProgress || n.centeredSlides && n.autoHeight) && t.updateSlidesProgress(e), a && !c && t.emit("reachBeginning toEdge"), o && !l && t.emit("reachEnd toEdge"), (c && !a || l && !o) && t.emit("fromEdge"), t.emit("progress", i);
}
function Yl() {
	let e = this, { slides: t, params: n, slidesEl: r, activeIndex: i } = e, a = e.virtual && n.virtual.enabled, o = (e) => xl(r, `.${n.slideClass}${e}, swiper-slide${e}`)[0];
	t.forEach((e) => {
		e.classList.remove(n.slideActiveClass, n.slideNextClass, n.slidePrevClass);
	});
	let s;
	if (a) if (n.loop) {
		let t = i - e.virtual.slidesBefore;
		t < 0 && (t = e.virtual.slides.length + t), t >= e.virtual.slides.length && (t -= e.virtual.slides.length), s = o(`[data-swiper-slide-index="${t}"]`);
	} else s = o(`[data-swiper-slide-index="${i}"]`);
	else s = t[i];
	if (s) {
		s.classList.add(n.slideActiveClass);
		let e = Tl(s, `.${n.slideClass}, swiper-slide`)[0];
		n.loop && !e && (e = t[0]), e && e.classList.add(n.slideNextClass);
		let r = wl(s, `.${n.slideClass}, swiper-slide`)[0];
		n.loop, r && r.classList.add(n.slidePrevClass);
	}
	e.emitSlidesClasses();
}
var Xl = (e, t) => {
	if (!e || e.destroyed || !e.params) return;
	let n = t.closest(e.isElement ? "swiper-slide" : `.${e.params.slideClass}`);
	if (n) {
		let t = n.querySelector(`.${e.params.lazyPreloaderClass}`);
		!t && e.isElement && (n.shadowRoot ? t = n.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`) : requestAnimationFrame(() => {
			n.shadowRoot && (t = n.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`), t && t.remove());
		})), t && t.remove();
	}
}, Zl = (e, t) => {
	if (!e.slides[t]) return;
	let n = e.slides[t].querySelector("[loading=\"lazy\"]");
	n && n.removeAttribute("loading");
}, Ql = (e) => {
	if (!e || e.destroyed || !e.params) return;
	let t = e.params.lazyPreloadPrevNext, n = e.slides.length;
	if (!n || !t || t < 0) return;
	t = Math.min(t, n);
	let r = e.params.slidesPerView === "auto" ? e.slidesPerViewDynamic() : Math.ceil(e.params.slidesPerView), i = e.activeIndex;
	if (e.params.grid && e.params.grid.rows > 1) {
		let n = i, a = [n - t];
		a.push(...Array.from({ length: t }).map((e, t) => n + r + t)), e.slides.forEach((t, n) => {
			a.includes(t.column) && Zl(e, n);
		});
		return;
	}
	let a = i + r - 1;
	if (e.params.rewind || e.params.loop) for (let r = i - t; r <= a + t; r += 1) {
		let t = (r % n + n) % n;
		(t < i || t > a) && Zl(e, t);
	}
	else for (let r = Math.max(i - t, 0); r <= Math.min(a + t, n - 1); r += 1) r !== i && (r > a || r < i) && Zl(e, r);
};
function $l(e) {
	let { slidesGrid: t, params: n } = e, r = e.rtlTranslate ? e.translate : -e.translate, i;
	for (let e = 0; e < t.length; e += 1) t[e + 1] === void 0 ? r >= t[e] && (i = e) : r >= t[e] && r < t[e + 1] - (t[e + 1] - t[e]) / 2 ? i = e : r >= t[e] && r < t[e + 1] && (i = e + 1);
	return n.normalizeSlideIndex && (i < 0 || i === void 0) && (i = 0), i;
}
function eu(e) {
	let t = this, n = t.rtlTranslate ? t.translate : -t.translate, { snapGrid: r, params: i, activeIndex: a, realIndex: o, snapIndex: s } = t, c = e, l, u = (e) => {
		let n = e - t.virtual.slidesBefore;
		return n < 0 && (n = t.virtual.slides.length + n), n >= t.virtual.slides.length && (n -= t.virtual.slides.length), n;
	};
	if (c === void 0 && (c = $l(t)), r.indexOf(n) >= 0) l = r.indexOf(n);
	else {
		let e = Math.min(i.slidesPerGroupSkip, c);
		l = e + Math.floor((c - e) / i.slidesPerGroup);
	}
	if (l >= r.length && (l = r.length - 1), c === a) {
		l !== s && (t.snapIndex = l, t.emit("snapIndexChange")), t.params.loop && t.virtual && t.params.virtual.enabled && (t.realIndex = u(c));
		return;
	}
	let d;
	d = t.virtual && i.virtual.enabled && i.loop ? u(c) : t.slides[c] ? parseInt(t.slides[c].getAttribute("data-swiper-slide-index") || c, 10) : c, Object.assign(t, {
		previousSnapIndex: s,
		snapIndex: l,
		previousRealIndex: o,
		realIndex: d,
		previousIndex: a,
		activeIndex: c
	}), t.initialized && Ql(t), t.emit("activeIndexChange"), t.emit("snapIndexChange"), (t.initialized || t.params.runCallbacksOnInit) && (o !== d && t.emit("realIndexChange"), t.emit("slideChange"));
}
function tu(e, t) {
	let n = this, r = n.params, i = e.closest(`.${r.slideClass}, swiper-slide`);
	!i && n.isElement && t && t.length > 1 && t.includes(e) && [...t.slice(t.indexOf(e) + 1, t.length)].forEach((e) => {
		!i && e.matches && e.matches(`.${r.slideClass}, swiper-slide`) && (i = e);
	});
	let a = !1, o;
	if (i) {
		for (let e = 0; e < n.slides.length; e += 1) if (n.slides[e] === i) {
			a = !0, o = e;
			break;
		}
	}
	if (i && a) n.clickedSlide = i, n.virtual && n.params.virtual.enabled ? n.clickedIndex = parseInt(i.getAttribute("data-swiper-slide-index"), 10) : n.clickedIndex = o;
	else {
		n.clickedSlide = void 0, n.clickedIndex = void 0;
		return;
	}
	r.slideToClickedSlide && n.clickedIndex !== void 0 && n.clickedIndex !== n.activeIndex && n.slideToClickedSlide();
}
var nu = {
	updateSize: Ul,
	updateSlides: Wl,
	updateAutoHeight: Gl,
	updateSlidesOffset: Kl,
	updateSlidesProgress: ql,
	updateProgress: Jl,
	updateSlidesClasses: Yl,
	updateActiveIndex: eu,
	updateClickedSlide: tu
};
function ru(e) {
	e === void 0 && (e = this.isHorizontal() ? "x" : "y");
	let t = this, { params: n, rtlTranslate: r, translate: i, wrapperEl: a } = t;
	if (n.virtualTranslate) return r ? -i : i;
	if (n.cssMode) return i;
	let o = ml(a, e);
	return o += t.cssOverflowAdjustment(), r && (o = -o), o || 0;
}
function iu(e, t) {
	let n = this, { rtlTranslate: r, params: i, wrapperEl: a, progress: o } = n, s = 0, c = 0;
	n.isHorizontal() ? s = r ? -e : e : c = e, i.roundLengths && (s = Math.floor(s), c = Math.floor(c)), n.previousTranslate = n.translate, n.translate = n.isHorizontal() ? s : c, i.cssMode ? a[n.isHorizontal() ? "scrollLeft" : "scrollTop"] = n.isHorizontal() ? -s : -c : i.virtualTranslate || (n.isHorizontal() ? s -= n.cssOverflowAdjustment() : c -= n.cssOverflowAdjustment(), a.style.transform = `translate3d(${s}px, ${c}px, 0px)`);
	let l, u = n.maxTranslate() - n.minTranslate();
	l = u === 0 ? 0 : (e - n.minTranslate()) / u, l !== o && n.updateProgress(e), n.emit("setTranslate", n.translate, t);
}
function au() {
	return -this.snapGrid[0];
}
function ou() {
	return -this.snapGrid[this.snapGrid.length - 1];
}
function su(e, t, n, r, i) {
	e === void 0 && (e = 0), t === void 0 && (t = this.params.speed), n === void 0 && (n = !0), r === void 0 && (r = !0);
	let a = this, { params: o, wrapperEl: s } = a;
	if (a.animating && o.preventInteractionOnTransition) return !1;
	let c = a.minTranslate(), l = a.maxTranslate(), u;
	if (u = r && e > c ? c : r && e < l ? l : e, a.updateProgress(u), o.cssMode) {
		let e = a.isHorizontal();
		if (t === 0) s[e ? "scrollLeft" : "scrollTop"] = -u;
		else {
			if (!a.support.smoothScroll) return yl({
				swiper: a,
				targetPosition: -u,
				side: e ? "left" : "top"
			}), !0;
			s.scrollTo({
				[e ? "left" : "top"]: -u,
				behavior: "smooth"
			});
		}
		return !0;
	}
	return t === 0 ? (a.setTransition(0), a.setTranslate(u), n && (a.emit("beforeTransitionStart", t, i), a.emit("transitionEnd"))) : (a.setTransition(t), a.setTranslate(u), n && (a.emit("beforeTransitionStart", t, i), a.emit("transitionStart")), a.animating || (a.animating = !0, a.onTranslateToWrapperTransitionEnd ||= function(e) {
		!a || a.destroyed || e.target === this && (a.wrapperEl.removeEventListener("transitionend", a.onTranslateToWrapperTransitionEnd), a.onTranslateToWrapperTransitionEnd = null, delete a.onTranslateToWrapperTransitionEnd, n && a.emit("transitionEnd"));
	}, a.wrapperEl.addEventListener("transitionend", a.onTranslateToWrapperTransitionEnd))), !0;
}
var cu = {
	getTranslate: ru,
	setTranslate: iu,
	minTranslate: au,
	maxTranslate: ou,
	translateTo: su
};
function lu(e, t) {
	let n = this;
	n.params.cssMode || (n.wrapperEl.style.transitionDuration = `${e}ms`, n.wrapperEl.style.transitionDelay = e === 0 ? "0ms" : ""), n.emit("setTransition", e, t);
}
function uu(e) {
	let { swiper: t, runCallbacks: n, direction: r, step: i } = e, { activeIndex: a, previousIndex: o } = t, s = r;
	if (s ||= a > o ? "next" : a < o ? "prev" : "reset", t.emit(`transition${i}`), n && a !== o) {
		if (s === "reset") {
			t.emit(`slideResetTransition${i}`);
			return;
		}
		t.emit(`slideChangeTransition${i}`), s === "next" ? t.emit(`slideNextTransition${i}`) : t.emit(`slidePrevTransition${i}`);
	}
}
function du(e, t) {
	e === void 0 && (e = !0);
	let n = this, { params: r } = n;
	r.cssMode || (r.autoHeight && n.updateAutoHeight(), uu({
		swiper: n,
		runCallbacks: e,
		direction: t,
		step: "Start"
	}));
}
function fu(e, t) {
	e === void 0 && (e = !0);
	let n = this, { params: r } = n;
	n.animating = !1, !r.cssMode && (n.setTransition(0), uu({
		swiper: n,
		runCallbacks: e,
		direction: t,
		step: "End"
	}));
}
var pu = {
	setTransition: lu,
	transitionStart: du,
	transitionEnd: fu
};
function mu(e, t, n, r, i) {
	e === void 0 && (e = 0), t === void 0 && (t = this.params.speed), n === void 0 && (n = !0), typeof e == "string" && (e = parseInt(e, 10));
	let a = this, o = e;
	o < 0 && (o = 0);
	let { params: s, snapGrid: c, slidesGrid: l, previousIndex: u, activeIndex: d, rtlTranslate: f, wrapperEl: p, enabled: m } = a;
	if (a.animating && s.preventInteractionOnTransition || !m && !r && !i) return !1;
	let h = Math.min(a.params.slidesPerGroupSkip, o), g = h + Math.floor((o - h) / a.params.slidesPerGroup);
	g >= c.length && (g = c.length - 1);
	let _ = -c[g];
	if (s.normalizeSlideIndex) for (let e = 0; e < l.length; e += 1) {
		let t = -Math.floor(_ * 100), n = Math.floor(l[e] * 100), r = Math.floor(l[e + 1] * 100);
		l[e + 1] === void 0 ? t >= n && (o = e) : t >= n && t < r - (r - n) / 2 ? o = e : t >= n && t < r && (o = e + 1);
	}
	if (a.initialized && o !== d && (!a.allowSlideNext && (f ? _ > a.translate && _ > a.minTranslate() : _ < a.translate && _ < a.minTranslate()) || !a.allowSlidePrev && _ > a.translate && _ > a.maxTranslate() && (d || 0) !== o)) return !1;
	o !== (u || 0) && n && a.emit("beforeSlideChangeStart"), a.updateProgress(_);
	let v;
	if (v = o > d ? "next" : o < d ? "prev" : "reset", f && -_ === a.translate || !f && _ === a.translate) return a.updateActiveIndex(o), s.autoHeight && a.updateAutoHeight(), a.updateSlidesClasses(), s.effect !== "slide" && a.setTranslate(_), v !== "reset" && (a.transitionStart(n, v), a.transitionEnd(n, v)), !1;
	if (s.cssMode) {
		let e = a.isHorizontal(), n = f ? _ : -_;
		if (t === 0) {
			let t = a.virtual && a.params.virtual.enabled;
			t && (a.wrapperEl.style.scrollSnapType = "none", a._immediateVirtual = !0), t && !a._cssModeVirtualInitialSet && a.params.initialSlide > 0 ? (a._cssModeVirtualInitialSet = !0, requestAnimationFrame(() => {
				p[e ? "scrollLeft" : "scrollTop"] = n;
			})) : p[e ? "scrollLeft" : "scrollTop"] = n, t && requestAnimationFrame(() => {
				a.wrapperEl.style.scrollSnapType = "", a._immediateVirtual = !1;
			});
		} else {
			if (!a.support.smoothScroll) return yl({
				swiper: a,
				targetPosition: n,
				side: e ? "left" : "top"
			}), !0;
			p.scrollTo({
				[e ? "left" : "top"]: n,
				behavior: "smooth"
			});
		}
		return !0;
	}
	return a.setTransition(t), a.setTranslate(_), a.updateActiveIndex(o), a.updateSlidesClasses(), a.emit("beforeTransitionStart", t, r), a.transitionStart(n, v), t === 0 ? a.transitionEnd(n, v) : a.animating || (a.animating = !0, a.onSlideToWrapperTransitionEnd ||= function(e) {
		!a || a.destroyed || e.target === this && (a.wrapperEl.removeEventListener("transitionend", a.onSlideToWrapperTransitionEnd), a.onSlideToWrapperTransitionEnd = null, delete a.onSlideToWrapperTransitionEnd, a.transitionEnd(n, v));
	}, a.wrapperEl.addEventListener("transitionend", a.onSlideToWrapperTransitionEnd)), !0;
}
function hu(e, t, n, r) {
	e === void 0 && (e = 0), t === void 0 && (t = this.params.speed), n === void 0 && (n = !0), typeof e == "string" && (e = parseInt(e, 10));
	let i = this, a = e;
	return i.params.loop && (i.virtual && i.params.virtual.enabled ? a += i.virtual.slidesBefore : a = i.getSlideIndexByData(a)), i.slideTo(a, t, n, r);
}
function gu(e, t, n) {
	e === void 0 && (e = this.params.speed), t === void 0 && (t = !0);
	let r = this, { enabled: i, params: a, animating: o } = r;
	if (!i) return r;
	let s = a.slidesPerGroup;
	a.slidesPerView === "auto" && a.slidesPerGroup === 1 && a.slidesPerGroupAuto && (s = Math.max(r.slidesPerViewDynamic("current", !0), 1));
	let c = r.activeIndex < a.slidesPerGroupSkip ? 1 : s, l = r.virtual && a.virtual.enabled;
	if (a.loop) {
		if (o && !l && a.loopPreventsSliding) return !1;
		if (r.loopFix({ direction: "next" }), r._clientLeft = r.wrapperEl.clientLeft, r.activeIndex === r.slides.length - 1 && a.cssMode) return requestAnimationFrame(() => {
			r.slideTo(r.activeIndex + c, e, t, n);
		}), !0;
	}
	return a.rewind && r.isEnd ? r.slideTo(0, e, t, n) : r.slideTo(r.activeIndex + c, e, t, n);
}
function _u(e, t, n) {
	e === void 0 && (e = this.params.speed), t === void 0 && (t = !0);
	let r = this, { params: i, snapGrid: a, slidesGrid: o, rtlTranslate: s, enabled: c, animating: l } = r;
	if (!c) return r;
	let u = r.virtual && i.virtual.enabled;
	if (i.loop) {
		if (l && !u && i.loopPreventsSliding) return !1;
		r.loopFix({ direction: "prev" }), r._clientLeft = r.wrapperEl.clientLeft;
	}
	let d = s ? r.translate : -r.translate;
	function f(e) {
		return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
	}
	let p = f(d), m = a[a.map((e) => f(e)).indexOf(p) - 1];
	if (m === void 0 && i.cssMode) {
		let e;
		a.forEach((t, n) => {
			p >= t && (e = n);
		}), e !== void 0 && (m = a[e > 0 ? e - 1 : e]);
	}
	let h = 0;
	if (m !== void 0 && (h = o.indexOf(m), h < 0 && (h = r.activeIndex - 1), i.slidesPerView === "auto" && i.slidesPerGroup === 1 && i.slidesPerGroupAuto && (h = h - r.slidesPerViewDynamic("previous", !0) + 1, h = Math.max(h, 0))), i.rewind && r.isBeginning) {
		let i = r.params.virtual && r.params.virtual.enabled && r.virtual ? r.virtual.slides.length - 1 : r.slides.length - 1;
		return r.slideTo(i, e, t, n);
	} else if (i.loop && r.activeIndex === 0 && i.cssMode) return requestAnimationFrame(() => {
		r.slideTo(h, e, t, n);
	}), !0;
	return r.slideTo(h, e, t, n);
}
function vu(e, t, n) {
	e === void 0 && (e = this.params.speed), t === void 0 && (t = !0);
	let r = this;
	return r.slideTo(r.activeIndex, e, t, n);
}
function yu(e, t, n, r) {
	e === void 0 && (e = this.params.speed), t === void 0 && (t = !0), r === void 0 && (r = .5);
	let i = this, a = i.activeIndex, o = Math.min(i.params.slidesPerGroupSkip, a), s = o + Math.floor((a - o) / i.params.slidesPerGroup), c = i.rtlTranslate ? i.translate : -i.translate;
	if (c >= i.snapGrid[s]) {
		let e = i.snapGrid[s], t = i.snapGrid[s + 1];
		c - e > (t - e) * r && (a += i.params.slidesPerGroup);
	} else {
		let e = i.snapGrid[s - 1], t = i.snapGrid[s];
		c - e <= (t - e) * r && (a -= i.params.slidesPerGroup);
	}
	return a = Math.max(a, 0), a = Math.min(a, i.slidesGrid.length - 1), i.slideTo(a, e, t, n);
}
function bu() {
	let e = this, { params: t, slidesEl: n } = e, r = t.slidesPerView === "auto" ? e.slidesPerViewDynamic() : t.slidesPerView, i = e.clickedIndex, a, o = e.isElement ? "swiper-slide" : `.${t.slideClass}`;
	if (t.loop) {
		if (e.animating) return;
		a = parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"), 10), t.centeredSlides ? i < e.loopedSlides - r / 2 || i > e.slides.length - e.loopedSlides + r / 2 ? (e.loopFix(), i = e.getSlideIndex(xl(n, `${o}[data-swiper-slide-index="${a}"]`)[0]), dl(() => {
			e.slideTo(i);
		})) : e.slideTo(i) : i > e.slides.length - r ? (e.loopFix(), i = e.getSlideIndex(xl(n, `${o}[data-swiper-slide-index="${a}"]`)[0]), dl(() => {
			e.slideTo(i);
		})) : e.slideTo(i);
	} else e.slideTo(i);
}
var xu = {
	slideTo: mu,
	slideToLoop: hu,
	slideNext: gu,
	slidePrev: _u,
	slideReset: vu,
	slideToClosest: yu,
	slideToClickedSlide: bu
};
function Su(e) {
	let t = this, { params: n, slidesEl: r } = t;
	!n.loop || t.virtual && t.params.virtual.enabled || (xl(r, `.${n.slideClass}, swiper-slide`).forEach((e, t) => {
		e.setAttribute("data-swiper-slide-index", t);
	}), t.loopFix({
		slideRealIndex: e,
		direction: n.centeredSlides ? void 0 : "next"
	}));
}
function Cu(e) {
	let { slideRealIndex: t, slideTo: n = !0, direction: r, setTranslate: i, activeSlideIndex: a, byController: o, byMousewheel: s } = e === void 0 ? {} : e, c = this;
	if (!c.params.loop) return;
	c.emit("beforeLoopFix");
	let { slides: l, allowSlidePrev: u, allowSlideNext: d, slidesEl: f, params: p } = c;
	if (c.allowSlidePrev = !0, c.allowSlideNext = !0, c.virtual && p.virtual.enabled) {
		n && (!p.centeredSlides && c.snapIndex === 0 ? c.slideTo(c.virtual.slides.length, 0, !1, !0) : p.centeredSlides && c.snapIndex < p.slidesPerView ? c.slideTo(c.virtual.slides.length + c.snapIndex, 0, !1, !0) : c.snapIndex === c.snapGrid.length - 1 && c.slideTo(c.virtual.slidesBefore, 0, !1, !0)), c.allowSlidePrev = u, c.allowSlideNext = d, c.emit("loopFix");
		return;
	}
	let m = p.slidesPerView === "auto" ? c.slidesPerViewDynamic() : Math.ceil(parseFloat(p.slidesPerView, 10)), h = p.loopedSlides || m;
	h % p.slidesPerGroup !== 0 && (h += p.slidesPerGroup - h % p.slidesPerGroup), c.loopedSlides = h;
	let g = [], _ = [], v = c.activeIndex;
	a === void 0 ? a = c.getSlideIndex(c.slides.filter((e) => e.classList.contains(p.slideActiveClass))[0]) : v = a;
	let y = r === "next" || !r, b = r === "prev" || !r, x = 0, S = 0;
	if (a < h) {
		x = Math.max(h - a, p.slidesPerGroup);
		for (let e = 0; e < h - a; e += 1) {
			let t = e - Math.floor(e / l.length) * l.length;
			g.push(l.length - t - 1);
		}
	} else if (a > c.slides.length - h * 2) {
		S = Math.max(a - (c.slides.length - h * 2), p.slidesPerGroup);
		for (let e = 0; e < S; e += 1) {
			let t = e - Math.floor(e / l.length) * l.length;
			_.push(t);
		}
	}
	if (b && g.forEach((e) => {
		c.slides[e].swiperLoopMoveDOM = !0, f.prepend(c.slides[e]), c.slides[e].swiperLoopMoveDOM = !1;
	}), y && _.forEach((e) => {
		c.slides[e].swiperLoopMoveDOM = !0, f.append(c.slides[e]), c.slides[e].swiperLoopMoveDOM = !1;
	}), c.recalcSlides(), p.slidesPerView === "auto" && c.updateSlides(), p.watchSlidesProgress && c.updateSlidesOffset(), n) {
		if (g.length > 0 && b) if (t === void 0) {
			let e = c.slidesGrid[v], t = c.slidesGrid[v + x] - e;
			s ? c.setTranslate(c.translate - t) : (c.slideTo(v + x, 0, !1, !0), i && (c.touches[c.isHorizontal() ? "startX" : "startY"] += t, c.touchEventsData.currentTranslate = c.translate));
		} else i && (c.slideToLoop(t, 0, !1, !0), c.touchEventsData.currentTranslate = c.translate);
		else if (_.length > 0 && y) if (t === void 0) {
			let e = c.slidesGrid[v], t = c.slidesGrid[v - S] - e;
			s ? c.setTranslate(c.translate - t) : (c.slideTo(v - S, 0, !1, !0), i && (c.touches[c.isHorizontal() ? "startX" : "startY"] += t, c.touchEventsData.currentTranslate = c.translate));
		} else c.slideToLoop(t, 0, !1, !0);
	}
	if (c.allowSlidePrev = u, c.allowSlideNext = d, c.controller && c.controller.control && !o) {
		let e = {
			slideRealIndex: t,
			direction: r,
			setTranslate: i,
			activeSlideIndex: a,
			byController: !0
		};
		Array.isArray(c.controller.control) ? c.controller.control.forEach((t) => {
			!t.destroyed && t.params.loop && t.loopFix({
				...e,
				slideTo: t.params.slidesPerView === p.slidesPerView ? n : !1
			});
		}) : c.controller.control instanceof c.constructor && c.controller.control.params.loop && c.controller.control.loopFix({
			...e,
			slideTo: c.controller.control.params.slidesPerView === p.slidesPerView ? n : !1
		});
	}
	c.emit("loopFix");
}
function wu() {
	let e = this, { params: t, slidesEl: n } = e;
	if (!t.loop || e.virtual && e.params.virtual.enabled) return;
	e.recalcSlides();
	let r = [];
	e.slides.forEach((e) => {
		let t = e.swiperSlideIndex === void 0 ? e.getAttribute("data-swiper-slide-index") * 1 : e.swiperSlideIndex;
		r[t] = e;
	}), e.slides.forEach((e) => {
		e.removeAttribute("data-swiper-slide-index");
	}), r.forEach((e) => {
		n.append(e);
	}), e.recalcSlides(), e.slideTo(e.realIndex, 0);
}
var Tu = {
	loopCreate: Su,
	loopFix: Cu,
	loopDestroy: wu
};
function Eu(e) {
	let t = this;
	if (!t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode) return;
	let n = t.params.touchEventsTarget === "container" ? t.el : t.wrapperEl;
	t.isElement && (t.__preventObserver__ = !0), n.style.cursor = "move", n.style.cursor = e ? "grabbing" : "grab", t.isElement && requestAnimationFrame(() => {
		t.__preventObserver__ = !1;
	});
}
function Du() {
	let e = this;
	e.params.watchOverflow && e.isLocked || e.params.cssMode || (e.isElement && (e.__preventObserver__ = !0), e[e.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "", e.isElement && requestAnimationFrame(() => {
		e.__preventObserver__ = !1;
	}));
}
var Ou = {
	setGrabCursor: Eu,
	unsetGrabCursor: Du
};
function ku(e, t) {
	t === void 0 && (t = this);
	function n(t) {
		if (!t || t === sl() || t === ll()) return null;
		t.assignedSlot && (t = t.assignedSlot);
		let r = t.closest(e);
		return !r && !t.getRootNode ? null : r || n(t.getRootNode().host);
	}
	return n(t);
}
function Au(e) {
	let t = this, n = sl(), r = ll(), i = t.touchEventsData;
	i.evCache.push(e);
	let { params: a, touches: o, enabled: s } = t;
	if (!s || !a.simulateTouch && e.pointerType === "mouse" || t.animating && a.preventInteractionOnTransition) return;
	!t.animating && a.cssMode && a.loop && t.loopFix();
	let c = e;
	c.originalEvent && (c = c.originalEvent);
	let l = c.target;
	if (a.touchEventsTarget === "wrapper" && !t.wrapperEl.contains(l) || "which" in c && c.which === 3 || "button" in c && c.button > 0 || i.isTouched && i.isMoved) return;
	let u = !!a.noSwipingClass && a.noSwipingClass !== "", d = e.composedPath ? e.composedPath() : e.path;
	u && c.target && c.target.shadowRoot && d && (l = d[0]);
	let f = a.noSwipingSelector ? a.noSwipingSelector : `.${a.noSwipingClass}`, p = !!(c.target && c.target.shadowRoot);
	if (a.noSwiping && (p ? ku(f, l) : l.closest(f))) {
		t.allowClick = !0;
		return;
	}
	if (a.swipeHandler && !l.closest(a.swipeHandler)) return;
	o.currentX = c.pageX, o.currentY = c.pageY;
	let m = o.currentX, h = o.currentY, g = a.edgeSwipeDetection || a.iOSEdgeSwipeDetection, _ = a.edgeSwipeThreshold || a.iOSEdgeSwipeThreshold;
	if (g && (m <= _ || m >= r.innerWidth - _)) if (g === "prevent") e.preventDefault();
	else return;
	Object.assign(i, {
		isTouched: !0,
		isMoved: !1,
		allowTouchCallbacks: !0,
		isScrolling: void 0,
		startMoving: void 0
	}), o.startX = m, o.startY = h, i.touchStartTime = fl(), t.allowClick = !0, t.updateSize(), t.swipeDirection = void 0, a.threshold > 0 && (i.allowThresholdMove = !1);
	let v = !0;
	l.matches(i.focusableElements) && (v = !1, l.nodeName === "SELECT" && (i.isTouched = !1)), n.activeElement && n.activeElement.matches(i.focusableElements) && n.activeElement !== l && n.activeElement.blur();
	let y = v && t.allowTouchMove && a.touchStartPreventDefault;
	(a.touchStartForcePreventDefault || y) && !l.isContentEditable && c.preventDefault(), a.freeMode && a.freeMode.enabled && t.freeMode && t.animating && !a.cssMode && t.freeMode.onTouchStart(), t.emit("touchStart", c);
}
function ju(e) {
	let t = sl(), n = this, r = n.touchEventsData, { params: i, touches: a, rtlTranslate: o, enabled: s } = n;
	if (!s || !i.simulateTouch && e.pointerType === "mouse") return;
	let c = e;
	if (c.originalEvent && (c = c.originalEvent), !r.isTouched) {
		r.startMoving && r.isScrolling && n.emit("touchMoveOpposite", c);
		return;
	}
	let l = r.evCache.findIndex((e) => e.pointerId === c.pointerId);
	l >= 0 && (r.evCache[l] = c);
	let u = r.evCache.length > 1 ? r.evCache[0] : c, d = u.pageX, f = u.pageY;
	if (c.preventedByNestedSwiper) {
		a.startX = d, a.startY = f;
		return;
	}
	if (!n.allowTouchMove) {
		c.target.matches(r.focusableElements) || (n.allowClick = !1), r.isTouched && (Object.assign(a, {
			startX: d,
			startY: f,
			prevX: n.touches.currentX,
			prevY: n.touches.currentY,
			currentX: d,
			currentY: f
		}), r.touchStartTime = fl());
		return;
	}
	if (i.touchReleaseOnEdges && !i.loop) {
		if (n.isVertical()) {
			if (f < a.startY && n.translate <= n.maxTranslate() || f > a.startY && n.translate >= n.minTranslate()) {
				r.isTouched = !1, r.isMoved = !1;
				return;
			}
		} else if (d < a.startX && n.translate <= n.maxTranslate() || d > a.startX && n.translate >= n.minTranslate()) return;
	}
	if (t.activeElement && c.target === t.activeElement && c.target.matches(r.focusableElements)) {
		r.isMoved = !0, n.allowClick = !1;
		return;
	}
	if (r.allowTouchCallbacks && n.emit("touchMove", c), c.targetTouches && c.targetTouches.length > 1) return;
	a.currentX = d, a.currentY = f;
	let p = a.currentX - a.startX, m = a.currentY - a.startY;
	if (n.params.threshold && Math.sqrt(p ** 2 + m ** 2) < n.params.threshold) return;
	if (r.isScrolling === void 0) {
		let e;
		n.isHorizontal() && a.currentY === a.startY || n.isVertical() && a.currentX === a.startX ? r.isScrolling = !1 : p * p + m * m >= 25 && (e = Math.atan2(Math.abs(m), Math.abs(p)) * 180 / Math.PI, r.isScrolling = n.isHorizontal() ? e > i.touchAngle : 90 - e > i.touchAngle);
	}
	if (r.isScrolling && n.emit("touchMoveOpposite", c), r.startMoving === void 0 && (a.currentX !== a.startX || a.currentY !== a.startY) && (r.startMoving = !0), r.isScrolling || n.zoom && n.params.zoom && n.params.zoom.enabled && r.evCache.length > 1) {
		r.isTouched = !1;
		return;
	}
	if (!r.startMoving) return;
	n.allowClick = !1, !i.cssMode && c.cancelable && c.preventDefault(), i.touchMoveStopPropagation && !i.nested && c.stopPropagation();
	let h = n.isHorizontal() ? p : m, g = n.isHorizontal() ? a.currentX - a.previousX : a.currentY - a.previousY;
	i.oneWayMovement && (h = Math.abs(h) * (o ? 1 : -1), g = Math.abs(g) * (o ? 1 : -1)), a.diff = h, h *= i.touchRatio, o && (h = -h, g = -g);
	let _ = n.touchesDirection;
	n.swipeDirection = h > 0 ? "prev" : "next", n.touchesDirection = g > 0 ? "prev" : "next";
	let v = n.params.loop && !i.cssMode, y = n.swipeDirection === "next" && n.allowSlideNext || n.swipeDirection === "prev" && n.allowSlidePrev;
	if (!r.isMoved) {
		if (v && y && n.loopFix({ direction: n.swipeDirection }), r.startTranslate = n.getTranslate(), n.setTransition(0), n.animating) {
			let e = new window.CustomEvent("transitionend", {
				bubbles: !0,
				cancelable: !0
			});
			n.wrapperEl.dispatchEvent(e);
		}
		r.allowMomentumBounce = !1, i.grabCursor && (n.allowSlideNext === !0 || n.allowSlidePrev === !0) && n.setGrabCursor(!0), n.emit("sliderFirstMove", c);
	}
	let b;
	r.isMoved && _ !== n.touchesDirection && v && y && Math.abs(h) >= 1 && (n.loopFix({
		direction: n.swipeDirection,
		setTranslate: !0
	}), b = !0), n.emit("sliderMove", c), r.isMoved = !0, r.currentTranslate = h + r.startTranslate;
	let x = !0, S = i.resistanceRatio;
	if (i.touchReleaseOnEdges && (S = 0), h > 0 ? (v && y && !b && r.currentTranslate > (i.centeredSlides ? n.minTranslate() - n.size / 2 : n.minTranslate()) && n.loopFix({
		direction: "prev",
		setTranslate: !0,
		activeSlideIndex: 0
	}), r.currentTranslate > n.minTranslate() && (x = !1, i.resistance && (r.currentTranslate = n.minTranslate() - 1 + (-n.minTranslate() + r.startTranslate + h) ** S))) : h < 0 && (v && y && !b && r.currentTranslate < (i.centeredSlides ? n.maxTranslate() + n.size / 2 : n.maxTranslate()) && n.loopFix({
		direction: "next",
		setTranslate: !0,
		activeSlideIndex: n.slides.length - (i.slidesPerView === "auto" ? n.slidesPerViewDynamic() : Math.ceil(parseFloat(i.slidesPerView, 10)))
	}), r.currentTranslate < n.maxTranslate() && (x = !1, i.resistance && (r.currentTranslate = n.maxTranslate() + 1 - (n.maxTranslate() - r.startTranslate - h) ** S))), x && (c.preventedByNestedSwiper = !0), !n.allowSlideNext && n.swipeDirection === "next" && r.currentTranslate < r.startTranslate && (r.currentTranslate = r.startTranslate), !n.allowSlidePrev && n.swipeDirection === "prev" && r.currentTranslate > r.startTranslate && (r.currentTranslate = r.startTranslate), !n.allowSlidePrev && !n.allowSlideNext && (r.currentTranslate = r.startTranslate), i.threshold > 0) if (Math.abs(h) > i.threshold || r.allowThresholdMove) {
		if (!r.allowThresholdMove) {
			r.allowThresholdMove = !0, a.startX = a.currentX, a.startY = a.currentY, r.currentTranslate = r.startTranslate, a.diff = n.isHorizontal() ? a.currentX - a.startX : a.currentY - a.startY;
			return;
		}
	} else {
		r.currentTranslate = r.startTranslate;
		return;
	}
	!i.followFinger || i.cssMode || ((i.freeMode && i.freeMode.enabled && n.freeMode || i.watchSlidesProgress) && (n.updateActiveIndex(), n.updateSlidesClasses()), i.freeMode && i.freeMode.enabled && n.freeMode && n.freeMode.onTouchMove(), n.updateProgress(r.currentTranslate), n.setTranslate(r.currentTranslate));
}
function Mu(e) {
	let t = this, n = t.touchEventsData, r = n.evCache.findIndex((t) => t.pointerId === e.pointerId);
	if (r >= 0 && n.evCache.splice(r, 1), [
		"pointercancel",
		"pointerout",
		"pointerleave",
		"contextmenu"
	].includes(e.type) && !(["pointercancel", "contextmenu"].includes(e.type) && (t.browser.isSafari || t.browser.isWebView))) return;
	let { params: i, touches: a, rtlTranslate: o, slidesGrid: s, enabled: c } = t;
	if (!c || !i.simulateTouch && e.pointerType === "mouse") return;
	let l = e;
	if (l.originalEvent && (l = l.originalEvent), n.allowTouchCallbacks && t.emit("touchEnd", l), n.allowTouchCallbacks = !1, !n.isTouched) {
		n.isMoved && i.grabCursor && t.setGrabCursor(!1), n.isMoved = !1, n.startMoving = !1;
		return;
	}
	i.grabCursor && n.isMoved && n.isTouched && (t.allowSlideNext === !0 || t.allowSlidePrev === !0) && t.setGrabCursor(!1);
	let u = fl(), d = u - n.touchStartTime;
	if (t.allowClick) {
		let e = l.path || l.composedPath && l.composedPath();
		t.updateClickedSlide(e && e[0] || l.target, e), t.emit("tap click", l), d < 300 && u - n.lastClickTime < 300 && t.emit("doubleTap doubleClick", l);
	}
	if (n.lastClickTime = fl(), dl(() => {
		t.destroyed || (t.allowClick = !0);
	}), !n.isTouched || !n.isMoved || !t.swipeDirection || a.diff === 0 || n.currentTranslate === n.startTranslate) {
		n.isTouched = !1, n.isMoved = !1, n.startMoving = !1;
		return;
	}
	n.isTouched = !1, n.isMoved = !1, n.startMoving = !1;
	let f;
	if (f = i.followFinger ? o ? t.translate : -t.translate : -n.currentTranslate, i.cssMode) return;
	if (i.freeMode && i.freeMode.enabled) {
		t.freeMode.onTouchEnd({ currentPos: f });
		return;
	}
	let p = 0, m = t.slidesSizesGrid[0];
	for (let e = 0; e < s.length; e += e < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup) {
		let t = e < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
		s[e + t] === void 0 ? f >= s[e] && (p = e, m = s[s.length - 1] - s[s.length - 2]) : f >= s[e] && f < s[e + t] && (p = e, m = s[e + t] - s[e]);
	}
	let h = null, g = null;
	i.rewind && (t.isBeginning ? g = i.virtual && i.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1 : t.isEnd && (h = 0));
	let _ = (f - s[p]) / m, v = p < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
	if (d > i.longSwipesMs) {
		if (!i.longSwipes) {
			t.slideTo(t.activeIndex);
			return;
		}
		t.swipeDirection === "next" && (_ >= i.longSwipesRatio ? t.slideTo(i.rewind && t.isEnd ? h : p + v) : t.slideTo(p)), t.swipeDirection === "prev" && (_ > 1 - i.longSwipesRatio ? t.slideTo(p + v) : g !== null && _ < 0 && Math.abs(_) > i.longSwipesRatio ? t.slideTo(g) : t.slideTo(p));
	} else {
		if (!i.shortSwipes) {
			t.slideTo(t.activeIndex);
			return;
		}
		t.navigation && (l.target === t.navigation.nextEl || l.target === t.navigation.prevEl) ? l.target === t.navigation.nextEl ? t.slideTo(p + v) : t.slideTo(p) : (t.swipeDirection === "next" && t.slideTo(h === null ? p + v : h), t.swipeDirection === "prev" && t.slideTo(g === null ? p : g));
	}
}
function Nu() {
	let e = this, { params: t, el: n } = e;
	if (n && n.offsetWidth === 0) return;
	t.breakpoints && e.setBreakpoint();
	let { allowSlideNext: r, allowSlidePrev: i, snapGrid: a } = e, o = e.virtual && e.params.virtual.enabled;
	e.allowSlideNext = !0, e.allowSlidePrev = !0, e.updateSize(), e.updateSlides(), e.updateSlidesClasses();
	let s = o && t.loop;
	(t.slidesPerView === "auto" || t.slidesPerView > 1) && e.isEnd && !e.isBeginning && !e.params.centeredSlides && !s ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.params.loop && !o ? e.slideToLoop(e.realIndex, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0), e.autoplay && e.autoplay.running && e.autoplay.paused && (clearTimeout(e.autoplay.resizeTimeout), e.autoplay.resizeTimeout = setTimeout(() => {
		e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.resume();
	}, 500)), e.allowSlidePrev = i, e.allowSlideNext = r, e.params.watchOverflow && a !== e.snapGrid && e.checkOverflow();
}
function Pu(e) {
	let t = this;
	t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(), t.params.preventClicksPropagation && t.animating && (e.stopPropagation(), e.stopImmediatePropagation())));
}
function Fu() {
	let e = this, { wrapperEl: t, rtlTranslate: n, enabled: r } = e;
	if (!r) return;
	e.previousTranslate = e.translate, e.isHorizontal() ? e.translate = -t.scrollLeft : e.translate = -t.scrollTop, e.translate === 0 && (e.translate = 0), e.updateActiveIndex(), e.updateSlidesClasses();
	let i, a = e.maxTranslate() - e.minTranslate();
	i = a === 0 ? 0 : (e.translate - e.minTranslate()) / a, i !== e.progress && e.updateProgress(n ? -e.translate : e.translate), e.emit("setTranslate", e.translate, !1);
}
function Iu(e) {
	let t = this;
	Xl(t, e.target), !(t.params.cssMode || t.params.slidesPerView !== "auto" && !t.params.autoHeight) && t.update();
}
var Lu = !1;
function Ru() {}
var zu = (e, t) => {
	let n = sl(), { params: r, el: i, wrapperEl: a, device: o } = e, s = !!r.nested, c = t === "on" ? "addEventListener" : "removeEventListener", l = t;
	i[c]("pointerdown", e.onTouchStart, { passive: !1 }), n[c]("pointermove", e.onTouchMove, {
		passive: !1,
		capture: s
	}), n[c]("pointerup", e.onTouchEnd, { passive: !0 }), n[c]("pointercancel", e.onTouchEnd, { passive: !0 }), n[c]("pointerout", e.onTouchEnd, { passive: !0 }), n[c]("pointerleave", e.onTouchEnd, { passive: !0 }), n[c]("contextmenu", e.onTouchEnd, { passive: !0 }), (r.preventClicks || r.preventClicksPropagation) && i[c]("click", e.onClick, !0), r.cssMode && a[c]("scroll", e.onScroll), r.updateOnWindowResize ? e[l](o.ios || o.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", Nu, !0) : e[l]("observerUpdate", Nu, !0), i[c]("load", e.onLoad, { capture: !0 });
};
function Bu() {
	let e = this, t = sl(), { params: n } = e;
	e.onTouchStart = Au.bind(e), e.onTouchMove = ju.bind(e), e.onTouchEnd = Mu.bind(e), n.cssMode && (e.onScroll = Fu.bind(e)), e.onClick = Pu.bind(e), e.onLoad = Iu.bind(e), Lu ||= (t.addEventListener("touchstart", Ru), !0), zu(e, "on");
}
function Vu() {
	zu(this, "off");
}
var Hu = {
	attachEvents: Bu,
	detachEvents: Vu
}, Uu = (e, t) => e.grid && t.grid && t.grid.rows > 1;
function Wu() {
	let e = this, { realIndex: t, initialized: n, params: r, el: i } = e, a = r.breakpoints;
	if (!a || a && Object.keys(a).length === 0) return;
	let o = e.getBreakpoint(a, e.params.breakpointsBase, e.el);
	if (!o || e.currentBreakpoint === o) return;
	let s = (o in a ? a[o] : void 0) || e.originalParams, c = Uu(e, r), l = Uu(e, s), u = r.enabled;
	c && !l ? (i.classList.remove(`${r.containerModifierClass}grid`, `${r.containerModifierClass}grid-column`), e.emitContainerClasses()) : !c && l && (i.classList.add(`${r.containerModifierClass}grid`), (s.grid.fill && s.grid.fill === "column" || !s.grid.fill && r.grid.fill === "column") && i.classList.add(`${r.containerModifierClass}grid-column`), e.emitContainerClasses()), [
		"navigation",
		"pagination",
		"scrollbar"
	].forEach((t) => {
		if (s[t] === void 0) return;
		let n = r[t] && r[t].enabled, i = s[t] && s[t].enabled;
		n && !i && e[t].disable(), !n && i && e[t].enable();
	});
	let d = s.direction && s.direction !== r.direction, f = r.loop && (s.slidesPerView !== r.slidesPerView || d), p = r.loop;
	d && n && e.changeDirection(), _l(e.params, s);
	let m = e.params.enabled, h = e.params.loop;
	Object.assign(e, {
		allowTouchMove: e.params.allowTouchMove,
		allowSlideNext: e.params.allowSlideNext,
		allowSlidePrev: e.params.allowSlidePrev
	}), u && !m ? e.disable() : !u && m && e.enable(), e.currentBreakpoint = o, e.emit("_beforeBreakpoint", s), n && (f ? (e.loopDestroy(), e.loopCreate(t), e.updateSlides()) : !p && h ? (e.loopCreate(t), e.updateSlides()) : p && !h && e.loopDestroy()), e.emit("breakpoint", s);
}
function Gu(e, t, n) {
	if (t === void 0 && (t = "window"), !e || t === "container" && !n) return;
	let r = !1, i = ll(), a = t === "window" ? i.innerHeight : n.clientHeight, o = Object.keys(e).map((e) => typeof e == "string" && e.indexOf("@") === 0 ? {
		value: a * parseFloat(e.substr(1)),
		point: e
	} : {
		value: e,
		point: e
	});
	o.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
	for (let e = 0; e < o.length; e += 1) {
		let { point: a, value: s } = o[e];
		t === "window" ? i.matchMedia(`(min-width: ${s}px)`).matches && (r = a) : s <= n.clientWidth && (r = a);
	}
	return r || "max";
}
var Ku = {
	setBreakpoint: Wu,
	getBreakpoint: Gu
};
function qu(e, t) {
	let n = [];
	return e.forEach((e) => {
		typeof e == "object" ? Object.keys(e).forEach((r) => {
			e[r] && n.push(t + r);
		}) : typeof e == "string" && n.push(t + e);
	}), n;
}
function Ju() {
	let e = this, { classNames: t, params: n, rtl: r, el: i, device: a } = e, o = qu([
		"initialized",
		n.direction,
		{ "free-mode": e.params.freeMode && n.freeMode.enabled },
		{ autoheight: n.autoHeight },
		{ rtl: r },
		{ grid: n.grid && n.grid.rows > 1 },
		{ "grid-column": n.grid && n.grid.rows > 1 && n.grid.fill === "column" },
		{ android: a.android },
		{ ios: a.ios },
		{ "css-mode": n.cssMode },
		{ centered: n.cssMode && n.centeredSlides },
		{ "watch-progress": n.watchSlidesProgress }
	], n.containerModifierClass);
	t.push(...o), i.classList.add(...t), e.emitContainerClasses();
}
function Yu() {
	let e = this, { el: t, classNames: n } = e;
	t.classList.remove(...n), e.emitContainerClasses();
}
var Xu = {
	addClasses: Ju,
	removeClasses: Yu
};
function Zu() {
	let e = this, { isLocked: t, params: n } = e, { slidesOffsetBefore: r } = n;
	if (r) {
		let t = e.slides.length - 1, n = e.slidesGrid[t] + e.slidesSizesGrid[t] + r * 2;
		e.isLocked = e.size > n;
	} else e.isLocked = e.snapGrid.length === 1;
	n.allowSlideNext === !0 && (e.allowSlideNext = !e.isLocked), n.allowSlidePrev === !0 && (e.allowSlidePrev = !e.isLocked), t && t !== e.isLocked && (e.isEnd = !1), t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock");
}
var Qu = { checkOverflow: Zu }, $u = {
	init: !0,
	direction: "horizontal",
	oneWayMovement: !1,
	touchEventsTarget: "wrapper",
	initialSlide: 0,
	speed: 300,
	cssMode: !1,
	updateOnWindowResize: !0,
	resizeObserver: !0,
	nested: !1,
	createElements: !1,
	enabled: !0,
	focusableElements: "input, select, option, textarea, button, video, label",
	width: null,
	height: null,
	preventInteractionOnTransition: !1,
	userAgent: null,
	url: null,
	edgeSwipeDetection: !1,
	edgeSwipeThreshold: 20,
	autoHeight: !1,
	setWrapperSize: !1,
	virtualTranslate: !1,
	effect: "slide",
	breakpoints: void 0,
	breakpointsBase: "window",
	spaceBetween: 0,
	slidesPerView: 1,
	slidesPerGroup: 1,
	slidesPerGroupSkip: 0,
	slidesPerGroupAuto: !1,
	centeredSlides: !1,
	centeredSlidesBounds: !1,
	slidesOffsetBefore: 0,
	slidesOffsetAfter: 0,
	normalizeSlideIndex: !0,
	centerInsufficientSlides: !1,
	watchOverflow: !0,
	roundLengths: !1,
	touchRatio: 1,
	touchAngle: 45,
	simulateTouch: !0,
	shortSwipes: !0,
	longSwipes: !0,
	longSwipesRatio: .5,
	longSwipesMs: 300,
	followFinger: !0,
	allowTouchMove: !0,
	threshold: 5,
	touchMoveStopPropagation: !1,
	touchStartPreventDefault: !0,
	touchStartForcePreventDefault: !1,
	touchReleaseOnEdges: !1,
	uniqueNavElements: !0,
	resistance: !0,
	resistanceRatio: .85,
	watchSlidesProgress: !1,
	grabCursor: !1,
	preventClicks: !0,
	preventClicksPropagation: !0,
	slideToClickedSlide: !1,
	loop: !1,
	loopedSlides: null,
	loopPreventsSliding: !0,
	rewind: !1,
	allowSlidePrev: !0,
	allowSlideNext: !0,
	swipeHandler: null,
	noSwiping: !0,
	noSwipingClass: "swiper-no-swiping",
	noSwipingSelector: null,
	passiveListeners: !0,
	maxBackfaceHiddenSlides: 10,
	containerModifierClass: "swiper-",
	slideClass: "swiper-slide",
	slideActiveClass: "swiper-slide-active",
	slideVisibleClass: "swiper-slide-visible",
	slideNextClass: "swiper-slide-next",
	slidePrevClass: "swiper-slide-prev",
	wrapperClass: "swiper-wrapper",
	lazyPreloaderClass: "swiper-lazy-preloader",
	lazyPreloadPrevNext: 0,
	runCallbacksOnInit: !0,
	_emitClasses: !1
};
function ed(e, t) {
	return function(n) {
		n === void 0 && (n = {});
		let r = Object.keys(n)[0], i = n[r];
		if (typeof i != "object" || !i) {
			_l(t, n);
			return;
		}
		if (e[r] === !0 && (e[r] = { enabled: !0 }), r === "navigation" && e[r] && e[r].enabled && !e[r].prevEl && !e[r].nextEl && (e[r].auto = !0), ["pagination", "scrollbar"].indexOf(r) >= 0 && e[r] && e[r].enabled && !e[r].el && (e[r].auto = !0), !(r in e && "enabled" in i)) {
			_l(t, n);
			return;
		}
		typeof e[r] == "object" && !("enabled" in e[r]) && (e[r].enabled = !0), e[r] || (e[r] = { enabled: !1 }), _l(t, n);
	};
}
var td = {
	eventsEmitter: Hl,
	update: nu,
	translate: cu,
	transition: pu,
	slide: xu,
	loop: Tu,
	grabCursor: Ou,
	events: Hu,
	breakpoints: Ku,
	checkOverflow: Qu,
	classes: Xu
}, nd = {}, rd = class e {
	constructor() {
		let t, n;
		var r = [...arguments];
		r.length === 1 && r[0].constructor && Object.prototype.toString.call(r[0]).slice(8, -1) === "Object" ? n = r[0] : [t, n] = r, n ||= {}, n = _l({}, n), t && !n.el && (n.el = t);
		let i = sl();
		if (n.el && typeof n.el == "string" && i.querySelectorAll(n.el).length > 1) {
			let t = [];
			return i.querySelectorAll(n.el).forEach((r) => {
				let i = _l({}, n, { el: r });
				t.push(new e(i));
			}), t;
		}
		let a = this;
		a.__swiper__ = !0, a.support = Nl(), a.device = Il({ userAgent: n.userAgent }), a.browser = zl(), a.eventsListeners = {}, a.eventsAnyListeners = [], a.modules = [...a.__modules__], n.modules && Array.isArray(n.modules) && a.modules.push(...n.modules);
		let o = {};
		return a.modules.forEach((e) => {
			e({
				params: n,
				swiper: a,
				extendParams: ed(n, o),
				on: a.on.bind(a),
				once: a.once.bind(a),
				off: a.off.bind(a),
				emit: a.emit.bind(a)
			});
		}), a.params = _l({}, _l({}, $u, o), nd, n), a.originalParams = _l({}, a.params), a.passedParams = _l({}, n), a.params && a.params.on && Object.keys(a.params.on).forEach((e) => {
			a.on(e, a.params.on[e]);
		}), a.params && a.params.onAny && a.onAny(a.params.onAny), Object.assign(a, {
			enabled: a.params.enabled,
			el: t,
			classNames: [],
			slides: [],
			slidesGrid: [],
			snapGrid: [],
			slidesSizesGrid: [],
			isHorizontal() {
				return a.params.direction === "horizontal";
			},
			isVertical() {
				return a.params.direction === "vertical";
			},
			activeIndex: 0,
			realIndex: 0,
			isBeginning: !0,
			isEnd: !1,
			translate: 0,
			previousTranslate: 0,
			progress: 0,
			velocity: 0,
			animating: !1,
			cssOverflowAdjustment() {
				return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
			},
			allowSlideNext: a.params.allowSlideNext,
			allowSlidePrev: a.params.allowSlidePrev,
			touchEventsData: {
				isTouched: void 0,
				isMoved: void 0,
				allowTouchCallbacks: void 0,
				touchStartTime: void 0,
				isScrolling: void 0,
				currentTranslate: void 0,
				startTranslate: void 0,
				allowThresholdMove: void 0,
				focusableElements: a.params.focusableElements,
				lastClickTime: 0,
				clickTimeout: void 0,
				velocities: [],
				allowMomentumBounce: void 0,
				startMoving: void 0,
				evCache: []
			},
			allowClick: !0,
			allowTouchMove: a.params.allowTouchMove,
			touches: {
				startX: 0,
				startY: 0,
				currentX: 0,
				currentY: 0,
				diff: 0
			},
			imagesToLoad: [],
			imagesLoaded: 0
		}), a.emit("_swiper"), a.params.init && a.init(), a;
	}
	getSlideIndex(e) {
		let { slidesEl: t, params: n } = this, r = Dl(xl(t, `.${n.slideClass}, swiper-slide`)[0]);
		return Dl(e) - r;
	}
	getSlideIndexByData(e) {
		return this.getSlideIndex(this.slides.filter((t) => t.getAttribute("data-swiper-slide-index") * 1 === e)[0]);
	}
	recalcSlides() {
		let e = this, { slidesEl: t, params: n } = e;
		e.slides = xl(t, `.${n.slideClass}, swiper-slide`);
	}
	enable() {
		let e = this;
		e.enabled || (e.enabled = !0, e.params.grabCursor && e.setGrabCursor(), e.emit("enable"));
	}
	disable() {
		let e = this;
		e.enabled && (e.enabled = !1, e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"));
	}
	setProgress(e, t) {
		let n = this;
		e = Math.min(Math.max(e, 0), 1);
		let r = n.minTranslate(), i = (n.maxTranslate() - r) * e + r;
		n.translateTo(i, t === void 0 ? 0 : t), n.updateActiveIndex(), n.updateSlidesClasses();
	}
	emitContainerClasses() {
		let e = this;
		if (!e.params._emitClasses || !e.el) return;
		let t = e.el.className.split(" ").filter((t) => t.indexOf("swiper") === 0 || t.indexOf(e.params.containerModifierClass) === 0);
		e.emit("_containerClasses", t.join(" "));
	}
	getSlideClasses(e) {
		let t = this;
		return t.destroyed ? "" : e.className.split(" ").filter((e) => e.indexOf("swiper-slide") === 0 || e.indexOf(t.params.slideClass) === 0).join(" ");
	}
	emitSlidesClasses() {
		let e = this;
		if (!e.params._emitClasses || !e.el) return;
		let t = [];
		e.slides.forEach((n) => {
			let r = e.getSlideClasses(n);
			t.push({
				slideEl: n,
				classNames: r
			}), e.emit("_slideClass", n, r);
		}), e.emit("_slideClasses", t);
	}
	slidesPerViewDynamic(e, t) {
		e === void 0 && (e = "current"), t === void 0 && (t = !1);
		let { params: n, slides: r, slidesGrid: i, slidesSizesGrid: a, size: o, activeIndex: s } = this, c = 1;
		if (typeof n.slidesPerView == "number") return n.slidesPerView;
		if (n.centeredSlides) {
			let e = r[s] ? r[s].swiperSlideSize : 0, t;
			for (let n = s + 1; n < r.length; n += 1) r[n] && !t && (e += r[n].swiperSlideSize, c += 1, e > o && (t = !0));
			for (let n = s - 1; n >= 0; --n) r[n] && !t && (e += r[n].swiperSlideSize, c += 1, e > o && (t = !0));
		} else if (e === "current") for (let e = s + 1; e < r.length; e += 1) (t ? i[e] + a[e] - i[s] < o : i[e] - i[s] < o) && (c += 1);
		else for (let e = s - 1; e >= 0; --e) i[s] - i[e] < o && (c += 1);
		return c;
	}
	update() {
		let e = this;
		if (!e || e.destroyed) return;
		let { snapGrid: t, params: n } = e;
		n.breakpoints && e.setBreakpoint(), [...e.el.querySelectorAll("[loading=\"lazy\"]")].forEach((t) => {
			t.complete && Xl(e, t);
		}), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses();
		function r() {
			let t = e.rtlTranslate ? e.translate * -1 : e.translate, n = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
			e.setTranslate(n), e.updateActiveIndex(), e.updateSlidesClasses();
		}
		let i;
		if (n.freeMode && n.freeMode.enabled && !n.cssMode) r(), n.autoHeight && e.updateAutoHeight();
		else {
			if ((n.slidesPerView === "auto" || n.slidesPerView > 1) && e.isEnd && !n.centeredSlides) {
				let t = e.virtual && n.virtual.enabled ? e.virtual.slides : e.slides;
				i = e.slideTo(t.length - 1, 0, !1, !0);
			} else i = e.slideTo(e.activeIndex, 0, !1, !0);
			i || r();
		}
		n.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update");
	}
	changeDirection(e, t) {
		t === void 0 && (t = !0);
		let n = this, r = n.params.direction;
		return e ||= r === "horizontal" ? "vertical" : "horizontal", e === r || e !== "horizontal" && e !== "vertical" ? n : (n.el.classList.remove(`${n.params.containerModifierClass}${r}`), n.el.classList.add(`${n.params.containerModifierClass}${e}`), n.emitContainerClasses(), n.params.direction = e, n.slides.forEach((t) => {
			e === "vertical" ? t.style.width = "" : t.style.height = "";
		}), n.emit("changeDirection"), t && n.update(), n);
	}
	changeLanguageDirection(e) {
		let t = this;
		t.rtl && e === "rtl" || !t.rtl && e === "ltr" || (t.rtl = e === "rtl", t.rtlTranslate = t.params.direction === "horizontal" && t.rtl, t.rtl ? (t.el.classList.add(`${t.params.containerModifierClass}rtl`), t.el.dir = "rtl") : (t.el.classList.remove(`${t.params.containerModifierClass}rtl`), t.el.dir = "ltr"), t.update());
	}
	mount(e) {
		let t = this;
		if (t.mounted) return !0;
		let n = e || t.params.el;
		if (typeof n == "string" && (n = document.querySelector(n)), !n) return !1;
		n.swiper = t, n.parentNode && n.parentNode.host && n.parentNode.host.nodeName === "SWIPER-CONTAINER" && (t.isElement = !0);
		let r = () => `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`, i = n && n.shadowRoot && n.shadowRoot.querySelector ? n.shadowRoot.querySelector(r()) : xl(n, r())[0];
		return !i && t.params.createElements && (i = Sl("div", t.params.wrapperClass), n.append(i), xl(n, `.${t.params.slideClass}`).forEach((e) => {
			i.append(e);
		})), Object.assign(t, {
			el: n,
			wrapperEl: i,
			slidesEl: t.isElement && !n.parentNode.host.slideSlots ? n.parentNode.host : i,
			hostEl: t.isElement ? n.parentNode.host : n,
			mounted: !0,
			rtl: n.dir.toLowerCase() === "rtl" || El(n, "direction") === "rtl",
			rtlTranslate: t.params.direction === "horizontal" && (n.dir.toLowerCase() === "rtl" || El(n, "direction") === "rtl"),
			wrongRTL: El(i, "display") === "-webkit-box"
		}), !0;
	}
	init(e) {
		let t = this;
		if (t.initialized || t.mount(e) === !1) return t;
		t.emit("beforeInit"), t.params.breakpoints && t.setBreakpoint(), t.addClasses(), t.updateSize(), t.updateSlides(), t.params.watchOverflow && t.checkOverflow(), t.params.grabCursor && t.enabled && t.setGrabCursor(), t.params.loop && t.virtual && t.params.virtual.enabled ? t.slideTo(t.params.initialSlide + t.virtual.slidesBefore, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0), t.params.loop && t.loopCreate(), t.attachEvents();
		let n = [...t.el.querySelectorAll("[loading=\"lazy\"]")];
		return t.isElement && n.push(...t.hostEl.querySelectorAll("[loading=\"lazy\"]")), n.forEach((e) => {
			e.complete ? Xl(t, e) : e.addEventListener("load", (e) => {
				Xl(t, e.target);
			});
		}), Ql(t), t.initialized = !0, Ql(t), t.emit("init"), t.emit("afterInit"), t;
	}
	destroy(e, t) {
		e === void 0 && (e = !0), t === void 0 && (t = !0);
		let n = this, { params: r, el: i, wrapperEl: a, slides: o } = n;
		return n.params === void 0 || n.destroyed ? null : (n.emit("beforeDestroy"), n.initialized = !1, n.detachEvents(), r.loop && n.loopDestroy(), t && (n.removeClasses(), i.removeAttribute("style"), a.removeAttribute("style"), o && o.length && o.forEach((e) => {
			e.classList.remove(r.slideVisibleClass, r.slideActiveClass, r.slideNextClass, r.slidePrevClass), e.removeAttribute("style"), e.removeAttribute("data-swiper-slide-index");
		})), n.emit("destroy"), Object.keys(n.eventsListeners).forEach((e) => {
			n.off(e);
		}), e !== !1 && (n.el.swiper = null, ul(n)), n.destroyed = !0, null);
	}
	static extendDefaults(e) {
		_l(nd, e);
	}
	static get extendedDefaults() {
		return nd;
	}
	static get defaults() {
		return $u;
	}
	static installModule(t) {
		e.prototype.__modules__ || (e.prototype.__modules__ = []);
		let n = e.prototype.__modules__;
		typeof t == "function" && n.indexOf(t) < 0 && n.push(t);
	}
	static use(t) {
		return Array.isArray(t) ? (t.forEach((t) => e.installModule(t)), e) : (e.installModule(t), e);
	}
};
Object.keys(td).forEach((e) => {
	Object.keys(td[e]).forEach((t) => {
		rd.prototype[t] = td[e][t];
	});
}), rd.use([Bl, Vl]);
//#endregion
//#region node_modules/swiper/modules/virtual.mjs
function id(e) {
	let { swiper: t, extendParams: n, on: r, emit: i } = e;
	n({ virtual: {
		enabled: !1,
		slides: [],
		cache: !0,
		renderSlide: null,
		renderExternal: null,
		renderExternalUpdate: !0,
		addSlidesBefore: 0,
		addSlidesAfter: 0
	} });
	let a, o = sl();
	t.virtual = {
		cache: {},
		from: void 0,
		to: void 0,
		slides: [],
		offset: 0,
		slidesGrid: []
	};
	let s = o.createElement("div");
	function c(e, n) {
		let r = t.params.virtual;
		if (r.cache && t.virtual.cache[n]) return t.virtual.cache[n];
		let i;
		return r.renderSlide ? (i = r.renderSlide.call(t, e, n), typeof i == "string" && (s.innerHTML = i, i = s.children[0])) : i = t.isElement ? Sl("swiper-slide") : Sl("div", t.params.slideClass), i.setAttribute("data-swiper-slide-index", n), r.renderSlide || (i.innerHTML = e), r.cache && (t.virtual.cache[n] = i), i;
	}
	function l(e) {
		let { slidesPerView: n, slidesPerGroup: r, centeredSlides: a, loop: o } = t.params, { addSlidesBefore: s, addSlidesAfter: l } = t.params.virtual, { from: u, to: d, slides: f, slidesGrid: p, offset: m } = t.virtual;
		t.params.cssMode || t.updateActiveIndex();
		let h = t.activeIndex || 0, g;
		g = t.rtlTranslate ? "right" : t.isHorizontal() ? "left" : "top";
		let _, v;
		a ? (_ = Math.floor(n / 2) + r + l, v = Math.floor(n / 2) + r + s) : (_ = n + (r - 1) + l, v = (o ? n : r) + s);
		let y = h - v, b = h + _;
		o || (y = Math.max(y, 0), b = Math.min(b, f.length - 1));
		let x = (t.slidesGrid[y] || 0) - (t.slidesGrid[0] || 0);
		o && h >= v ? (y -= v, a || (x += t.slidesGrid[0])) : o && h < v && (y = -v, a && (x += t.slidesGrid[0])), Object.assign(t.virtual, {
			from: y,
			to: b,
			offset: x,
			slidesGrid: t.slidesGrid,
			slidesBefore: v,
			slidesAfter: _
		});
		function S() {
			t.updateSlides(), t.updateProgress(), t.updateSlidesClasses(), i("virtualUpdate");
		}
		if (u === y && d === b && !e) {
			t.slidesGrid !== p && x !== m && t.slides.forEach((e) => {
				e.style[g] = `${x - Math.abs(t.cssOverflowAdjustment())}px`;
			}), t.updateProgress(), i("virtualUpdate");
			return;
		}
		if (t.params.virtual.renderExternal) {
			t.params.virtual.renderExternal.call(t, {
				offset: x,
				from: y,
				to: b,
				slides: function() {
					let e = [];
					for (let t = y; t <= b; t += 1) e.push(f[t]);
					return e;
				}()
			}), t.params.virtual.renderExternalUpdate ? S() : i("virtualUpdate");
			return;
		}
		let C = [], w = [], T = (e) => {
			let t = e;
			return e < 0 ? t = f.length + e : t >= f.length && (t -= f.length), t;
		};
		if (e) t.slides.filter((e) => e.matches(`.${t.params.slideClass}, swiper-slide`)).forEach((e) => {
			e.remove();
		});
		else for (let e = u; e <= d; e += 1) if (e < y || e > b) {
			let n = T(e);
			t.slides.filter((e) => e.matches(`.${t.params.slideClass}[data-swiper-slide-index="${n}"], swiper-slide[data-swiper-slide-index="${n}"]`)).forEach((e) => {
				e.remove();
			});
		}
		let E = o ? -f.length : 0, D = o ? f.length * 2 : f.length;
		for (let t = E; t < D; t += 1) if (t >= y && t <= b) {
			let n = T(t);
			d === void 0 || e ? w.push(n) : (t > d && w.push(n), t < u && C.push(n));
		}
		if (w.forEach((e) => {
			t.slidesEl.append(c(f[e], e));
		}), o) for (let e = C.length - 1; e >= 0; --e) {
			let n = C[e];
			t.slidesEl.prepend(c(f[n], n));
		}
		else C.sort((e, t) => t - e), C.forEach((e) => {
			t.slidesEl.prepend(c(f[e], e));
		});
		xl(t.slidesEl, ".swiper-slide, swiper-slide").forEach((e) => {
			e.style[g] = `${x - Math.abs(t.cssOverflowAdjustment())}px`;
		}), S();
	}
	function u(e) {
		if (typeof e == "object" && "length" in e) for (let n = 0; n < e.length; n += 1) e[n] && t.virtual.slides.push(e[n]);
		else t.virtual.slides.push(e);
		l(!0);
	}
	function d(e) {
		let n = t.activeIndex, r = n + 1, i = 1;
		if (Array.isArray(e)) {
			for (let n = 0; n < e.length; n += 1) e[n] && t.virtual.slides.unshift(e[n]);
			r = n + e.length, i = e.length;
		} else t.virtual.slides.unshift(e);
		if (t.params.virtual.cache) {
			let e = t.virtual.cache, n = {};
			Object.keys(e).forEach((t) => {
				let r = e[t], a = r.getAttribute("data-swiper-slide-index");
				a && r.setAttribute("data-swiper-slide-index", parseInt(a, 10) + i), n[parseInt(t, 10) + i] = r;
			}), t.virtual.cache = n;
		}
		l(!0), t.slideTo(r, 0);
	}
	function f(e) {
		if (e == null) return;
		let n = t.activeIndex;
		if (Array.isArray(e)) for (let r = e.length - 1; r >= 0; --r) t.params.virtual.cache && (delete t.virtual.cache[e[r]], Object.keys(t.virtual.cache).forEach((n) => {
			n > e && (t.virtual.cache[n - 1] = t.virtual.cache[n], t.virtual.cache[n - 1].setAttribute("data-swiper-slide-index", n - 1), delete t.virtual.cache[n]);
		})), t.virtual.slides.splice(e[r], 1), e[r] < n && --n, n = Math.max(n, 0);
		else t.params.virtual.cache && (delete t.virtual.cache[e], Object.keys(t.virtual.cache).forEach((n) => {
			n > e && (t.virtual.cache[n - 1] = t.virtual.cache[n], t.virtual.cache[n - 1].setAttribute("data-swiper-slide-index", n - 1), delete t.virtual.cache[n]);
		})), t.virtual.slides.splice(e, 1), e < n && --n, n = Math.max(n, 0);
		l(!0), t.slideTo(n, 0);
	}
	function p() {
		t.virtual.slides = [], t.params.virtual.cache && (t.virtual.cache = {}), l(!0), t.slideTo(0, 0);
	}
	r("beforeInit", () => {
		if (!t.params.virtual.enabled) return;
		let e;
		if (t.passedParams.virtual.slides === void 0) {
			let n = [...t.slidesEl.children].filter((e) => e.matches(`.${t.params.slideClass}, swiper-slide`));
			n && n.length && (t.virtual.slides = [...n], e = !0, n.forEach((e, n) => {
				e.setAttribute("data-swiper-slide-index", n), t.virtual.cache[n] = e, e.remove();
			}));
		}
		e || (t.virtual.slides = t.params.virtual.slides), t.classNames.push(`${t.params.containerModifierClass}virtual`), t.params.watchSlidesProgress = !0, t.originalParams.watchSlidesProgress = !0, l();
	}), r("setTranslate", () => {
		t.params.virtual.enabled && (t.params.cssMode && !t._immediateVirtual ? (clearTimeout(a), a = setTimeout(() => {
			l();
		}, 100)) : l());
	}), r("init update resize", () => {
		t.params.virtual.enabled && t.params.cssMode && vl(t.wrapperEl, "--swiper-virtual-size", `${t.virtualSize}px`);
	}), Object.assign(t.virtual, {
		appendSlide: u,
		prependSlide: d,
		removeSlide: f,
		removeAllSlides: p,
		update: l
	});
}
//#endregion
//#region node_modules/swiper/modules/keyboard.mjs
function ad(e) {
	let { swiper: t, extendParams: n, on: r, emit: i } = e, a = sl(), o = ll();
	t.keyboard = { enabled: !1 }, n({ keyboard: {
		enabled: !1,
		onlyInViewport: !0,
		pageUpDown: !0
	} });
	function s(e) {
		if (!t.enabled) return;
		let { rtlTranslate: n } = t, r = e;
		r.originalEvent && (r = r.originalEvent);
		let s = r.keyCode || r.charCode, c = t.params.keyboard.pageUpDown, l = c && s === 33, u = c && s === 34, d = s === 37, f = s === 39, p = s === 38, m = s === 40;
		if (!t.allowSlideNext && (t.isHorizontal() && f || t.isVertical() && m || u) || !t.allowSlidePrev && (t.isHorizontal() && d || t.isVertical() && p || l)) return !1;
		if (!(r.shiftKey || r.altKey || r.ctrlKey || r.metaKey) && !(a.activeElement && a.activeElement.nodeName && (a.activeElement.nodeName.toLowerCase() === "input" || a.activeElement.nodeName.toLowerCase() === "textarea"))) {
			if (t.params.keyboard.onlyInViewport && (l || u || d || f || p || m)) {
				let e = !1;
				if (Ol(t.el, `.${t.params.slideClass}, swiper-slide`).length > 0 && Ol(t.el, `.${t.params.slideActiveClass}`).length === 0) return;
				let r = t.el, i = r.clientWidth, a = r.clientHeight, s = o.innerWidth, c = o.innerHeight, l = Cl(r);
				n && (l.left -= r.scrollLeft);
				let u = [
					[l.left, l.top],
					[l.left + i, l.top],
					[l.left, l.top + a],
					[l.left + i, l.top + a]
				];
				for (let t = 0; t < u.length; t += 1) {
					let n = u[t];
					if (n[0] >= 0 && n[0] <= s && n[1] >= 0 && n[1] <= c) {
						if (n[0] === 0 && n[1] === 0) continue;
						e = !0;
					}
				}
				if (!e) return;
			}
			t.isHorizontal() ? ((l || u || d || f) && (r.preventDefault ? r.preventDefault() : r.returnValue = !1), ((u || f) && !n || (l || d) && n) && t.slideNext(), ((l || d) && !n || (u || f) && n) && t.slidePrev()) : ((l || u || p || m) && (r.preventDefault ? r.preventDefault() : r.returnValue = !1), (u || m) && t.slideNext(), (l || p) && t.slidePrev()), i("keyPress", s);
		}
	}
	function c() {
		t.keyboard.enabled || (a.addEventListener("keydown", s), t.keyboard.enabled = !0);
	}
	function l() {
		t.keyboard.enabled && (a.removeEventListener("keydown", s), t.keyboard.enabled = !1);
	}
	r("init", () => {
		t.params.keyboard.enabled && c();
	}), r("destroy", () => {
		t.keyboard.enabled && l();
	}), Object.assign(t.keyboard, {
		enable: c,
		disable: l
	});
}
//#endregion
//#region node_modules/swiper/modules/mousewheel.mjs
function od(e) {
	let { swiper: t, extendParams: n, on: r, emit: i } = e, a = ll();
	n({ mousewheel: {
		enabled: !1,
		releaseOnEdges: !1,
		invert: !1,
		forceToAxis: !1,
		sensitivity: 1,
		eventsTarget: "container",
		thresholdDelta: null,
		thresholdTime: null,
		noMousewheelClass: "swiper-no-mousewheel"
	} }), t.mousewheel = { enabled: !1 };
	let o, s = fl(), c, l = [];
	function u(e) {
		let t = 0, n = 0, r = 0, i = 0;
		return "detail" in e && (n = e.detail), "wheelDelta" in e && (n = -e.wheelDelta / 120), "wheelDeltaY" in e && (n = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (t = n, n = 0), r = t * 10, i = n * 10, "deltaY" in e && (i = e.deltaY), "deltaX" in e && (r = e.deltaX), e.shiftKey && !r && (r = i, i = 0), (r || i) && e.deltaMode && (e.deltaMode === 1 ? (r *= 40, i *= 40) : (r *= 800, i *= 800)), r && !t && (t = r < 1 ? -1 : 1), i && !n && (n = i < 1 ? -1 : 1), {
			spinX: t,
			spinY: n,
			pixelX: r,
			pixelY: i
		};
	}
	function d() {
		t.enabled && (t.mouseEntered = !0);
	}
	function f() {
		t.enabled && (t.mouseEntered = !1);
	}
	function p(e) {
		return t.params.mousewheel.thresholdDelta && e.delta < t.params.mousewheel.thresholdDelta || t.params.mousewheel.thresholdTime && fl() - s < t.params.mousewheel.thresholdTime ? !1 : e.delta >= 6 && fl() - s < 60 ? !0 : (e.direction < 0 ? (!t.isEnd || t.params.loop) && !t.animating && (t.slideNext(), i("scroll", e.raw)) : (!t.isBeginning || t.params.loop) && !t.animating && (t.slidePrev(), i("scroll", e.raw)), s = new a.Date().getTime(), !1);
	}
	function m(e) {
		let n = t.params.mousewheel;
		if (e.direction < 0) {
			if (t.isEnd && !t.params.loop && n.releaseOnEdges) return !0;
		} else if (t.isBeginning && !t.params.loop && n.releaseOnEdges) return !0;
		return !1;
	}
	function h(e) {
		let n = e, r = !0;
		if (!t.enabled || e.target.closest(`.${t.params.mousewheel.noMousewheelClass}`)) return;
		let a = t.params.mousewheel;
		t.params.cssMode && n.preventDefault();
		let s = t.el;
		t.params.mousewheel.eventsTarget !== "container" && (s = document.querySelector(t.params.mousewheel.eventsTarget));
		let d = s && s.contains(n.target);
		if (!t.mouseEntered && !d && !a.releaseOnEdges) return !0;
		n.originalEvent && (n = n.originalEvent);
		let f = 0, h = t.rtlTranslate ? -1 : 1, g = u(n);
		if (a.forceToAxis) if (t.isHorizontal()) if (Math.abs(g.pixelX) > Math.abs(g.pixelY)) f = -g.pixelX * h;
		else return !0;
		else if (Math.abs(g.pixelY) > Math.abs(g.pixelX)) f = -g.pixelY;
		else return !0;
		else f = Math.abs(g.pixelX) > Math.abs(g.pixelY) ? -g.pixelX * h : -g.pixelY;
		if (f === 0) return !0;
		a.invert && (f = -f);
		let _ = t.getTranslate() + f * a.sensitivity;
		if (_ >= t.minTranslate() && (_ = t.minTranslate()), _ <= t.maxTranslate() && (_ = t.maxTranslate()), r = t.params.loop ? !0 : !(_ === t.minTranslate() || _ === t.maxTranslate()), r && t.params.nested && n.stopPropagation(), !t.params.freeMode || !t.params.freeMode.enabled) {
			let t = {
				time: fl(),
				delta: Math.abs(f),
				direction: Math.sign(f),
				raw: e
			};
			l.length >= 2 && l.shift();
			let n = l.length ? l[l.length - 1] : void 0;
			if (l.push(t), n ? (t.direction !== n.direction || t.delta > n.delta || t.time > n.time + 150) && p(t) : p(t), m(t)) return !0;
		} else {
			let e = {
				time: fl(),
				delta: Math.abs(f),
				direction: Math.sign(f)
			}, r = c && e.time < c.time + 500 && e.delta <= c.delta && e.direction === c.direction;
			if (!r) {
				c = void 0;
				let s = t.getTranslate() + f * a.sensitivity, u = t.isBeginning, d = t.isEnd;
				if (s >= t.minTranslate() && (s = t.minTranslate()), s <= t.maxTranslate() && (s = t.maxTranslate()), t.setTransition(0), t.setTranslate(s), t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses(), (!u && t.isBeginning || !d && t.isEnd) && t.updateSlidesClasses(), t.params.loop && t.loopFix({
					direction: e.direction < 0 ? "next" : "prev",
					byMousewheel: !0
				}), t.params.freeMode.sticky) {
					clearTimeout(o), o = void 0, l.length >= 15 && l.shift();
					let n = l.length ? l[l.length - 1] : void 0, r = l[0];
					if (l.push(e), n && (e.delta > n.delta || e.direction !== n.direction)) l.splice(0);
					else if (l.length >= 15 && e.time - r.time < 500 && r.delta - e.delta >= 1 && e.delta <= 6) {
						let n = f > 0 ? .8 : .2;
						c = e, l.splice(0), o = dl(() => {
							t.slideToClosest(t.params.speed, !0, void 0, n);
						}, 0);
					}
					o ||= dl(() => {
						c = e, l.splice(0), t.slideToClosest(t.params.speed, !0, void 0, .5);
					}, 500);
				}
				if (r || i("scroll", n), t.params.autoplay && t.params.autoplayDisableOnInteraction && t.autoplay.stop(), a.releaseOnEdges && (s === t.minTranslate() || s === t.maxTranslate())) return !0;
			}
		}
		return n.preventDefault ? n.preventDefault() : n.returnValue = !1, !1;
	}
	function g(e) {
		let n = t.el;
		t.params.mousewheel.eventsTarget !== "container" && (n = document.querySelector(t.params.mousewheel.eventsTarget)), n[e]("mouseenter", d), n[e]("mouseleave", f), n[e]("wheel", h);
	}
	function _() {
		return t.params.cssMode ? (t.wrapperEl.removeEventListener("wheel", h), !0) : t.mousewheel.enabled ? !1 : (g("addEventListener"), t.mousewheel.enabled = !0, !0);
	}
	function v() {
		return t.params.cssMode ? (t.wrapperEl.addEventListener(event, h), !0) : t.mousewheel.enabled ? (g("removeEventListener"), t.mousewheel.enabled = !1, !0) : !1;
	}
	r("init", () => {
		!t.params.mousewheel.enabled && t.params.cssMode && v(), t.params.mousewheel.enabled && _();
	}), r("destroy", () => {
		t.params.cssMode && _(), t.mousewheel.enabled && v();
	}), Object.assign(t.mousewheel, {
		enable: _,
		disable: v
	});
}
//#endregion
//#region node_modules/swiper/shared/create-element-if-not-defined.mjs
function sd(e, t, n, r) {
	return e.params.createElements && Object.keys(r).forEach((i) => {
		if (!n[i] && n.auto === !0) {
			let a = xl(e.el, `.${r[i]}`)[0];
			a || (a = Sl("div", r[i]), a.className = r[i], e.el.append(a)), n[i] = a, t[i] = a;
		}
	}), n;
}
//#endregion
//#region node_modules/swiper/modules/navigation.mjs
function cd(e) {
	let { swiper: t, extendParams: n, on: r, emit: i } = e;
	n({ navigation: {
		nextEl: null,
		prevEl: null,
		hideOnClick: !1,
		disabledClass: "swiper-button-disabled",
		hiddenClass: "swiper-button-hidden",
		lockClass: "swiper-button-lock",
		navigationDisabledClass: "swiper-navigation-disabled"
	} }), t.navigation = {
		nextEl: null,
		prevEl: null
	};
	let a = (e) => (Array.isArray(e) ? e : [e]).filter((e) => !!e);
	function o(e) {
		let n;
		return e && typeof e == "string" && t.isElement && (n = t.el.querySelector(e), n) ? n : (e && (typeof e == "string" && (n = [...document.querySelectorAll(e)]), t.params.uniqueNavElements && typeof e == "string" && n.length > 1 && t.el.querySelectorAll(e).length === 1 && (n = t.el.querySelector(e))), e && !n ? e : n);
	}
	function s(e, n) {
		let r = t.params.navigation;
		e = a(e), e.forEach((e) => {
			e && (e.classList[n ? "add" : "remove"](...r.disabledClass.split(" ")), e.tagName === "BUTTON" && (e.disabled = n), t.params.watchOverflow && t.enabled && e.classList[t.isLocked ? "add" : "remove"](r.lockClass));
		});
	}
	function c() {
		let { nextEl: e, prevEl: n } = t.navigation;
		if (t.params.loop) {
			s(n, !1), s(e, !1);
			return;
		}
		s(n, t.isBeginning && !t.params.rewind), s(e, t.isEnd && !t.params.rewind);
	}
	function l(e) {
		e.preventDefault(), !(t.isBeginning && !t.params.loop && !t.params.rewind) && (t.slidePrev(), i("navigationPrev"));
	}
	function u(e) {
		e.preventDefault(), !(t.isEnd && !t.params.loop && !t.params.rewind) && (t.slideNext(), i("navigationNext"));
	}
	function d() {
		let e = t.params.navigation;
		if (t.params.navigation = sd(t, t.originalParams.navigation, t.params.navigation, {
			nextEl: "swiper-button-next",
			prevEl: "swiper-button-prev"
		}), !(e.nextEl || e.prevEl)) return;
		let n = o(e.nextEl), r = o(e.prevEl);
		Object.assign(t.navigation, {
			nextEl: n,
			prevEl: r
		}), n = a(n), r = a(r);
		let i = (n, r) => {
			n && n.addEventListener("click", r === "next" ? u : l), !t.enabled && n && n.classList.add(...e.lockClass.split(" "));
		};
		n.forEach((e) => i(e, "next")), r.forEach((e) => i(e, "prev"));
	}
	function f() {
		let { nextEl: e, prevEl: n } = t.navigation;
		e = a(e), n = a(n);
		let r = (e, n) => {
			e.removeEventListener("click", n === "next" ? u : l), e.classList.remove(...t.params.navigation.disabledClass.split(" "));
		};
		e.forEach((e) => r(e, "next")), n.forEach((e) => r(e, "prev"));
	}
	r("init", () => {
		t.params.navigation.enabled === !1 ? m() : (d(), c());
	}), r("toEdge fromEdge lock unlock", () => {
		c();
	}), r("destroy", () => {
		f();
	}), r("enable disable", () => {
		let { nextEl: e, prevEl: n } = t.navigation;
		if (e = a(e), n = a(n), t.enabled) {
			c();
			return;
		}
		[...e, ...n].filter((e) => !!e).forEach((e) => e.classList.add(t.params.navigation.lockClass));
	}), r("click", (e, n) => {
		let { nextEl: r, prevEl: o } = t.navigation;
		r = a(r), o = a(o);
		let s = n.target;
		if (t.params.navigation.hideOnClick && !o.includes(s) && !r.includes(s)) {
			if (t.pagination && t.params.pagination && t.params.pagination.clickable && (t.pagination.el === s || t.pagination.el.contains(s))) return;
			let e;
			r.length ? e = r[0].classList.contains(t.params.navigation.hiddenClass) : o.length && (e = o[0].classList.contains(t.params.navigation.hiddenClass)), i(e === !0 ? "navigationShow" : "navigationHide"), [...r, ...o].filter((e) => !!e).forEach((e) => e.classList.toggle(t.params.navigation.hiddenClass));
		}
	});
	let p = () => {
		t.el.classList.remove(...t.params.navigation.navigationDisabledClass.split(" ")), d(), c();
	}, m = () => {
		t.el.classList.add(...t.params.navigation.navigationDisabledClass.split(" ")), f();
	};
	Object.assign(t.navigation, {
		enable: p,
		disable: m,
		update: c,
		init: d,
		destroy: f
	});
}
//#endregion
//#region node_modules/swiper/shared/classes-to-selector.mjs
function ld(e) {
	return e === void 0 && (e = ""), `.${e.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
}
//#endregion
//#region node_modules/swiper/modules/pagination.mjs
function ud(e) {
	let { swiper: t, extendParams: n, on: r, emit: i } = e, a = "swiper-pagination";
	n({ pagination: {
		el: null,
		bulletElement: "span",
		clickable: !1,
		hideOnClick: !1,
		renderBullet: null,
		renderProgressbar: null,
		renderFraction: null,
		renderCustom: null,
		progressbarOpposite: !1,
		type: "bullets",
		dynamicBullets: !1,
		dynamicMainBullets: 1,
		formatFractionCurrent: (e) => e,
		formatFractionTotal: (e) => e,
		bulletClass: `${a}-bullet`,
		bulletActiveClass: `${a}-bullet-active`,
		modifierClass: `${a}-`,
		currentClass: `${a}-current`,
		totalClass: `${a}-total`,
		hiddenClass: `${a}-hidden`,
		progressbarFillClass: `${a}-progressbar-fill`,
		progressbarOppositeClass: `${a}-progressbar-opposite`,
		clickableClass: `${a}-clickable`,
		lockClass: `${a}-lock`,
		horizontalClass: `${a}-horizontal`,
		verticalClass: `${a}-vertical`,
		paginationDisabledClass: `${a}-disabled`
	} }), t.pagination = {
		el: null,
		bullets: []
	};
	let o, s = 0, c = (e) => (Array.isArray(e) ? e : [e]).filter((e) => !!e);
	function l() {
		return !t.params.pagination.el || !t.pagination.el || Array.isArray(t.pagination.el) && t.pagination.el.length === 0;
	}
	function u(e, n) {
		let { bulletActiveClass: r } = t.params.pagination;
		e && (e = e[`${n === "prev" ? "previous" : "next"}ElementSibling`], e && (e.classList.add(`${r}-${n}`), e = e[`${n === "prev" ? "previous" : "next"}ElementSibling`], e && e.classList.add(`${r}-${n}-${n}`)));
	}
	function d(e) {
		let n = e.target.closest(ld(t.params.pagination.bulletClass));
		if (!n) return;
		e.preventDefault();
		let r = Dl(n) * t.params.slidesPerGroup;
		if (t.params.loop) {
			if (t.realIndex === r) return;
			let e = t.realIndex, n = t.getSlideIndexByData(r), i = t.getSlideIndexByData(t.realIndex), a = (r) => {
				let i = t.activeIndex;
				t.loopFix({
					direction: r,
					activeSlideIndex: n,
					slideTo: !1
				}), i === t.activeIndex && t.slideToLoop(e, 0, !1, !0);
			};
			if (n > t.slides.length - t.loopedSlides) a(n > i ? "next" : "prev");
			else if (t.params.centeredSlides) {
				let e = t.params.slidesPerView === "auto" ? t.slidesPerViewDynamic() : Math.ceil(parseFloat(t.params.slidesPerView, 10));
				n < Math.floor(e / 2) && a("prev");
			}
			t.slideToLoop(r);
		} else t.slideTo(r);
	}
	function f() {
		let e = t.rtl, n = t.params.pagination;
		if (l()) return;
		let r = t.pagination.el;
		r = c(r);
		let a, d, f = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length, p = t.params.loop ? Math.ceil(f / t.params.slidesPerGroup) : t.snapGrid.length;
		if (t.params.loop ? (d = t.previousRealIndex || 0, a = t.params.slidesPerGroup > 1 ? Math.floor(t.realIndex / t.params.slidesPerGroup) : t.realIndex) : t.snapIndex === void 0 ? (d = t.previousIndex || 0, a = t.activeIndex || 0) : (a = t.snapIndex, d = t.previousSnapIndex), n.type === "bullets" && t.pagination.bullets && t.pagination.bullets.length > 0) {
			let i = t.pagination.bullets, c, l, f;
			if (n.dynamicBullets && (o = Al(i[0], t.isHorizontal() ? "width" : "height", !0), r.forEach((e) => {
				e.style[t.isHorizontal() ? "width" : "height"] = `${o * (n.dynamicMainBullets + 4)}px`;
			}), n.dynamicMainBullets > 1 && d !== void 0 && (s += a - (d || 0), s > n.dynamicMainBullets - 1 ? s = n.dynamicMainBullets - 1 : s < 0 && (s = 0)), c = Math.max(a - s, 0), l = c + (Math.min(i.length, n.dynamicMainBullets) - 1), f = (l + c) / 2), i.forEach((e) => {
				let t = [...[
					"",
					"-next",
					"-next-next",
					"-prev",
					"-prev-prev",
					"-main"
				].map((e) => `${n.bulletActiveClass}${e}`)].map((e) => typeof e == "string" && e.includes(" ") ? e.split(" ") : e).flat();
				e.classList.remove(...t);
			}), r.length > 1) i.forEach((e) => {
				let r = Dl(e);
				r === a ? e.classList.add(...n.bulletActiveClass.split(" ")) : t.isElement && e.setAttribute("part", "bullet"), n.dynamicBullets && (r >= c && r <= l && e.classList.add(...`${n.bulletActiveClass}-main`.split(" ")), r === c && u(e, "prev"), r === l && u(e, "next"));
			});
			else {
				let e = i[a];
				if (e && e.classList.add(...n.bulletActiveClass.split(" ")), t.isElement && i.forEach((e, t) => {
					e.setAttribute("part", t === a ? "bullet-active" : "bullet");
				}), n.dynamicBullets) {
					let e = i[c], t = i[l];
					for (let e = c; e <= l; e += 1) i[e] && i[e].classList.add(...`${n.bulletActiveClass}-main`.split(" "));
					u(e, "prev"), u(t, "next");
				}
			}
			if (n.dynamicBullets) {
				let r = Math.min(i.length, n.dynamicMainBullets + 4), a = (o * r - o) / 2 - f * o, s = e ? "right" : "left";
				i.forEach((e) => {
					e.style[t.isHorizontal() ? s : "top"] = `${a}px`;
				});
			}
		}
		r.forEach((e, r) => {
			if (n.type === "fraction" && (e.querySelectorAll(ld(n.currentClass)).forEach((e) => {
				e.textContent = n.formatFractionCurrent(a + 1);
			}), e.querySelectorAll(ld(n.totalClass)).forEach((e) => {
				e.textContent = n.formatFractionTotal(p);
			})), n.type === "progressbar") {
				let r;
				r = n.progressbarOpposite ? t.isHorizontal() ? "vertical" : "horizontal" : t.isHorizontal() ? "horizontal" : "vertical";
				let i = (a + 1) / p, o = 1, s = 1;
				r === "horizontal" ? o = i : s = i, e.querySelectorAll(ld(n.progressbarFillClass)).forEach((e) => {
					e.style.transform = `translate3d(0,0,0) scaleX(${o}) scaleY(${s})`, e.style.transitionDuration = `${t.params.speed}ms`;
				});
			}
			n.type === "custom" && n.renderCustom ? (e.innerHTML = n.renderCustom(t, a + 1, p), r === 0 && i("paginationRender", e)) : (r === 0 && i("paginationRender", e), i("paginationUpdate", e)), t.params.watchOverflow && t.enabled && e.classList[t.isLocked ? "add" : "remove"](n.lockClass);
		});
	}
	function p() {
		let e = t.params.pagination;
		if (l()) return;
		let n = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length, r = t.pagination.el;
		r = c(r);
		let a = "";
		if (e.type === "bullets") {
			let r = t.params.loop ? Math.ceil(n / t.params.slidesPerGroup) : t.snapGrid.length;
			t.params.freeMode && t.params.freeMode.enabled && r > n && (r = n);
			for (let n = 0; n < r; n += 1) e.renderBullet ? a += e.renderBullet.call(t, n, e.bulletClass) : a += `<${e.bulletElement} ${t.isElement ? "part=\"bullet\"" : ""} class="${e.bulletClass}"></${e.bulletElement}>`;
		}
		e.type === "fraction" && (a = e.renderFraction ? e.renderFraction.call(t, e.currentClass, e.totalClass) : `<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`), e.type === "progressbar" && (a = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : `<span class="${e.progressbarFillClass}"></span>`), t.pagination.bullets = [], r.forEach((n) => {
			e.type !== "custom" && (n.innerHTML = a || ""), e.type === "bullets" && t.pagination.bullets.push(...n.querySelectorAll(ld(e.bulletClass)));
		}), e.type !== "custom" && i("paginationRender", r[0]);
	}
	function m() {
		t.params.pagination = sd(t, t.originalParams.pagination, t.params.pagination, { el: "swiper-pagination" });
		let e = t.params.pagination;
		if (!e.el) return;
		let n;
		typeof e.el == "string" && t.isElement && (n = t.el.querySelector(e.el)), !n && typeof e.el == "string" && (n = [...document.querySelectorAll(e.el)]), n ||= e.el, !(!n || n.length === 0) && (t.params.uniqueNavElements && typeof e.el == "string" && Array.isArray(n) && n.length > 1 && (n = [...t.el.querySelectorAll(e.el)], n.length > 1 && (n = n.filter((e) => Ol(e, ".swiper")[0] === t.el)[0])), Array.isArray(n) && n.length === 1 && (n = n[0]), Object.assign(t.pagination, { el: n }), n = c(n), n.forEach((n) => {
			e.type === "bullets" && e.clickable && n.classList.add(...(e.clickableClass || "").split(" ")), n.classList.add(e.modifierClass + e.type), n.classList.add(t.isHorizontal() ? e.horizontalClass : e.verticalClass), e.type === "bullets" && e.dynamicBullets && (n.classList.add(`${e.modifierClass}${e.type}-dynamic`), s = 0, e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)), e.type === "progressbar" && e.progressbarOpposite && n.classList.add(e.progressbarOppositeClass), e.clickable && n.addEventListener("click", d), t.enabled || n.classList.add(e.lockClass);
		}));
	}
	function h() {
		let e = t.params.pagination;
		if (l()) return;
		let n = t.pagination.el;
		n && (n = c(n), n.forEach((n) => {
			n.classList.remove(e.hiddenClass), n.classList.remove(e.modifierClass + e.type), n.classList.remove(t.isHorizontal() ? e.horizontalClass : e.verticalClass), e.clickable && (n.classList.remove(...(e.clickableClass || "").split(" ")), n.removeEventListener("click", d));
		})), t.pagination.bullets && t.pagination.bullets.forEach((t) => t.classList.remove(...e.bulletActiveClass.split(" ")));
	}
	r("changeDirection", () => {
		if (!t.pagination || !t.pagination.el) return;
		let e = t.params.pagination, { el: n } = t.pagination;
		n = c(n), n.forEach((n) => {
			n.classList.remove(e.horizontalClass, e.verticalClass), n.classList.add(t.isHorizontal() ? e.horizontalClass : e.verticalClass);
		});
	}), r("init", () => {
		t.params.pagination.enabled === !1 ? _() : (m(), p(), f());
	}), r("activeIndexChange", () => {
		t.snapIndex === void 0 && f();
	}), r("snapIndexChange", () => {
		f();
	}), r("snapGridLengthChange", () => {
		p(), f();
	}), r("destroy", () => {
		h();
	}), r("enable disable", () => {
		let { el: e } = t.pagination;
		e && (e = c(e), e.forEach((e) => e.classList[t.enabled ? "remove" : "add"](t.params.pagination.lockClass)));
	}), r("lock unlock", () => {
		f();
	}), r("click", (e, n) => {
		let r = n.target, a = c(t.pagination.el);
		if (t.params.pagination.el && t.params.pagination.hideOnClick && a && a.length > 0 && !r.classList.contains(t.params.pagination.bulletClass)) {
			if (t.navigation && (t.navigation.nextEl && r === t.navigation.nextEl || t.navigation.prevEl && r === t.navigation.prevEl)) return;
			a[0].classList.contains(t.params.pagination.hiddenClass) === !0 ? i("paginationShow") : i("paginationHide"), a.forEach((e) => e.classList.toggle(t.params.pagination.hiddenClass));
		}
	});
	let g = () => {
		t.el.classList.remove(t.params.pagination.paginationDisabledClass);
		let { el: e } = t.pagination;
		e && (e = c(e), e.forEach((e) => e.classList.remove(t.params.pagination.paginationDisabledClass))), m(), p(), f();
	}, _ = () => {
		t.el.classList.add(t.params.pagination.paginationDisabledClass);
		let { el: e } = t.pagination;
		e && (e = c(e), e.forEach((e) => e.classList.add(t.params.pagination.paginationDisabledClass))), h();
	};
	Object.assign(t.pagination, {
		enable: g,
		disable: _,
		render: p,
		update: f,
		init: m,
		destroy: h
	});
}
//#endregion
//#region node_modules/swiper/modules/scrollbar.mjs
function dd(e) {
	let { swiper: t, extendParams: n, on: r, emit: i } = e, a = sl(), o = !1, s = null, c = null, l, u, d, f;
	n({ scrollbar: {
		el: null,
		dragSize: "auto",
		hide: !1,
		draggable: !1,
		snapOnRelease: !0,
		lockClass: "swiper-scrollbar-lock",
		dragClass: "swiper-scrollbar-drag",
		scrollbarDisabledClass: "swiper-scrollbar-disabled",
		horizontalClass: "swiper-scrollbar-horizontal",
		verticalClass: "swiper-scrollbar-vertical"
	} }), t.scrollbar = {
		el: null,
		dragEl: null
	};
	function p() {
		if (!t.params.scrollbar.el || !t.scrollbar.el) return;
		let { scrollbar: e, rtlTranslate: n } = t, { dragEl: r, el: i } = e, a = t.params.scrollbar, o = t.params.loop ? t.progressLoop : t.progress, c = u, l = (d - u) * o;
		n ? (l = -l, l > 0 ? (c = u - l, l = 0) : -l + u > d && (c = d + l)) : l < 0 ? (c = u + l, l = 0) : l + u > d && (c = d - l), t.isHorizontal() ? (r.style.transform = `translate3d(${l}px, 0, 0)`, r.style.width = `${c}px`) : (r.style.transform = `translate3d(0px, ${l}px, 0)`, r.style.height = `${c}px`), a.hide && (clearTimeout(s), i.style.opacity = 1, s = setTimeout(() => {
			i.style.opacity = 0, i.style.transitionDuration = "400ms";
		}, 1e3));
	}
	function m(e) {
		!t.params.scrollbar.el || !t.scrollbar.el || (t.scrollbar.dragEl.style.transitionDuration = `${e}ms`);
	}
	function h() {
		if (!t.params.scrollbar.el || !t.scrollbar.el) return;
		let { scrollbar: e } = t, { dragEl: n, el: r } = e;
		n.style.width = "", n.style.height = "", d = t.isHorizontal() ? r.offsetWidth : r.offsetHeight, f = t.size / (t.virtualSize + t.params.slidesOffsetBefore - (t.params.centeredSlides ? t.snapGrid[0] : 0)), u = t.params.scrollbar.dragSize === "auto" ? d * f : parseInt(t.params.scrollbar.dragSize, 10), t.isHorizontal() ? n.style.width = `${u}px` : n.style.height = `${u}px`, f >= 1 ? r.style.display = "none" : r.style.display = "", t.params.scrollbar.hide && (r.style.opacity = 0), t.params.watchOverflow && t.enabled && e.el.classList[t.isLocked ? "add" : "remove"](t.params.scrollbar.lockClass);
	}
	function g(e) {
		return t.isHorizontal() ? e.clientX : e.clientY;
	}
	function _(e) {
		let { scrollbar: n, rtlTranslate: r } = t, { el: i } = n, a;
		a = (g(e) - Cl(i)[t.isHorizontal() ? "left" : "top"] - (l === null ? u / 2 : l)) / (d - u), a = Math.max(Math.min(a, 1), 0), r && (a = 1 - a);
		let o = t.minTranslate() + (t.maxTranslate() - t.minTranslate()) * a;
		t.updateProgress(o), t.setTranslate(o), t.updateActiveIndex(), t.updateSlidesClasses();
	}
	function v(e) {
		let n = t.params.scrollbar, { scrollbar: r, wrapperEl: a } = t, { el: s, dragEl: u } = r;
		o = !0, l = e.target === u ? g(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? "left" : "top"] : null, e.preventDefault(), e.stopPropagation(), a.style.transitionDuration = "100ms", u.style.transitionDuration = "100ms", _(e), clearTimeout(c), s.style.transitionDuration = "0ms", n.hide && (s.style.opacity = 1), t.params.cssMode && (t.wrapperEl.style["scroll-snap-type"] = "none"), i("scrollbarDragStart", e);
	}
	function y(e) {
		let { scrollbar: n, wrapperEl: r } = t, { el: a, dragEl: s } = n;
		o && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, _(e), r.style.transitionDuration = "0ms", a.style.transitionDuration = "0ms", s.style.transitionDuration = "0ms", i("scrollbarDragMove", e));
	}
	function b(e) {
		let n = t.params.scrollbar, { scrollbar: r, wrapperEl: a } = t, { el: s } = r;
		o && (o = !1, t.params.cssMode && (t.wrapperEl.style["scroll-snap-type"] = "", a.style.transitionDuration = ""), n.hide && (clearTimeout(c), c = dl(() => {
			s.style.opacity = 0, s.style.transitionDuration = "400ms";
		}, 1e3)), i("scrollbarDragEnd", e), n.snapOnRelease && t.slideToClosest());
	}
	function x(e) {
		let { scrollbar: n, params: r } = t, i = n.el;
		if (!i) return;
		let o = i, s = r.passiveListeners ? {
			passive: !1,
			capture: !1
		} : !1, c = r.passiveListeners ? {
			passive: !0,
			capture: !1
		} : !1;
		if (!o) return;
		let l = e === "on" ? "addEventListener" : "removeEventListener";
		o[l]("pointerdown", v, s), a[l]("pointermove", y, s), a[l]("pointerup", b, c);
	}
	function S() {
		!t.params.scrollbar.el || !t.scrollbar.el || x("on");
	}
	function C() {
		!t.params.scrollbar.el || !t.scrollbar.el || x("off");
	}
	function w() {
		let { scrollbar: e, el: n } = t;
		t.params.scrollbar = sd(t, t.originalParams.scrollbar, t.params.scrollbar, { el: "swiper-scrollbar" });
		let r = t.params.scrollbar;
		if (!r.el) return;
		let i;
		typeof r.el == "string" && t.isElement && (i = t.el.querySelector(r.el)), !i && typeof r.el == "string" ? i = a.querySelectorAll(r.el) : i ||= r.el, t.params.uniqueNavElements && typeof r.el == "string" && i.length > 1 && n.querySelectorAll(r.el).length === 1 && (i = n.querySelector(r.el)), i.length > 0 && (i = i[0]), i.classList.add(t.isHorizontal() ? r.horizontalClass : r.verticalClass);
		let o;
		i && (o = i.querySelector(`.${t.params.scrollbar.dragClass}`), o || (o = Sl("div", t.params.scrollbar.dragClass), i.append(o))), Object.assign(e, {
			el: i,
			dragEl: o
		}), r.draggable && S(), i && i.classList[t.enabled ? "remove" : "add"](t.params.scrollbar.lockClass);
	}
	function T() {
		let e = t.params.scrollbar, n = t.scrollbar.el;
		n && n.classList.remove(t.isHorizontal() ? e.horizontalClass : e.verticalClass), C();
	}
	r("init", () => {
		t.params.scrollbar.enabled === !1 ? D() : (w(), h(), p());
	}), r("update resize observerUpdate lock unlock", () => {
		h();
	}), r("setTranslate", () => {
		p();
	}), r("setTransition", (e, t) => {
		m(t);
	}), r("enable disable", () => {
		let { el: e } = t.scrollbar;
		e && e.classList[t.enabled ? "remove" : "add"](t.params.scrollbar.lockClass);
	}), r("destroy", () => {
		T();
	});
	let E = () => {
		t.el.classList.remove(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.el && t.scrollbar.el.classList.remove(t.params.scrollbar.scrollbarDisabledClass), w(), h(), p();
	}, D = () => {
		t.el.classList.add(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.el && t.scrollbar.el.classList.add(t.params.scrollbar.scrollbarDisabledClass), T();
	};
	Object.assign(t.scrollbar, {
		enable: E,
		disable: D,
		updateSize: h,
		setTranslate: p,
		init: w,
		destroy: T
	});
}
//#endregion
//#region node_modules/swiper/modules/parallax.mjs
function fd(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ parallax: { enabled: !1 } });
	let i = "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]", a = (e, n) => {
		let { rtl: r } = t, i = r ? -1 : 1, a = e.getAttribute("data-swiper-parallax") || "0", o = e.getAttribute("data-swiper-parallax-x"), s = e.getAttribute("data-swiper-parallax-y"), c = e.getAttribute("data-swiper-parallax-scale"), l = e.getAttribute("data-swiper-parallax-opacity"), u = e.getAttribute("data-swiper-parallax-rotate");
		if (o || s ? (o ||= "0", s ||= "0") : t.isHorizontal() ? (o = a, s = "0") : (s = a, o = "0"), o = o.indexOf("%") >= 0 ? `${parseInt(o, 10) * n * i}%` : `${o * n * i}px`, s = s.indexOf("%") >= 0 ? `${parseInt(s, 10) * n}%` : `${s * n}px`, l != null) {
			let t = l - (l - 1) * (1 - Math.abs(n));
			e.style.opacity = t;
		}
		let d = `translate3d(${o}, ${s}, 0px)`;
		if (c != null) {
			let e = c - (c - 1) * (1 - Math.abs(n));
			d += ` scale(${e})`;
		}
		if (u && u != null) {
			let e = u * n * -1;
			d += ` rotate(${e}deg)`;
		}
		e.style.transform = d;
	}, o = () => {
		let { el: e, slides: n, progress: r, snapGrid: o, isElement: s } = t, c = xl(e, i);
		t.isElement && c.push(...xl(t.hostEl, i)), c.forEach((e) => {
			a(e, r);
		}), n.forEach((e, n) => {
			let s = e.progress;
			t.params.slidesPerGroup > 1 && t.params.slidesPerView !== "auto" && (s += Math.ceil(n / 2) - r * (o.length - 1)), s = Math.min(Math.max(s, -1), 1), e.querySelectorAll(`${i}, [data-swiper-parallax-rotate]`).forEach((e) => {
				a(e, s);
			});
		});
	}, s = function(e) {
		e === void 0 && (e = t.params.speed);
		let { el: n, hostEl: r } = t, a = [...n.querySelectorAll(i)];
		t.isElement && a.push(...r.querySelectorAll(i)), a.forEach((t) => {
			let n = parseInt(t.getAttribute("data-swiper-parallax-duration"), 10) || e;
			e === 0 && (n = 0), t.style.transitionDuration = `${n}ms`;
		});
	};
	r("beforeInit", () => {
		t.params.parallax.enabled && (t.params.watchSlidesProgress = !0, t.originalParams.watchSlidesProgress = !0);
	}), r("init", () => {
		t.params.parallax.enabled && o();
	}), r("setTranslate", () => {
		t.params.parallax.enabled && o();
	}), r("setTransition", (e, n) => {
		t.params.parallax.enabled && s(n);
	});
}
//#endregion
//#region node_modules/swiper/modules/zoom.mjs
function pd(e) {
	let { swiper: t, extendParams: n, on: r, emit: i } = e, a = ll();
	n({ zoom: {
		enabled: !1,
		maxRatio: 3,
		minRatio: 1,
		toggle: !0,
		containerClass: "swiper-zoom-container",
		zoomedSlideClass: "swiper-slide-zoomed"
	} }), t.zoom = { enabled: !1 };
	let o = 1, s = !1, c, l, u = [], d = {
		originX: 0,
		originY: 0,
		slideEl: void 0,
		slideWidth: void 0,
		slideHeight: void 0,
		imageEl: void 0,
		imageWrapEl: void 0,
		maxRatio: 3
	}, f = {
		isTouched: void 0,
		isMoved: void 0,
		currentX: void 0,
		currentY: void 0,
		minX: void 0,
		minY: void 0,
		maxX: void 0,
		maxY: void 0,
		width: void 0,
		height: void 0,
		startX: void 0,
		startY: void 0,
		touchesStart: {},
		touchesCurrent: {}
	}, p = {
		x: void 0,
		y: void 0,
		prevPositionX: void 0,
		prevPositionY: void 0,
		prevTime: void 0
	}, m = 1;
	Object.defineProperty(t.zoom, "scale", {
		get() {
			return m;
		},
		set(e) {
			if (m !== e) {
				let t = d.imageEl, n = d.slideEl;
				i("zoomChange", e, t, n);
			}
			m = e;
		}
	});
	function h() {
		if (u.length < 2) return 1;
		let e = u[0].pageX, t = u[0].pageY, n = u[1].pageX, r = u[1].pageY;
		return Math.sqrt((n - e) ** 2 + (r - t) ** 2);
	}
	function g() {
		if (u.length < 2) return {
			x: null,
			y: null
		};
		let e = d.imageEl.getBoundingClientRect();
		return [(u[0].pageX + (u[1].pageX - u[0].pageX) / 2 - e.x - a.scrollX) / o, (u[0].pageY + (u[1].pageY - u[0].pageY) / 2 - e.y - a.scrollY) / o];
	}
	function _() {
		return t.isElement ? "swiper-slide" : `.${t.params.slideClass}`;
	}
	function v(e) {
		let n = _();
		return !!(e.target.matches(n) || t.slides.filter((t) => t.contains(e.target)).length > 0);
	}
	function y(e) {
		let n = `.${t.params.zoom.containerClass}`;
		return !!(e.target.matches(n) || [...t.hostEl.querySelectorAll(n)].filter((t) => t.contains(e.target)).length > 0);
	}
	function b(e) {
		if (e.pointerType === "mouse" && u.splice(0, u.length), !v(e)) return;
		let n = t.params.zoom;
		if (c = !1, l = !1, u.push(e), !(u.length < 2)) {
			if (c = !0, d.scaleStart = h(), !d.slideEl) {
				d.slideEl = e.target.closest(`.${t.params.slideClass}, swiper-slide`), d.slideEl ||= t.slides[t.activeIndex];
				let r = d.slideEl.querySelector(`.${n.containerClass}`);
				if (r &&= r.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0], d.imageEl = r, r ? d.imageWrapEl = Ol(d.imageEl, `.${n.containerClass}`)[0] : d.imageWrapEl = void 0, !d.imageWrapEl) {
					d.imageEl = void 0;
					return;
				}
				d.maxRatio = d.imageWrapEl.getAttribute("data-swiper-zoom") || n.maxRatio;
			}
			if (d.imageEl) {
				let [e, t] = g();
				d.originX = e, d.originY = t, d.imageEl.style.transitionDuration = "0ms";
			}
			s = !0;
		}
	}
	function x(e) {
		if (!v(e)) return;
		let n = t.params.zoom, r = t.zoom, i = u.findIndex((t) => t.pointerId === e.pointerId);
		i >= 0 && (u[i] = e), !(u.length < 2) && (l = !0, d.scaleMove = h(), d.imageEl && (r.scale = d.scaleMove / d.scaleStart * o, r.scale > d.maxRatio && (r.scale = d.maxRatio - 1 + (r.scale - d.maxRatio + 1) ** .5), r.scale < n.minRatio && (r.scale = n.minRatio + 1 - (n.minRatio - r.scale + 1) ** .5), d.imageEl.style.transform = `translate3d(0,0,0) scale(${r.scale})`));
	}
	function S(e) {
		if (!v(e) || e.pointerType === "mouse" && e.type === "pointerout") return;
		let n = t.params.zoom, r = t.zoom, i = u.findIndex((t) => t.pointerId === e.pointerId);
		i >= 0 && u.splice(i, 1), !(!c || !l) && (c = !1, l = !1, d.imageEl && (r.scale = Math.max(Math.min(r.scale, d.maxRatio), n.minRatio), d.imageEl.style.transitionDuration = `${t.params.speed}ms`, d.imageEl.style.transform = `translate3d(0,0,0) scale(${r.scale})`, o = r.scale, s = !1, r.scale > 1 && d.slideEl ? d.slideEl.classList.add(`${n.zoomedSlideClass}`) : r.scale <= 1 && d.slideEl && d.slideEl.classList.remove(`${n.zoomedSlideClass}`), r.scale === 1 && (d.originX = 0, d.originY = 0, d.slideEl = void 0)));
	}
	function C(e) {
		let n = t.device;
		if (!d.imageEl || f.isTouched) return;
		n.android && e.cancelable && e.preventDefault(), f.isTouched = !0;
		let r = u.length > 0 ? u[0] : e;
		f.touchesStart.x = r.pageX, f.touchesStart.y = r.pageY;
	}
	function w(e) {
		if (!v(e) || !y(e)) return;
		let n = t.zoom;
		if (!d.imageEl || !f.isTouched || !d.slideEl) return;
		f.isMoved || (f.width = d.imageEl.offsetWidth, f.height = d.imageEl.offsetHeight, f.startX = ml(d.imageWrapEl, "x") || 0, f.startY = ml(d.imageWrapEl, "y") || 0, d.slideWidth = d.slideEl.offsetWidth, d.slideHeight = d.slideEl.offsetHeight, d.imageWrapEl.style.transitionDuration = "0ms");
		let r = f.width * n.scale, i = f.height * n.scale;
		if (r < d.slideWidth && i < d.slideHeight) return;
		if (f.minX = Math.min(d.slideWidth / 2 - r / 2, 0), f.maxX = -f.minX, f.minY = Math.min(d.slideHeight / 2 - i / 2, 0), f.maxY = -f.minY, f.touchesCurrent.x = u.length > 0 ? u[0].pageX : e.pageX, f.touchesCurrent.y = u.length > 0 ? u[0].pageY : e.pageY, Math.max(Math.abs(f.touchesCurrent.x - f.touchesStart.x), Math.abs(f.touchesCurrent.y - f.touchesStart.y)) > 5 && (t.allowClick = !1), !f.isMoved && !s) {
			if (t.isHorizontal() && (Math.floor(f.minX) === Math.floor(f.startX) && f.touchesCurrent.x < f.touchesStart.x || Math.floor(f.maxX) === Math.floor(f.startX) && f.touchesCurrent.x > f.touchesStart.x)) {
				f.isTouched = !1;
				return;
			}
			if (!t.isHorizontal() && (Math.floor(f.minY) === Math.floor(f.startY) && f.touchesCurrent.y < f.touchesStart.y || Math.floor(f.maxY) === Math.floor(f.startY) && f.touchesCurrent.y > f.touchesStart.y)) {
				f.isTouched = !1;
				return;
			}
		}
		e.cancelable && e.preventDefault(), e.stopPropagation(), f.isMoved = !0;
		let a = (n.scale - o) / (d.maxRatio - t.params.zoom.minRatio), { originX: c, originY: l } = d;
		f.currentX = f.touchesCurrent.x - f.touchesStart.x + f.startX + a * (f.width - c * 2), f.currentY = f.touchesCurrent.y - f.touchesStart.y + f.startY + a * (f.height - l * 2), f.currentX < f.minX && (f.currentX = f.minX + 1 - (f.minX - f.currentX + 1) ** .8), f.currentX > f.maxX && (f.currentX = f.maxX - 1 + (f.currentX - f.maxX + 1) ** .8), f.currentY < f.minY && (f.currentY = f.minY + 1 - (f.minY - f.currentY + 1) ** .8), f.currentY > f.maxY && (f.currentY = f.maxY - 1 + (f.currentY - f.maxY + 1) ** .8), p.prevPositionX ||= f.touchesCurrent.x, p.prevPositionY ||= f.touchesCurrent.y, p.prevTime ||= Date.now(), p.x = (f.touchesCurrent.x - p.prevPositionX) / (Date.now() - p.prevTime) / 2, p.y = (f.touchesCurrent.y - p.prevPositionY) / (Date.now() - p.prevTime) / 2, Math.abs(f.touchesCurrent.x - p.prevPositionX) < 2 && (p.x = 0), Math.abs(f.touchesCurrent.y - p.prevPositionY) < 2 && (p.y = 0), p.prevPositionX = f.touchesCurrent.x, p.prevPositionY = f.touchesCurrent.y, p.prevTime = Date.now(), d.imageWrapEl.style.transform = `translate3d(${f.currentX}px, ${f.currentY}px,0)`;
	}
	function T() {
		let e = t.zoom;
		if (!d.imageEl) return;
		if (!f.isTouched || !f.isMoved) {
			f.isTouched = !1, f.isMoved = !1;
			return;
		}
		f.isTouched = !1, f.isMoved = !1;
		let n = 300, r = 300, i = p.x * n, a = f.currentX + i, o = p.y * r, s = f.currentY + o;
		p.x !== 0 && (n = Math.abs((a - f.currentX) / p.x)), p.y !== 0 && (r = Math.abs((s - f.currentY) / p.y));
		let c = Math.max(n, r);
		f.currentX = a, f.currentY = s;
		let l = f.width * e.scale, u = f.height * e.scale;
		f.minX = Math.min(d.slideWidth / 2 - l / 2, 0), f.maxX = -f.minX, f.minY = Math.min(d.slideHeight / 2 - u / 2, 0), f.maxY = -f.minY, f.currentX = Math.max(Math.min(f.currentX, f.maxX), f.minX), f.currentY = Math.max(Math.min(f.currentY, f.maxY), f.minY), d.imageWrapEl.style.transitionDuration = `${c}ms`, d.imageWrapEl.style.transform = `translate3d(${f.currentX}px, ${f.currentY}px,0)`;
	}
	function E() {
		let e = t.zoom;
		d.slideEl && t.activeIndex !== t.slides.indexOf(d.slideEl) && (d.imageEl && (d.imageEl.style.transform = "translate3d(0,0,0) scale(1)"), d.imageWrapEl && (d.imageWrapEl.style.transform = "translate3d(0,0,0)"), d.slideEl.classList.remove(`${t.params.zoom.zoomedSlideClass}`), e.scale = 1, o = 1, d.slideEl = void 0, d.imageEl = void 0, d.imageWrapEl = void 0, d.originX = 0, d.originY = 0);
	}
	function D(e) {
		let n = t.zoom, r = t.params.zoom;
		if (!d.slideEl) {
			e && e.target && (d.slideEl = e.target.closest(`.${t.params.slideClass}, swiper-slide`)), d.slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? d.slideEl = xl(t.slidesEl, `.${t.params.slideActiveClass}`)[0] : d.slideEl = t.slides[t.activeIndex]);
			let n = d.slideEl.querySelector(`.${r.containerClass}`);
			n &&= n.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0], d.imageEl = n, n ? d.imageWrapEl = Ol(d.imageEl, `.${r.containerClass}`)[0] : d.imageWrapEl = void 0;
		}
		if (!d.imageEl || !d.imageWrapEl) return;
		t.params.cssMode && (t.wrapperEl.style.overflow = "hidden", t.wrapperEl.style.touchAction = "none"), d.slideEl.classList.add(`${r.zoomedSlideClass}`);
		let i, s, c, l, u, p, m, h, g, _, v, y, b, x, S, C, w, T;
		f.touchesStart.x === void 0 && e ? (i = e.pageX, s = e.pageY) : (i = f.touchesStart.x, s = f.touchesStart.y);
		let E = typeof e == "number" ? e : null;
		o === 1 && E && (i = void 0, s = void 0), n.scale = E || d.imageWrapEl.getAttribute("data-swiper-zoom") || r.maxRatio, o = E || d.imageWrapEl.getAttribute("data-swiper-zoom") || r.maxRatio, e && !(o === 1 && E) ? (w = d.slideEl.offsetWidth, T = d.slideEl.offsetHeight, c = Cl(d.slideEl).left + a.scrollX, l = Cl(d.slideEl).top + a.scrollY, u = c + w / 2 - i, p = l + T / 2 - s, g = d.imageEl.offsetWidth, _ = d.imageEl.offsetHeight, v = g * n.scale, y = _ * n.scale, b = Math.min(w / 2 - v / 2, 0), x = Math.min(T / 2 - y / 2, 0), S = -b, C = -x, m = u * n.scale, h = p * n.scale, m < b && (m = b), m > S && (m = S), h < x && (h = x), h > C && (h = C)) : (m = 0, h = 0), E && n.scale === 1 && (d.originX = 0, d.originY = 0), d.imageWrapEl.style.transitionDuration = "300ms", d.imageWrapEl.style.transform = `translate3d(${m}px, ${h}px,0)`, d.imageEl.style.transitionDuration = "300ms", d.imageEl.style.transform = `translate3d(0,0,0) scale(${n.scale})`;
	}
	function O() {
		let e = t.zoom, n = t.params.zoom;
		if (!d.slideEl) {
			t.params.virtual && t.params.virtual.enabled && t.virtual ? d.slideEl = xl(t.slidesEl, `.${t.params.slideActiveClass}`)[0] : d.slideEl = t.slides[t.activeIndex];
			let e = d.slideEl.querySelector(`.${n.containerClass}`);
			e &&= e.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0], d.imageEl = e, e ? d.imageWrapEl = Ol(d.imageEl, `.${n.containerClass}`)[0] : d.imageWrapEl = void 0;
		}
		!d.imageEl || !d.imageWrapEl || (t.params.cssMode && (t.wrapperEl.style.overflow = "", t.wrapperEl.style.touchAction = ""), e.scale = 1, o = 1, d.imageWrapEl.style.transitionDuration = "300ms", d.imageWrapEl.style.transform = "translate3d(0,0,0)", d.imageEl.style.transitionDuration = "300ms", d.imageEl.style.transform = "translate3d(0,0,0) scale(1)", d.slideEl.classList.remove(`${n.zoomedSlideClass}`), d.slideEl = void 0, d.originX = 0, d.originY = 0);
	}
	function k(e) {
		let n = t.zoom;
		n.scale && n.scale !== 1 ? O() : D(e);
	}
	function A() {
		return {
			passiveListener: t.params.passiveListeners ? {
				passive: !0,
				capture: !1
			} : !1,
			activeListenerWithCapture: t.params.passiveListeners ? {
				passive: !1,
				capture: !0
			} : !0
		};
	}
	function j() {
		let e = t.zoom;
		if (e.enabled) return;
		e.enabled = !0;
		let { passiveListener: n, activeListenerWithCapture: r } = A();
		t.wrapperEl.addEventListener("pointerdown", b, n), t.wrapperEl.addEventListener("pointermove", x, r), [
			"pointerup",
			"pointercancel",
			"pointerout"
		].forEach((e) => {
			t.wrapperEl.addEventListener(e, S, n);
		}), t.wrapperEl.addEventListener("pointermove", w, r);
	}
	function M() {
		let e = t.zoom;
		if (!e.enabled) return;
		e.enabled = !1;
		let { passiveListener: n, activeListenerWithCapture: r } = A();
		t.wrapperEl.removeEventListener("pointerdown", b, n), t.wrapperEl.removeEventListener("pointermove", x, r), [
			"pointerup",
			"pointercancel",
			"pointerout"
		].forEach((e) => {
			t.wrapperEl.removeEventListener(e, S, n);
		}), t.wrapperEl.removeEventListener("pointermove", w, r);
	}
	r("init", () => {
		t.params.zoom.enabled && j();
	}), r("destroy", () => {
		M();
	}), r("touchStart", (e, n) => {
		t.zoom.enabled && C(n);
	}), r("touchEnd", (e, n) => {
		t.zoom.enabled && T();
	}), r("doubleTap", (e, n) => {
		!t.animating && t.params.zoom.enabled && t.zoom.enabled && t.params.zoom.toggle && k(n);
	}), r("transitionEnd", () => {
		t.zoom.enabled && t.params.zoom.enabled && E();
	}), r("slideChange", () => {
		t.zoom.enabled && t.params.zoom.enabled && t.params.cssMode && E();
	}), Object.assign(t.zoom, {
		enable: j,
		disable: M,
		in: D,
		out: O,
		toggle: k
	});
}
//#endregion
//#region node_modules/swiper/modules/controller.mjs
function md(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ controller: {
		control: void 0,
		inverse: !1,
		by: "slide"
	} }), t.controller = { control: void 0 };
	function i(e, t) {
		let n = function() {
			let e, t, n;
			return (r, i) => {
				for (t = -1, e = r.length; e - t > 1;) n = e + t >> 1, r[n] <= i ? t = n : e = n;
				return e;
			};
		}();
		this.x = e, this.y = t, this.lastIndex = e.length - 1;
		let r, i;
		return this.interpolate = function(e) {
			return e ? (i = n(this.x, e), r = i - 1, (e - this.x[r]) * (this.y[i] - this.y[r]) / (this.x[i] - this.x[r]) + this.y[r]) : 0;
		}, this;
	}
	function a(e) {
		t.controller.spline = t.params.loop ? new i(t.slidesGrid, e.slidesGrid) : new i(t.snapGrid, e.snapGrid);
	}
	function o(e, n) {
		let r = t.controller.control, i, o, s = t.constructor;
		function c(e) {
			if (e.destroyed) return;
			let n = t.rtlTranslate ? -t.translate : t.translate;
			t.params.controller.by === "slide" && (a(e), o = -t.controller.spline.interpolate(-n)), (!o || t.params.controller.by === "container") && (i = (e.maxTranslate() - e.minTranslate()) / (t.maxTranslate() - t.minTranslate()), (Number.isNaN(i) || !Number.isFinite(i)) && (i = 1), o = (n - t.minTranslate()) * i + e.minTranslate()), t.params.controller.inverse && (o = e.maxTranslate() - o), e.updateProgress(o), e.setTranslate(o, t), e.updateActiveIndex(), e.updateSlidesClasses();
		}
		if (Array.isArray(r)) for (let e = 0; e < r.length; e += 1) r[e] !== n && r[e] instanceof s && c(r[e]);
		else r instanceof s && n !== r && c(r);
	}
	function s(e, n) {
		let r = t.constructor, i = t.controller.control, a;
		function o(n) {
			n.destroyed || (n.setTransition(e, t), e !== 0 && (n.transitionStart(), n.params.autoHeight && dl(() => {
				n.updateAutoHeight();
			}), kl(n.wrapperEl, () => {
				i && n.transitionEnd();
			})));
		}
		if (Array.isArray(i)) for (a = 0; a < i.length; a += 1) i[a] !== n && i[a] instanceof r && o(i[a]);
		else i instanceof r && n !== i && o(i);
	}
	function c() {
		t.controller.control && t.controller.spline && (t.controller.spline = void 0, delete t.controller.spline);
	}
	r("beforeInit", () => {
		if (typeof window < "u" && (typeof t.params.controller.control == "string" || t.params.controller.control instanceof HTMLElement)) {
			let e = document.querySelector(t.params.controller.control);
			if (e && e.swiper) t.controller.control = e.swiper;
			else if (e) {
				let n = (r) => {
					t.controller.control = r.detail[0], t.update(), e.removeEventListener("init", n);
				};
				e.addEventListener("init", n);
			}
			return;
		}
		t.controller.control = t.params.controller.control;
	}), r("update", () => {
		c();
	}), r("resize", () => {
		c();
	}), r("observerUpdate", () => {
		c();
	}), r("setTranslate", (e, n, r) => {
		!t.controller.control || t.controller.control.destroyed || t.controller.setTranslate(n, r);
	}), r("setTransition", (e, n, r) => {
		!t.controller.control || t.controller.control.destroyed || t.controller.setTransition(n, r);
	}), Object.assign(t.controller, {
		setTranslate: o,
		setTransition: s
	});
}
//#endregion
//#region node_modules/swiper/modules/a11y.mjs
function hd(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ a11y: {
		enabled: !0,
		notificationClass: "swiper-notification",
		prevSlideMessage: "Previous slide",
		nextSlideMessage: "Next slide",
		firstSlideMessage: "This is the first slide",
		lastSlideMessage: "This is the last slide",
		paginationBulletMessage: "Go to slide {{index}}",
		slideLabelMessage: "{{index}} / {{slidesLength}}",
		containerMessage: null,
		containerRoleDescriptionMessage: null,
		itemRoleDescriptionMessage: null,
		slideRole: "group",
		id: null
	} }), t.a11y = { clicked: !1 };
	let i = null;
	function a(e) {
		let t = i;
		t.length !== 0 && (t.innerHTML = "", t.innerHTML = e);
	}
	let o = (e) => (Array.isArray(e) ? e : [e]).filter((e) => !!e);
	function s(e) {
		return e === void 0 && (e = 16), "x".repeat(e).replace(/x/g, () => Math.round(16 * Math.random()).toString(16));
	}
	function c(e) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("tabIndex", "0");
		});
	}
	function l(e) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("tabIndex", "-1");
		});
	}
	function u(e, t) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("role", t);
		});
	}
	function d(e, t) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("aria-roledescription", t);
		});
	}
	function f(e, t) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("aria-controls", t);
		});
	}
	function p(e, t) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("aria-label", t);
		});
	}
	function m(e, t) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("id", t);
		});
	}
	function h(e, t) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("aria-live", t);
		});
	}
	function g(e) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("aria-disabled", !0);
		});
	}
	function _(e) {
		e = o(e), e.forEach((e) => {
			e.setAttribute("aria-disabled", !1);
		});
	}
	function v(e) {
		if (e.keyCode !== 13 && e.keyCode !== 32) return;
		let n = t.params.a11y, r = e.target;
		t.pagination && t.pagination.el && (r === t.pagination.el || t.pagination.el.contains(e.target)) && !e.target.matches(ld(t.params.pagination.bulletClass)) || (t.navigation && t.navigation.nextEl && r === t.navigation.nextEl && (t.isEnd && !t.params.loop || t.slideNext(), t.isEnd ? a(n.lastSlideMessage) : a(n.nextSlideMessage)), t.navigation && t.navigation.prevEl && r === t.navigation.prevEl && (t.isBeginning && !t.params.loop || t.slidePrev(), t.isBeginning ? a(n.firstSlideMessage) : a(n.prevSlideMessage)), t.pagination && r.matches(ld(t.params.pagination.bulletClass)) && r.click());
	}
	function y() {
		if (t.params.loop || t.params.rewind || !t.navigation) return;
		let { nextEl: e, prevEl: n } = t.navigation;
		n && (t.isBeginning ? (g(n), l(n)) : (_(n), c(n))), e && (t.isEnd ? (g(e), l(e)) : (_(e), c(e)));
	}
	function b() {
		return t.pagination && t.pagination.bullets && t.pagination.bullets.length;
	}
	function x() {
		return b() && t.params.pagination.clickable;
	}
	function S() {
		let e = t.params.a11y;
		b() && t.pagination.bullets.forEach((n) => {
			t.params.pagination.clickable && (c(n), t.params.pagination.renderBullet || (u(n, "button"), p(n, e.paginationBulletMessage.replace(/\{\{index\}\}/, Dl(n) + 1)))), n.matches(ld(t.params.pagination.bulletActiveClass)) ? n.setAttribute("aria-current", "true") : n.removeAttribute("aria-current");
		});
	}
	let C = (e, t, n) => {
		c(e), e.tagName !== "BUTTON" && (u(e, "button"), e.addEventListener("keydown", v)), p(e, n), f(e, t);
	}, w = () => {
		t.a11y.clicked = !0;
	}, T = () => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				t.destroyed || (t.a11y.clicked = !1);
			});
		});
	}, E = (e) => {
		if (t.a11y.clicked) return;
		let n = e.target.closest(`.${t.params.slideClass}, swiper-slide`);
		if (!n || !t.slides.includes(n)) return;
		let r = t.slides.indexOf(n) === t.activeIndex, i = t.params.watchSlidesProgress && t.visibleSlides && t.visibleSlides.includes(n);
		r || i || e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents || (t.isHorizontal() ? t.el.scrollLeft = 0 : t.el.scrollTop = 0, t.slideTo(t.slides.indexOf(n), 0));
	}, D = () => {
		let e = t.params.a11y;
		e.itemRoleDescriptionMessage && d(t.slides, e.itemRoleDescriptionMessage), e.slideRole && u(t.slides, e.slideRole);
		let n = t.slides.length;
		e.slideLabelMessage && t.slides.forEach((r, i) => {
			let a = t.params.loop ? parseInt(r.getAttribute("data-swiper-slide-index"), 10) : i;
			p(r, e.slideLabelMessage.replace(/\{\{index\}\}/, a + 1).replace(/\{\{slidesLength\}\}/, n));
		});
	}, O = () => {
		let e = t.params.a11y;
		t.el.append(i);
		let n = t.el;
		e.containerRoleDescriptionMessage && d(n, e.containerRoleDescriptionMessage), e.containerMessage && p(n, e.containerMessage);
		let r = t.wrapperEl, a = e.id || r.getAttribute("id") || `swiper-wrapper-${s(16)}`, c = t.params.autoplay && t.params.autoplay.enabled ? "off" : "polite";
		m(r, a), h(r, c), D();
		let { nextEl: l, prevEl: u } = t.navigation ? t.navigation : {};
		l = o(l), u = o(u), l && l.forEach((t) => C(t, a, e.nextSlideMessage)), u && u.forEach((t) => C(t, a, e.prevSlideMessage)), x() && (Array.isArray(t.pagination.el) ? t.pagination.el : [t.pagination.el]).forEach((e) => {
			e.addEventListener("keydown", v);
		}), t.el.addEventListener("focus", E, !0), t.el.addEventListener("pointerdown", w, !0), t.el.addEventListener("pointerup", T, !0);
	};
	function k() {
		i && i.remove();
		let { nextEl: e, prevEl: n } = t.navigation ? t.navigation : {};
		e = o(e), n = o(n), e && e.forEach((e) => e.removeEventListener("keydown", v)), n && n.forEach((e) => e.removeEventListener("keydown", v)), x() && (Array.isArray(t.pagination.el) ? t.pagination.el : [t.pagination.el]).forEach((e) => {
			e.removeEventListener("keydown", v);
		}), t.el.removeEventListener("focus", E, !0), t.el.removeEventListener("pointerdown", w, !0), t.el.removeEventListener("pointerup", T, !0);
	}
	r("beforeInit", () => {
		i = Sl("span", t.params.a11y.notificationClass), i.setAttribute("aria-live", "assertive"), i.setAttribute("aria-atomic", "true");
	}), r("afterInit", () => {
		t.params.a11y.enabled && O();
	}), r("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
		t.params.a11y.enabled && D();
	}), r("fromEdge toEdge afterInit lock unlock", () => {
		t.params.a11y.enabled && y();
	}), r("paginationUpdate", () => {
		t.params.a11y.enabled && S();
	}), r("destroy", () => {
		t.params.a11y.enabled && k();
	});
}
//#endregion
//#region node_modules/swiper/modules/history.mjs
function gd(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ history: {
		enabled: !1,
		root: "",
		replaceState: !1,
		key: "slides",
		keepQuery: !1
	} });
	let i = !1, a = {}, o = (e) => e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, ""), s = (e) => {
		let t = ll(), n;
		n = e ? new URL(e) : t.location;
		let r = n.pathname.slice(1).split("/").filter((e) => e !== ""), i = r.length;
		return {
			key: r[i - 2],
			value: r[i - 1]
		};
	}, c = (e, n) => {
		let r = ll();
		if (!i || !t.params.history.enabled) return;
		let a;
		a = t.params.url ? new URL(t.params.url) : r.location;
		let s = t.slides[n], c = o(s.getAttribute("data-history"));
		if (t.params.history.root.length > 0) {
			let n = t.params.history.root;
			n[n.length - 1] === "/" && (n = n.slice(0, n.length - 1)), c = `${n}/${e ? `${e}/` : ""}${c}`;
		} else a.pathname.includes(e) || (c = `${e ? `${e}/` : ""}${c}`);
		t.params.history.keepQuery && (c += a.search);
		let l = r.history.state;
		l && l.value === c || (t.params.history.replaceState ? r.history.replaceState({ value: c }, null, c) : r.history.pushState({ value: c }, null, c));
	}, l = (e, n, r) => {
		if (n) for (let i = 0, a = t.slides.length; i < a; i += 1) {
			let a = t.slides[i];
			if (o(a.getAttribute("data-history")) === n) {
				let n = t.getSlideIndex(a);
				t.slideTo(n, e, r);
			}
		}
		else t.slideTo(0, e, r);
	}, u = () => {
		a = s(t.params.url), l(t.params.speed, a.value, !1);
	}, d = () => {
		let e = ll();
		if (t.params.history) {
			if (!e.history || !e.history.pushState) {
				t.params.history.enabled = !1, t.params.hashNavigation.enabled = !0;
				return;
			}
			if (i = !0, a = s(t.params.url), !a.key && !a.value) {
				t.params.history.replaceState || e.addEventListener("popstate", u);
				return;
			}
			l(0, a.value, t.params.runCallbacksOnInit), t.params.history.replaceState || e.addEventListener("popstate", u);
		}
	}, f = () => {
		let e = ll();
		t.params.history.replaceState || e.removeEventListener("popstate", u);
	};
	r("init", () => {
		t.params.history.enabled && d();
	}), r("destroy", () => {
		t.params.history.enabled && f();
	}), r("transitionEnd _freeModeNoMomentumRelease", () => {
		i && c(t.params.history.key, t.activeIndex);
	}), r("slideChange", () => {
		i && t.params.cssMode && c(t.params.history.key, t.activeIndex);
	});
}
//#endregion
//#region node_modules/swiper/modules/hash-navigation.mjs
function _d(e) {
	let { swiper: t, extendParams: n, emit: r, on: i } = e, a = !1, o = sl(), s = ll();
	n({ hashNavigation: {
		enabled: !1,
		replaceState: !1,
		watchState: !1,
		getSlideIndex(e, n) {
			if (t.virtual && t.params.virtual.enabled) {
				let e = t.slides.filter((e) => e.getAttribute("data-hash") === n)[0];
				return e ? parseInt(e.getAttribute("data-swiper-slide-index"), 10) : 0;
			}
			return t.getSlideIndex(xl(t.slidesEl, `.${t.params.slideClass}[data-hash="${n}"], swiper-slide[data-hash="${n}"]`)[0]);
		}
	} });
	let c = () => {
		r("hashChange");
		let e = o.location.hash.replace("#", ""), n = t.virtual && t.params.virtual.enabled ? t.slidesEl.querySelector(`[data-swiper-slide-index="${t.activeIndex}"]`) : t.slides[t.activeIndex];
		if (e !== (n ? n.getAttribute("data-hash") : "")) {
			let n = t.params.hashNavigation.getSlideIndex(t, e);
			if (n === void 0 || Number.isNaN(n)) return;
			t.slideTo(n);
		}
	}, l = () => {
		if (!a || !t.params.hashNavigation.enabled) return;
		let e = t.virtual && t.params.virtual.enabled ? t.slidesEl.querySelector(`[data-swiper-slide-index="${t.activeIndex}"]`) : t.slides[t.activeIndex], n = e ? e.getAttribute("data-hash") || e.getAttribute("data-history") : "";
		t.params.hashNavigation.replaceState && s.history && s.history.replaceState ? (s.history.replaceState(null, null, `#${n}` || ""), r("hashSet")) : (o.location.hash = n || "", r("hashSet"));
	}, u = () => {
		if (!t.params.hashNavigation.enabled || t.params.history && t.params.history.enabled) return;
		a = !0;
		let e = o.location.hash.replace("#", "");
		if (e) {
			let n = t.params.hashNavigation.getSlideIndex(t, e);
			t.slideTo(n || 0, 0, t.params.runCallbacksOnInit, !0);
		}
		t.params.hashNavigation.watchState && s.addEventListener("hashchange", c);
	}, d = () => {
		t.params.hashNavigation.watchState && s.removeEventListener("hashchange", c);
	};
	i("init", () => {
		t.params.hashNavigation.enabled && u();
	}), i("destroy", () => {
		t.params.hashNavigation.enabled && d();
	}), i("transitionEnd _freeModeNoMomentumRelease", () => {
		a && l();
	}), i("slideChange", () => {
		a && t.params.cssMode && l();
	});
}
//#endregion
//#region node_modules/swiper/modules/autoplay.mjs
function vd(e) {
	let { swiper: t, extendParams: n, on: r, emit: i, params: a } = e;
	t.autoplay = {
		running: !1,
		paused: !1,
		timeLeft: 0
	}, n({ autoplay: {
		enabled: !1,
		delay: 3e3,
		waitForTransition: !0,
		disableOnInteraction: !0,
		stopOnLastSlide: !1,
		reverseDirection: !1,
		pauseOnMouseEnter: !1
	} });
	let o, s, c = a && a.autoplay ? a.autoplay.delay : 3e3, l = a && a.autoplay ? a.autoplay.delay : 3e3, u, d = (/* @__PURE__ */ new Date()).getTime, f, p, m, h, g, _;
	function v(e) {
		!t || t.destroyed || !t.wrapperEl || e.target === t.wrapperEl && (t.wrapperEl.removeEventListener("transitionend", v), T());
	}
	let y = () => {
		if (t.destroyed || !t.autoplay.running) return;
		t.autoplay.paused ? f = !0 : f &&= (l = u, !1);
		let e = t.autoplay.paused ? u : d + l - (/* @__PURE__ */ new Date()).getTime();
		t.autoplay.timeLeft = e, i("autoplayTimeLeft", e, e / c), s = requestAnimationFrame(() => {
			y();
		});
	}, b = () => {
		let e;
		if (e = t.virtual && t.params.virtual.enabled ? t.slides.filter((e) => e.classList.contains("swiper-slide-active"))[0] : t.slides[t.activeIndex], e) return parseInt(e.getAttribute("data-swiper-autoplay"), 10);
	}, x = (e) => {
		if (t.destroyed || !t.autoplay.running) return;
		cancelAnimationFrame(s), y();
		let n = e === void 0 ? t.params.autoplay.delay : e;
		c = t.params.autoplay.delay, l = t.params.autoplay.delay;
		let r = b();
		!Number.isNaN(r) && r > 0 && e === void 0 && (n = r, c = r, l = r), u = n;
		let a = t.params.speed, f = () => {
			!t || t.destroyed || (t.params.autoplay.reverseDirection ? !t.isBeginning || t.params.loop || t.params.rewind ? (t.slidePrev(a, !0, !0), i("autoplay")) : t.params.autoplay.stopOnLastSlide || (t.slideTo(t.slides.length - 1, a, !0, !0), i("autoplay")) : !t.isEnd || t.params.loop || t.params.rewind ? (t.slideNext(a, !0, !0), i("autoplay")) : t.params.autoplay.stopOnLastSlide || (t.slideTo(0, a, !0, !0), i("autoplay")), t.params.cssMode && (d = (/* @__PURE__ */ new Date()).getTime(), requestAnimationFrame(() => {
				x();
			})));
		};
		return n > 0 ? (clearTimeout(o), o = setTimeout(() => {
			f();
		}, n)) : requestAnimationFrame(() => {
			f();
		}), n;
	}, S = () => {
		t.autoplay.running = !0, x(), i("autoplayStart");
	}, C = () => {
		t.autoplay.running = !1, clearTimeout(o), cancelAnimationFrame(s), i("autoplayStop");
	}, w = (e, n) => {
		if (t.destroyed || !t.autoplay.running) return;
		clearTimeout(o), e || (_ = !0);
		let r = () => {
			i("autoplayPause"), t.params.autoplay.waitForTransition ? t.wrapperEl.addEventListener("transitionend", v) : T();
		};
		if (t.autoplay.paused = !0, n) {
			g && (u = t.params.autoplay.delay), g = !1, r();
			return;
		}
		u = (u || t.params.autoplay.delay) - ((/* @__PURE__ */ new Date()).getTime() - d), !(t.isEnd && u < 0 && !t.params.loop) && (u < 0 && (u = 0), r());
	}, T = () => {
		t.isEnd && u < 0 && !t.params.loop || t.destroyed || !t.autoplay.running || (d = (/* @__PURE__ */ new Date()).getTime(), _ ? (_ = !1, x(u)) : x(), t.autoplay.paused = !1, i("autoplayResume"));
	}, E = () => {
		if (t.destroyed || !t.autoplay.running) return;
		let e = sl();
		e.visibilityState === "hidden" && (_ = !0, w(!0)), e.visibilityState === "visible" && T();
	}, D = (e) => {
		e.pointerType === "mouse" && (_ = !0, !(t.animating || t.autoplay.paused) && w(!0));
	}, O = (e) => {
		e.pointerType === "mouse" && t.autoplay.paused && T();
	}, k = () => {
		t.params.autoplay.pauseOnMouseEnter && (t.el.addEventListener("pointerenter", D), t.el.addEventListener("pointerleave", O));
	}, A = () => {
		t.el.removeEventListener("pointerenter", D), t.el.removeEventListener("pointerleave", O);
	}, j = () => {
		sl().addEventListener("visibilitychange", E);
	}, M = () => {
		sl().removeEventListener("visibilitychange", E);
	};
	r("init", () => {
		t.params.autoplay.enabled && (k(), j(), d = (/* @__PURE__ */ new Date()).getTime(), S());
	}), r("destroy", () => {
		A(), M(), t.autoplay.running && C();
	}), r("beforeTransitionStart", (e, n, r) => {
		t.destroyed || !t.autoplay.running || (r || !t.params.autoplay.disableOnInteraction ? w(!0, !0) : C());
	}), r("sliderFirstMove", () => {
		if (!(t.destroyed || !t.autoplay.running)) {
			if (t.params.autoplay.disableOnInteraction) {
				C();
				return;
			}
			p = !0, m = !1, _ = !1, h = setTimeout(() => {
				_ = !0, m = !0, w(!0);
			}, 200);
		}
	}), r("touchEnd", () => {
		if (!(t.destroyed || !t.autoplay.running || !p)) {
			if (clearTimeout(h), clearTimeout(o), t.params.autoplay.disableOnInteraction) {
				m = !1, p = !1;
				return;
			}
			m && t.params.cssMode && T(), m = !1, p = !1;
		}
	}), r("slideChange", () => {
		t.destroyed || !t.autoplay.running || (g = !0);
	}), Object.assign(t.autoplay, {
		start: S,
		stop: C,
		pause: w,
		resume: T
	});
}
//#endregion
//#region node_modules/swiper/modules/thumbs.mjs
function yd(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ thumbs: {
		swiper: null,
		multipleActiveThumbs: !0,
		autoScrollOffset: 0,
		slideThumbActiveClass: "swiper-slide-thumb-active",
		thumbsContainerClass: "swiper-thumbs"
	} });
	let i = !1, a = !1;
	t.thumbs = { swiper: null };
	function o() {
		let e = t.thumbs.swiper;
		if (!e || e.destroyed) return;
		let n = e.clickedIndex, r = e.clickedSlide;
		if (r && r.classList.contains(t.params.thumbs.slideThumbActiveClass) || n == null) return;
		let i;
		i = e.params.loop ? parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"), 10) : n, t.params.loop ? t.slideToLoop(i) : t.slideTo(i);
	}
	function s() {
		let { thumbs: e } = t.params;
		if (i) return !1;
		i = !0;
		let n = t.constructor;
		if (e.swiper instanceof n) t.thumbs.swiper = e.swiper, Object.assign(t.thumbs.swiper.originalParams, {
			watchSlidesProgress: !0,
			slideToClickedSlide: !1
		}), Object.assign(t.thumbs.swiper.params, {
			watchSlidesProgress: !0,
			slideToClickedSlide: !1
		}), t.thumbs.swiper.update();
		else if (hl(e.swiper)) {
			let r = Object.assign({}, e.swiper);
			Object.assign(r, {
				watchSlidesProgress: !0,
				slideToClickedSlide: !1
			}), t.thumbs.swiper = new n(r), a = !0;
		}
		return t.thumbs.swiper.el.classList.add(t.params.thumbs.thumbsContainerClass), t.thumbs.swiper.on("tap", o), !0;
	}
	function c(e) {
		let n = t.thumbs.swiper;
		if (!n || n.destroyed) return;
		let r = n.params.slidesPerView === "auto" ? n.slidesPerViewDynamic() : n.params.slidesPerView, i = 1, a = t.params.thumbs.slideThumbActiveClass;
		if (t.params.slidesPerView > 1 && !t.params.centeredSlides && (i = t.params.slidesPerView), t.params.thumbs.multipleActiveThumbs || (i = 1), i = Math.floor(i), n.slides.forEach((e) => e.classList.remove(a)), n.params.loop || n.params.virtual && n.params.virtual.enabled) for (let e = 0; e < i; e += 1) xl(n.slidesEl, `[data-swiper-slide-index="${t.realIndex + e}"]`).forEach((e) => {
			e.classList.add(a);
		});
		else for (let e = 0; e < i; e += 1) n.slides[t.realIndex + e] && n.slides[t.realIndex + e].classList.add(a);
		let o = t.params.thumbs.autoScrollOffset, s = o && !n.params.loop;
		if (t.realIndex !== n.realIndex || s) {
			let i = n.activeIndex, a, c;
			if (n.params.loop) {
				let e = n.slides.filter((e) => e.getAttribute("data-swiper-slide-index") === `${t.realIndex}`)[0];
				a = n.slides.indexOf(e), c = t.activeIndex > t.previousIndex ? "next" : "prev";
			} else a = t.realIndex, c = a > t.previousIndex ? "next" : "prev";
			s && (a += c === "next" ? o : -1 * o), n.visibleSlidesIndexes && n.visibleSlidesIndexes.indexOf(a) < 0 && (n.params.centeredSlides ? a = a > i ? a - Math.floor(r / 2) + 1 : a + Math.floor(r / 2) - 1 : a > i && n.params.slidesPerGroup, n.slideTo(a, e ? 0 : void 0));
		}
	}
	r("beforeInit", () => {
		let { thumbs: e } = t.params;
		if (!(!e || !e.swiper)) if (typeof e.swiper == "string" || e.swiper instanceof HTMLElement) {
			let n = sl(), r = () => {
				let r = typeof e.swiper == "string" ? n.querySelector(e.swiper) : e.swiper;
				if (r && r.swiper) e.swiper = r.swiper, s(), c(!0);
				else if (r) {
					let n = (i) => {
						e.swiper = i.detail[0], r.removeEventListener("init", n), s(), c(!0), e.swiper.update(), t.update();
					};
					r.addEventListener("init", n);
				}
				return r;
			}, i = () => {
				t.destroyed || r() || requestAnimationFrame(i);
			};
			requestAnimationFrame(i);
		} else s(), c(!0);
	}), r("slideChange update resize observerUpdate", () => {
		c();
	}), r("setTransition", (e, n) => {
		let r = t.thumbs.swiper;
		!r || r.destroyed || r.setTransition(n);
	}), r("beforeDestroy", () => {
		let e = t.thumbs.swiper;
		!e || e.destroyed || a && e.destroy();
	}), Object.assign(t.thumbs, {
		init: s,
		update: c
	});
}
//#endregion
//#region node_modules/swiper/modules/free-mode.mjs
function bd(e) {
	let { swiper: t, extendParams: n, emit: r, once: i } = e;
	n({ freeMode: {
		enabled: !1,
		momentum: !0,
		momentumRatio: 1,
		momentumBounce: !0,
		momentumBounceRatio: 1,
		momentumVelocityRatio: 1,
		sticky: !1,
		minimumVelocity: .02
	} });
	function a() {
		if (t.params.cssMode) return;
		let e = t.getTranslate();
		t.setTranslate(e), t.setTransition(0), t.touchEventsData.velocities.length = 0, t.freeMode.onTouchEnd({ currentPos: t.rtl ? t.translate : -t.translate });
	}
	function o() {
		if (t.params.cssMode) return;
		let { touchEventsData: e, touches: n } = t;
		e.velocities.length === 0 && e.velocities.push({
			position: n[t.isHorizontal() ? "startX" : "startY"],
			time: e.touchStartTime
		}), e.velocities.push({
			position: n[t.isHorizontal() ? "currentX" : "currentY"],
			time: fl()
		});
	}
	function s(e) {
		let { currentPos: n } = e;
		if (t.params.cssMode) return;
		let { params: a, wrapperEl: o, rtlTranslate: s, snapGrid: c, touchEventsData: l } = t, u = fl() - l.touchStartTime;
		if (n < -t.minTranslate()) {
			t.slideTo(t.activeIndex);
			return;
		}
		if (n > -t.maxTranslate()) {
			t.slides.length < c.length ? t.slideTo(c.length - 1) : t.slideTo(t.slides.length - 1);
			return;
		}
		if (a.freeMode.momentum) {
			if (l.velocities.length > 1) {
				let e = l.velocities.pop(), n = l.velocities.pop(), r = e.position - n.position, i = e.time - n.time;
				t.velocity = r / i, t.velocity /= 2, Math.abs(t.velocity) < a.freeMode.minimumVelocity && (t.velocity = 0), (i > 150 || fl() - e.time > 300) && (t.velocity = 0);
			} else t.velocity = 0;
			t.velocity *= a.freeMode.momentumVelocityRatio, l.velocities.length = 0;
			let e = 1e3 * a.freeMode.momentumRatio, n = t.velocity * e, u = t.translate + n;
			s && (u = -u);
			let d = !1, f, p = Math.abs(t.velocity) * 20 * a.freeMode.momentumBounceRatio, m;
			if (u < t.maxTranslate()) a.freeMode.momentumBounce ? (u + t.maxTranslate() < -p && (u = t.maxTranslate() - p), f = t.maxTranslate(), d = !0, l.allowMomentumBounce = !0) : u = t.maxTranslate(), a.loop && a.centeredSlides && (m = !0);
			else if (u > t.minTranslate()) a.freeMode.momentumBounce ? (u - t.minTranslate() > p && (u = t.minTranslate() + p), f = t.minTranslate(), d = !0, l.allowMomentumBounce = !0) : u = t.minTranslate(), a.loop && a.centeredSlides && (m = !0);
			else if (a.freeMode.sticky) {
				let e;
				for (let t = 0; t < c.length; t += 1) if (c[t] > -u) {
					e = t;
					break;
				}
				u = Math.abs(c[e] - u) < Math.abs(c[e - 1] - u) || t.swipeDirection === "next" ? c[e] : c[e - 1], u = -u;
			}
			if (m && i("transitionEnd", () => {
				t.loopFix();
			}), t.velocity !== 0) {
				if (e = Math.abs(s ? (-u - t.translate) / t.velocity : (u - t.translate) / t.velocity), a.freeMode.sticky) {
					let n = Math.abs((s ? -u : u) - t.translate), r = t.slidesSizesGrid[t.activeIndex];
					e = n < r ? a.speed : n < 2 * r ? a.speed * 1.5 : a.speed * 2.5;
				}
			} else if (a.freeMode.sticky) {
				t.slideToClosest();
				return;
			}
			a.freeMode.momentumBounce && d ? (t.updateProgress(f), t.setTransition(e), t.setTranslate(u), t.transitionStart(!0, t.swipeDirection), t.animating = !0, kl(o, () => {
				!t || t.destroyed || !l.allowMomentumBounce || (r("momentumBounce"), t.setTransition(a.speed), setTimeout(() => {
					t.setTranslate(f), kl(o, () => {
						!t || t.destroyed || t.transitionEnd();
					});
				}, 0));
			})) : t.velocity ? (r("_freeModeNoMomentumRelease"), t.updateProgress(u), t.setTransition(e), t.setTranslate(u), t.transitionStart(!0, t.swipeDirection), t.animating || (t.animating = !0, kl(o, () => {
				!t || t.destroyed || t.transitionEnd();
			}))) : t.updateProgress(u), t.updateActiveIndex(), t.updateSlidesClasses();
		} else if (a.freeMode.sticky) {
			t.slideToClosest();
			return;
		} else a.freeMode && r("_freeModeNoMomentumRelease");
		(!a.freeMode.momentum || u >= a.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses());
	}
	Object.assign(t, { freeMode: {
		onTouchStart: a,
		onTouchMove: o,
		onTouchEnd: s
	} });
}
//#endregion
//#region node_modules/swiper/modules/grid.mjs
function xd(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ grid: {
		rows: 1,
		fill: "column"
	} });
	let i, a, o, s, c = () => {
		let e = t.params.spaceBetween;
		return typeof e == "string" && e.indexOf("%") >= 0 ? e = parseFloat(e.replace("%", "")) / 100 * t.size : typeof e == "string" && (e = parseFloat(e)), e;
	};
	r("init", () => {
		s = t.params.grid && t.params.grid.rows > 1;
	}), r("update", () => {
		let { params: e, el: n } = t, r = e.grid && e.grid.rows > 1;
		s && !r ? (n.classList.remove(`${e.containerModifierClass}grid`, `${e.containerModifierClass}grid-column`), o = 1, t.emitContainerClasses()) : !s && r && (n.classList.add(`${e.containerModifierClass}grid`), e.grid.fill === "column" && n.classList.add(`${e.containerModifierClass}grid-column`), t.emitContainerClasses()), s = r;
	}), t.grid = {
		initSlides: (e) => {
			let { slidesPerView: n } = t.params, { rows: r, fill: s } = t.params.grid;
			o = Math.floor(e / r), i = Math.floor(e / r) === e / r ? e : Math.ceil(e / r) * r, n !== "auto" && s === "row" && (i = Math.max(i, n * r)), a = i / r;
		},
		updateSlide: (e, n, r, s) => {
			let { slidesPerGroup: l } = t.params, u = c(), { rows: d, fill: f } = t.params.grid, p, m, h;
			if (f === "row" && l > 1) {
				let t = Math.floor(e / (l * d)), a = e - d * l * t, o = t === 0 ? l : Math.min(Math.ceil((r - t * d * l) / d), l);
				h = Math.floor(a / o), m = a - h * o + t * l, p = m + h * i / d, n.style.order = p;
			} else f === "column" ? (m = Math.floor(e / d), h = e - m * d, (m > o || m === o && h === d - 1) && (h += 1, h >= d && (h = 0, m += 1))) : (h = Math.floor(e / a), m = e - h * a);
			n.row = h, n.column = m, n.style[s("margin-top")] = h === 0 ? "" : u && `${u}px`;
		},
		updateWrapperSize: (e, n, r) => {
			let { centeredSlides: a, roundLengths: o } = t.params, s = c(), { rows: l } = t.params.grid;
			if (t.virtualSize = (e + s) * i, t.virtualSize = Math.ceil(t.virtualSize / l) - s, t.wrapperEl.style[r("width")] = `${t.virtualSize + s}px`, a) {
				let e = [];
				for (let r = 0; r < n.length; r += 1) {
					let i = n[r];
					o && (i = Math.floor(i)), n[r] < t.virtualSize + n[0] && e.push(i);
				}
				n.splice(0, n.length), n.push(...e);
			}
		}
	};
}
//#endregion
//#region node_modules/swiper/modules/manipulation.mjs
function Sd(e) {
	let t = this, { params: n, slidesEl: r } = t;
	n.loop && t.loopDestroy();
	let i = (e) => {
		if (typeof e == "string") {
			let t = document.createElement("div");
			t.innerHTML = e, r.append(t.children[0]), t.innerHTML = "";
		} else r.append(e);
	};
	if (typeof e == "object" && "length" in e) for (let t = 0; t < e.length; t += 1) e[t] && i(e[t]);
	else i(e);
	t.recalcSlides(), n.loop && t.loopCreate(), (!n.observer || t.isElement) && t.update();
}
function Cd(e) {
	let t = this, { params: n, activeIndex: r, slidesEl: i } = t;
	n.loop && t.loopDestroy();
	let a = r + 1, o = (e) => {
		if (typeof e == "string") {
			let t = document.createElement("div");
			t.innerHTML = e, i.prepend(t.children[0]), t.innerHTML = "";
		} else i.prepend(e);
	};
	if (typeof e == "object" && "length" in e) {
		for (let t = 0; t < e.length; t += 1) e[t] && o(e[t]);
		a = r + e.length;
	} else o(e);
	t.recalcSlides(), n.loop && t.loopCreate(), (!n.observer || t.isElement) && t.update(), t.slideTo(a, 0, !1);
}
function wd(e, t) {
	let n = this, { params: r, activeIndex: i, slidesEl: a } = n, o = i;
	r.loop && (o -= n.loopedSlides, n.loopDestroy(), n.recalcSlides());
	let s = n.slides.length;
	if (e <= 0) {
		n.prependSlide(t);
		return;
	}
	if (e >= s) {
		n.appendSlide(t);
		return;
	}
	let c = o > e ? o + 1 : o, l = [];
	for (let t = s - 1; t >= e; --t) {
		let e = n.slides[t];
		e.remove(), l.unshift(e);
	}
	if (typeof t == "object" && "length" in t) {
		for (let e = 0; e < t.length; e += 1) t[e] && a.append(t[e]);
		c = o > e ? o + t.length : o;
	} else a.append(t);
	for (let e = 0; e < l.length; e += 1) a.append(l[e]);
	n.recalcSlides(), r.loop && n.loopCreate(), (!r.observer || n.isElement) && n.update(), r.loop ? n.slideTo(c + n.loopedSlides, 0, !1) : n.slideTo(c, 0, !1);
}
function Td(e) {
	let t = this, { params: n, activeIndex: r } = t, i = r;
	n.loop && (i -= t.loopedSlides, t.loopDestroy());
	let a = i, o;
	if (typeof e == "object" && "length" in e) {
		for (let n = 0; n < e.length; n += 1) o = e[n], t.slides[o] && t.slides[o].remove(), o < a && --a;
		a = Math.max(a, 0);
	} else o = e, t.slides[o] && t.slides[o].remove(), o < a && --a, a = Math.max(a, 0);
	t.recalcSlides(), n.loop && t.loopCreate(), (!n.observer || t.isElement) && t.update(), n.loop ? t.slideTo(a + t.loopedSlides, 0, !1) : t.slideTo(a, 0, !1);
}
function Ed() {
	let e = this, t = [];
	for (let n = 0; n < e.slides.length; n += 1) t.push(n);
	e.removeSlide(t);
}
function Dd(e) {
	let { swiper: t } = e;
	Object.assign(t, {
		appendSlide: Sd.bind(t),
		prependSlide: Cd.bind(t),
		addSlide: wd.bind(t),
		removeSlide: Td.bind(t),
		removeAllSlides: Ed.bind(t)
	});
}
//#endregion
//#region node_modules/swiper/shared/effect-init.mjs
function Od(e) {
	let { effect: t, swiper: n, on: r, setTranslate: i, setTransition: a, overwriteParams: o, perspective: s, recreateShadows: c, getEffectParams: l } = e;
	r("beforeInit", () => {
		if (n.params.effect !== t) return;
		n.classNames.push(`${n.params.containerModifierClass}${t}`), s && s() && n.classNames.push(`${n.params.containerModifierClass}3d`);
		let e = o ? o() : {};
		Object.assign(n.params, e), Object.assign(n.originalParams, e);
	}), r("setTranslate", () => {
		n.params.effect === t && i();
	}), r("setTransition", (e, r) => {
		n.params.effect === t && a(r);
	}), r("transitionEnd", () => {
		if (n.params.effect === t && c) {
			if (!l || !l().slideShadows) return;
			n.slides.forEach((e) => {
				e.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((e) => e.remove());
			}), c();
		}
	});
	let u;
	r("virtualUpdate", () => {
		n.params.effect === t && (n.slides.length || (u = !0), requestAnimationFrame(() => {
			u && n.slides && n.slides.length && (i(), u = !1);
		}));
	});
}
//#endregion
//#region node_modules/swiper/shared/effect-target.mjs
function kd(e, t) {
	let n = bl(t);
	return n !== t && (n.style.backfaceVisibility = "hidden", n.style["-webkit-backface-visibility"] = "hidden"), n;
}
//#endregion
//#region node_modules/swiper/shared/effect-virtual-transition-end.mjs
function Ad(e) {
	let { swiper: t, duration: n, transformElements: r, allSlides: i } = e, { activeIndex: a } = t, o = (e) => e.parentElement ? e.parentElement : t.slides.filter((t) => t.shadowRoot && t.shadowRoot === e.parentNode)[0];
	if (t.params.virtualTranslate && n !== 0) {
		let e = !1, n;
		n = i ? r : r.filter((e) => {
			let n = e.classList.contains("swiper-slide-transform") ? o(e) : e;
			return t.getSlideIndex(n) === a;
		}), n.forEach((n) => {
			kl(n, () => {
				if (e || !t || t.destroyed) return;
				e = !0, t.animating = !1;
				let n = new window.CustomEvent("transitionend", {
					bubbles: !0,
					cancelable: !0
				});
				t.wrapperEl.dispatchEvent(n);
			});
		});
	}
}
//#endregion
//#region node_modules/swiper/modules/effect-fade.mjs
function jd(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ fadeEffect: { crossFade: !1 } }), Od({
		effect: "fade",
		swiper: t,
		on: r,
		setTranslate: () => {
			let { slides: e } = t, n = t.params.fadeEffect;
			for (let r = 0; r < e.length; r += 1) {
				let e = t.slides[r], i = -e.swiperSlideOffset;
				t.params.virtualTranslate || (i -= t.translate);
				let a = 0;
				t.isHorizontal() || (a = i, i = 0);
				let o = t.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(e.progress), 0) : 1 + Math.min(Math.max(e.progress, -1), 0), s = kd(n, e);
				s.style.opacity = o, s.style.transform = `translate3d(${i}px, ${a}px, 0px)`;
			}
		},
		setTransition: (e) => {
			let n = t.slides.map((e) => bl(e));
			n.forEach((t) => {
				t.style.transitionDuration = `${e}ms`;
			}), Ad({
				swiper: t,
				duration: e,
				transformElements: n,
				allSlides: !0
			});
		},
		overwriteParams: () => ({
			slidesPerView: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: !0,
			spaceBetween: 0,
			virtualTranslate: !t.params.cssMode
		})
	});
}
//#endregion
//#region node_modules/swiper/modules/effect-cube.mjs
function Md(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ cubeEffect: {
		slideShadows: !0,
		shadow: !0,
		shadowOffset: 20,
		shadowScale: .94
	} });
	let i = (e, t, n) => {
		let r = n ? e.querySelector(".swiper-slide-shadow-left") : e.querySelector(".swiper-slide-shadow-top"), i = n ? e.querySelector(".swiper-slide-shadow-right") : e.querySelector(".swiper-slide-shadow-bottom");
		r || (r = Sl("div", `swiper-slide-shadow-cube swiper-slide-shadow-${n ? "left" : "top"}`.split(" ")), e.append(r)), i || (i = Sl("div", `swiper-slide-shadow-cube swiper-slide-shadow-${n ? "right" : "bottom"}`.split(" ")), e.append(i)), r && (r.style.opacity = Math.max(-t, 0)), i && (i.style.opacity = Math.max(t, 0));
	};
	Od({
		effect: "cube",
		swiper: t,
		on: r,
		setTranslate: () => {
			let { el: e, wrapperEl: n, slides: r, width: a, height: o, rtlTranslate: s, size: c, browser: l } = t, u = t.params.cubeEffect, d = t.isHorizontal(), f = t.virtual && t.params.virtual.enabled, p = 0, m;
			u.shadow && (d ? (m = t.wrapperEl.querySelector(".swiper-cube-shadow"), m || (m = Sl("div", "swiper-cube-shadow"), t.wrapperEl.append(m)), m.style.height = `${a}px`) : (m = e.querySelector(".swiper-cube-shadow"), m || (m = Sl("div", "swiper-cube-shadow"), e.append(m))));
			for (let e = 0; e < r.length; e += 1) {
				let t = r[e], n = e;
				f && (n = parseInt(t.getAttribute("data-swiper-slide-index"), 10));
				let a = n * 90, o = Math.floor(a / 360);
				s && (a = -a, o = Math.floor(-a / 360));
				let l = Math.max(Math.min(t.progress, 1), -1), m = 0, h = 0, g = 0;
				n % 4 == 0 ? (m = -o * 4 * c, g = 0) : (n - 1) % 4 == 0 ? (m = 0, g = -o * 4 * c) : (n - 2) % 4 == 0 ? (m = c + o * 4 * c, g = c) : (n - 3) % 4 == 0 && (m = -c, g = 3 * c + c * 4 * o), s && (m = -m), d || (h = m, m = 0);
				let _ = `rotateX(${d ? 0 : -a}deg) rotateY(${d ? a : 0}deg) translate3d(${m}px, ${h}px, ${g}px)`;
				l <= 1 && l > -1 && (p = n * 90 + l * 90, s && (p = -n * 90 - l * 90)), t.style.transform = _, u.slideShadows && i(t, l, d);
			}
			if (n.style.transformOrigin = `50% 50% -${c / 2}px`, n.style["-webkit-transform-origin"] = `50% 50% -${c / 2}px`, u.shadow) if (d) m.style.transform = `translate3d(0px, ${a / 2 + u.shadowOffset}px, ${-a / 2}px) rotateX(90deg) rotateZ(0deg) scale(${u.shadowScale})`;
			else {
				let e = Math.abs(p) - Math.floor(Math.abs(p) / 90) * 90, t = 1.5 - (Math.sin(e * 2 * Math.PI / 360) / 2 + Math.cos(e * 2 * Math.PI / 360) / 2), n = u.shadowScale, r = u.shadowScale / t, i = u.shadowOffset;
				m.style.transform = `scale3d(${n}, 1, ${r}) translate3d(0px, ${o / 2 + i}px, ${-o / 2 / r}px) rotateX(-90deg)`;
			}
			let h = (l.isSafari || l.isWebView) && l.needPerspectiveFix ? -c / 2 : 0;
			n.style.transform = `translate3d(0px,0,${h}px) rotateX(${t.isHorizontal() ? 0 : p}deg) rotateY(${t.isHorizontal() ? -p : 0}deg)`, n.style.setProperty("--swiper-cube-translate-z", `${h}px`);
		},
		setTransition: (e) => {
			let { el: n, slides: r } = t;
			if (r.forEach((t) => {
				t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((t) => {
					t.style.transitionDuration = `${e}ms`;
				});
			}), t.params.cubeEffect.shadow && !t.isHorizontal()) {
				let t = n.querySelector(".swiper-cube-shadow");
				t && (t.style.transitionDuration = `${e}ms`);
			}
		},
		recreateShadows: () => {
			let e = t.isHorizontal();
			t.slides.forEach((t) => {
				i(t, Math.max(Math.min(t.progress, 1), -1), e);
			});
		},
		getEffectParams: () => t.params.cubeEffect,
		perspective: () => !0,
		overwriteParams: () => ({
			slidesPerView: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: !0,
			resistanceRatio: 0,
			spaceBetween: 0,
			centeredSlides: !1,
			virtualTranslate: !0
		})
	});
}
//#endregion
//#region node_modules/swiper/shared/create-shadow.mjs
function Nd(e, t, n) {
	let r = `swiper-slide-shadow${n ? `-${n}` : ""}${e ? ` swiper-slide-shadow-${e}` : ""}`, i = bl(t), a = i.querySelector(`.${r.split(" ").join(".")}`);
	return a || (a = Sl("div", r.split(" ")), i.append(a)), a;
}
//#endregion
//#region node_modules/swiper/modules/effect-flip.mjs
function Pd(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ flipEffect: {
		slideShadows: !0,
		limitRotation: !0
	} });
	let i = (e, n) => {
		let r = t.isHorizontal() ? e.querySelector(".swiper-slide-shadow-left") : e.querySelector(".swiper-slide-shadow-top"), i = t.isHorizontal() ? e.querySelector(".swiper-slide-shadow-right") : e.querySelector(".swiper-slide-shadow-bottom");
		r ||= Nd("flip", e, t.isHorizontal() ? "left" : "top"), i ||= Nd("flip", e, t.isHorizontal() ? "right" : "bottom"), r && (r.style.opacity = Math.max(-n, 0)), i && (i.style.opacity = Math.max(n, 0));
	};
	Od({
		effect: "flip",
		swiper: t,
		on: r,
		setTranslate: () => {
			let { slides: e, rtlTranslate: n } = t, r = t.params.flipEffect;
			for (let a = 0; a < e.length; a += 1) {
				let o = e[a], s = o.progress;
				t.params.flipEffect.limitRotation && (s = Math.max(Math.min(o.progress, 1), -1));
				let c = o.swiperSlideOffset, l = -180 * s, u = 0, d = t.params.cssMode ? -c - t.translate : -c, f = 0;
				t.isHorizontal() ? n && (l = -l) : (f = d, d = 0, u = -l, l = 0), o.style.zIndex = -Math.abs(Math.round(s)) + e.length, r.slideShadows && i(o, s);
				let p = `translate3d(${d}px, ${f}px, 0px) rotateX(${u}deg) rotateY(${l}deg)`, m = kd(r, o);
				m.style.transform = p;
			}
		},
		setTransition: (e) => {
			let n = t.slides.map((e) => bl(e));
			n.forEach((t) => {
				t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((t) => {
					t.style.transitionDuration = `${e}ms`;
				});
			}), Ad({
				swiper: t,
				duration: e,
				transformElements: n
			});
		},
		recreateShadows: () => {
			t.params.flipEffect, t.slides.forEach((e) => {
				let n = e.progress;
				t.params.flipEffect.limitRotation && (n = Math.max(Math.min(e.progress, 1), -1)), i(e, n);
			});
		},
		getEffectParams: () => t.params.flipEffect,
		perspective: () => !0,
		overwriteParams: () => ({
			slidesPerView: 1,
			slidesPerGroup: 1,
			watchSlidesProgress: !0,
			spaceBetween: 0,
			virtualTranslate: !t.params.cssMode
		})
	});
}
//#endregion
//#region node_modules/swiper/modules/effect-coverflow.mjs
function Fd(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ coverflowEffect: {
		rotate: 50,
		stretch: 0,
		depth: 100,
		scale: 1,
		modifier: 1,
		slideShadows: !0
	} }), Od({
		effect: "coverflow",
		swiper: t,
		on: r,
		setTranslate: () => {
			let { width: e, height: n, slides: r, slidesSizesGrid: i } = t, a = t.params.coverflowEffect, o = t.isHorizontal(), s = t.translate, c = o ? -s + e / 2 : -s + n / 2, l = o ? a.rotate : -a.rotate, u = a.depth;
			for (let e = 0, t = r.length; e < t; e += 1) {
				let t = r[e], n = i[e], s = (c - t.swiperSlideOffset - n / 2) / n, d = typeof a.modifier == "function" ? a.modifier(s) : s * a.modifier, f = o ? l * d : 0, p = o ? 0 : l * d, m = -u * Math.abs(d), h = a.stretch;
				typeof h == "string" && h.indexOf("%") !== -1 && (h = parseFloat(a.stretch) / 100 * n);
				let g = o ? 0 : h * d, _ = o ? h * d : 0, v = 1 - (1 - a.scale) * Math.abs(d);
				Math.abs(_) < .001 && (_ = 0), Math.abs(g) < .001 && (g = 0), Math.abs(m) < .001 && (m = 0), Math.abs(f) < .001 && (f = 0), Math.abs(p) < .001 && (p = 0), Math.abs(v) < .001 && (v = 0);
				let y = `translate3d(${_}px,${g}px,${m}px)  rotateX(${p}deg) rotateY(${f}deg) scale(${v})`, b = kd(a, t);
				if (b.style.transform = y, t.style.zIndex = -Math.abs(Math.round(d)) + 1, a.slideShadows) {
					let e = o ? t.querySelector(".swiper-slide-shadow-left") : t.querySelector(".swiper-slide-shadow-top"), n = o ? t.querySelector(".swiper-slide-shadow-right") : t.querySelector(".swiper-slide-shadow-bottom");
					e ||= Nd("coverflow", t, o ? "left" : "top"), n ||= Nd("coverflow", t, o ? "right" : "bottom"), e && (e.style.opacity = d > 0 ? d : 0), n && (n.style.opacity = -d > 0 ? -d : 0);
				}
			}
		},
		setTransition: (e) => {
			t.slides.map((e) => bl(e)).forEach((t) => {
				t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((t) => {
					t.style.transitionDuration = `${e}ms`;
				});
			});
		},
		perspective: () => !0,
		overwriteParams: () => ({ watchSlidesProgress: !0 })
	});
}
//#endregion
//#region node_modules/swiper/modules/effect-creative.mjs
function Id(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ creativeEffect: {
		limitProgress: 1,
		shadowPerProgress: !1,
		progressMultiplier: 1,
		perspective: !0,
		prev: {
			translate: [
				0,
				0,
				0
			],
			rotate: [
				0,
				0,
				0
			],
			opacity: 1,
			scale: 1
		},
		next: {
			translate: [
				0,
				0,
				0
			],
			rotate: [
				0,
				0,
				0
			],
			opacity: 1,
			scale: 1
		}
	} });
	let i = (e) => typeof e == "string" ? e : `${e}px`;
	Od({
		effect: "creative",
		swiper: t,
		on: r,
		setTranslate: () => {
			let { slides: e, wrapperEl: n, slidesSizesGrid: r } = t, a = t.params.creativeEffect, { progressMultiplier: o } = a, s = t.params.centeredSlides;
			if (s) {
				let e = r[0] / 2 - t.params.slidesOffsetBefore || 0;
				n.style.transform = `translateX(calc(50% - ${e}px))`;
			}
			for (let n = 0; n < e.length; n += 1) {
				let r = e[n], c = r.progress, l = Math.min(Math.max(r.progress, -a.limitProgress), a.limitProgress), u = l;
				s || (u = Math.min(Math.max(r.originalProgress, -a.limitProgress), a.limitProgress));
				let d = r.swiperSlideOffset, f = [
					t.params.cssMode ? -d - t.translate : -d,
					0,
					0
				], p = [
					0,
					0,
					0
				], m = !1;
				t.isHorizontal() || (f[1] = f[0], f[0] = 0);
				let h = {
					translate: [
						0,
						0,
						0
					],
					rotate: [
						0,
						0,
						0
					],
					scale: 1,
					opacity: 1
				};
				l < 0 ? (h = a.next, m = !0) : l > 0 && (h = a.prev, m = !0), f.forEach((e, t) => {
					f[t] = `calc(${e}px + (${i(h.translate[t])} * ${Math.abs(l * o)}))`;
				}), p.forEach((e, t) => {
					p[t] = h.rotate[t] * Math.abs(l * o);
				}), r.style.zIndex = -Math.abs(Math.round(c)) + e.length;
				let g = f.join(", "), _ = `rotateX(${p[0]}deg) rotateY(${p[1]}deg) rotateZ(${p[2]}deg)`, v = u < 0 ? `scale(${1 + (1 - h.scale) * u * o})` : `scale(${1 - (1 - h.scale) * u * o})`, y = u < 0 ? 1 + (1 - h.opacity) * u * o : 1 - (1 - h.opacity) * u * o, b = `translate3d(${g}) ${_} ${v}`;
				if (m && h.shadow || !m) {
					let e = r.querySelector(".swiper-slide-shadow");
					if (!e && h.shadow && (e = Nd("creative", r)), e) {
						let t = a.shadowPerProgress ? l * (1 / a.limitProgress) : l;
						e.style.opacity = Math.min(Math.max(Math.abs(t), 0), 1);
					}
				}
				let x = kd(a, r);
				x.style.transform = b, x.style.opacity = y, h.origin && (x.style.transformOrigin = h.origin);
			}
		},
		setTransition: (e) => {
			let n = t.slides.map((e) => bl(e));
			n.forEach((t) => {
				t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow").forEach((t) => {
					t.style.transitionDuration = `${e}ms`;
				});
			}), Ad({
				swiper: t,
				duration: e,
				transformElements: n,
				allSlides: !0
			});
		},
		perspective: () => t.params.creativeEffect.perspective,
		overwriteParams: () => ({
			watchSlidesProgress: !0,
			virtualTranslate: !t.params.cssMode
		})
	});
}
//#endregion
//#region node_modules/swiper/modules/effect-cards.mjs
function Ld(e) {
	let { swiper: t, extendParams: n, on: r } = e;
	n({ cardsEffect: {
		slideShadows: !0,
		rotate: !0,
		perSlideRotate: 2,
		perSlideOffset: 8
	} }), Od({
		effect: "cards",
		swiper: t,
		on: r,
		setTranslate: () => {
			let { slides: e, activeIndex: n, rtlTranslate: r } = t, i = t.params.cardsEffect, { startTranslate: a, isTouched: o } = t.touchEventsData, s = r ? -t.translate : t.translate;
			for (let c = 0; c < e.length; c += 1) {
				let l = e[c], u = l.progress, d = Math.min(Math.max(u, -4), 4), f = l.swiperSlideOffset;
				t.params.centeredSlides && !t.params.cssMode && (t.wrapperEl.style.transform = `translateX(${t.minTranslate()}px)`), t.params.centeredSlides && t.params.cssMode && (f -= e[0].swiperSlideOffset);
				let p = t.params.cssMode ? -f - t.translate : -f, m = 0, h = -100 * Math.abs(d), g = 1, _ = -i.perSlideRotate * d, v = i.perSlideOffset - Math.abs(d) * .75, y = t.virtual && t.params.virtual.enabled ? t.virtual.from + c : c, b = (y === n || y === n - 1) && d > 0 && d < 1 && (o || t.params.cssMode) && s < a, x = (y === n || y === n + 1) && d < 0 && d > -1 && (o || t.params.cssMode) && s > a;
				if (b || x) {
					let e = (1 - Math.abs((Math.abs(d) - .5) / .5)) ** .5;
					_ += -28 * d * e, g += -.5 * e, v += 96 * e, m = `${-25 * e * Math.abs(d)}%`;
				}
				if (p = d < 0 ? `calc(${p}px ${r ? "-" : "+"} (${v * Math.abs(d)}%))` : d > 0 ? `calc(${p}px ${r ? "-" : "+"} (-${v * Math.abs(d)}%))` : `${p}px`, !t.isHorizontal()) {
					let e = m;
					m = p, p = e;
				}
				let S = d < 0 ? `${1 + (1 - g) * d}` : `${1 - (1 - g) * d}`, C = `
        translate3d(${p}, ${m}, ${h}px)
        rotateZ(${i.rotate ? r ? -_ : _ : 0}deg)
        scale(${S})
      `;
				if (i.slideShadows) {
					let e = l.querySelector(".swiper-slide-shadow");
					e ||= Nd("cards", l), e && (e.style.opacity = Math.min(Math.max((Math.abs(d) - .5) / .5, 0), 1));
				}
				l.style.zIndex = -Math.abs(Math.round(u)) + e.length;
				let w = kd(i, l);
				w.style.transform = C;
			}
		},
		setTransition: (e) => {
			let n = t.slides.map((e) => bl(e));
			n.forEach((t) => {
				t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow").forEach((t) => {
					t.style.transitionDuration = `${e}ms`;
				});
			}), Ad({
				swiper: t,
				duration: e,
				transformElements: n
			});
		},
		perspective: () => !0,
		overwriteParams: () => ({
			watchSlidesProgress: !0,
			virtualTranslate: !t.params.cssMode
		})
	});
}
//#endregion
//#region node_modules/swiper/swiper-bundle.mjs
var Rd = [
	id,
	ad,
	od,
	cd,
	ud,
	dd,
	fd,
	pd,
	md,
	hd,
	gd,
	_d,
	vd,
	yd,
	bd,
	xd,
	Dd,
	jd,
	Md,
	Pd,
	Fd,
	Id,
	Ld
];
rd.use(Rd);
//#endregion
//#region node_modules/swiper/shared/update-swiper.mjs
var zd = /* @__PURE__ */ "eventsPrefix.injectStyles.injectStylesUrls.modules.init._direction.oneWayMovement.touchEventsTarget.initialSlide._speed.cssMode.updateOnWindowResize.resizeObserver.nested.focusableElements._enabled._width._height.preventInteractionOnTransition.userAgent.url._edgeSwipeDetection._edgeSwipeThreshold._freeMode._autoHeight.setWrapperSize.virtualTranslate._effect.breakpoints.breakpointsBase._spaceBetween._slidesPerView.maxBackfaceHiddenSlides._grid._slidesPerGroup._slidesPerGroupSkip._slidesPerGroupAuto._centeredSlides._centeredSlidesBounds._slidesOffsetBefore._slidesOffsetAfter.normalizeSlideIndex._centerInsufficientSlides._watchOverflow.roundLengths.touchRatio.touchAngle.simulateTouch._shortSwipes._longSwipes.longSwipesRatio.longSwipesMs._followFinger.allowTouchMove._threshold.touchMoveStopPropagation.touchStartPreventDefault.touchStartForcePreventDefault.touchReleaseOnEdges.uniqueNavElements._resistance._resistanceRatio._watchSlidesProgress._grabCursor.preventClicks.preventClicksPropagation._slideToClickedSlide._loop.loopedSlides.loopPreventsSliding._rewind._allowSlidePrev._allowSlideNext._swipeHandler._noSwiping.noSwipingClass.noSwipingSelector.passiveListeners.containerModifierClass.slideClass.slideActiveClass.slideVisibleClass.slideNextClass.slidePrevClass.wrapperClass.lazyPreloaderClass.lazyPreloadPrevNext.runCallbacksOnInit.observer.observeParents.observeSlideChildren.a11y._autoplay._controller.coverflowEffect.cubeEffect.fadeEffect.flipEffect.creativeEffect.cardsEffect.hashNavigation.history.keyboard.mousewheel._navigation._pagination.parallax._scrollbar._thumbs.virtual.zoom.control".split(".");
function Bd(e) {
	return typeof e == "object" && !!e && e.constructor && Object.prototype.toString.call(e).slice(8, -1) === "Object" && !e.__swiper__;
}
function Vd(e, t) {
	let n = [
		"__proto__",
		"constructor",
		"prototype"
	];
	Object.keys(t).filter((e) => n.indexOf(e) < 0).forEach((n) => {
		e[n] === void 0 ? e[n] = t[n] : Bd(t[n]) && Bd(e[n]) && Object.keys(t[n]).length > 0 ? t[n].__swiper__ ? e[n] = t[n] : Vd(e[n], t[n]) : e[n] = t[n];
	});
}
function Hd(e) {
	return e === void 0 && (e = {}), e.navigation && e.navigation.nextEl === void 0 && e.navigation.prevEl === void 0;
}
function Ud(e) {
	return e === void 0 && (e = {}), e.pagination && e.pagination.el === void 0;
}
function Wd(e) {
	return e === void 0 && (e = {}), e.scrollbar && e.scrollbar.el === void 0;
}
function Gd(e) {
	return e === void 0 && (e = ""), e.replace(/-[a-z]/g, (e) => e.toUpperCase().replace("-", ""));
}
function Kd(e) {
	let { swiper: t, slides: n, passedParams: r, changedParams: i, nextEl: a, prevEl: o, scrollbarEl: s, paginationEl: c } = e, l = i.filter((e) => e !== "children" && e !== "direction" && e !== "wrapperClass"), { params: u, pagination: d, navigation: f, scrollbar: p, virtual: m, thumbs: h } = t, g, _, v, y, b, x, S, C;
	i.includes("thumbs") && r.thumbs && r.thumbs.swiper && u.thumbs && !u.thumbs.swiper && (g = !0), i.includes("controller") && r.controller && r.controller.control && u.controller && !u.controller.control && (_ = !0), i.includes("pagination") && r.pagination && (r.pagination.el || c) && (u.pagination || u.pagination === !1) && d && !d.el && (v = !0), i.includes("scrollbar") && r.scrollbar && (r.scrollbar.el || s) && (u.scrollbar || u.scrollbar === !1) && p && !p.el && (y = !0), i.includes("navigation") && r.navigation && (r.navigation.prevEl || o) && (r.navigation.nextEl || a) && (u.navigation || u.navigation === !1) && f && !f.prevEl && !f.nextEl && (b = !0);
	let w = (e) => {
		t[e] && (t[e].destroy(), e === "navigation" ? (t.isElement && (t[e].prevEl.remove(), t[e].nextEl.remove()), u[e].prevEl = void 0, u[e].nextEl = void 0, t[e].prevEl = void 0, t[e].nextEl = void 0) : (t.isElement && t[e].el.remove(), u[e].el = void 0, t[e].el = void 0));
	};
	i.includes("loop") && t.isElement && (u.loop && !r.loop ? x = !0 : !u.loop && r.loop ? S = !0 : C = !0), l.forEach((e) => {
		if (Bd(u[e]) && Bd(r[e])) Vd(u[e], r[e]), (e === "navigation" || e === "pagination" || e === "scrollbar") && "enabled" in r[e] && !r[e].enabled && w(e);
		else {
			let t = r[e];
			(t === !0 || t === !1) && (e === "navigation" || e === "pagination" || e === "scrollbar") ? t === !1 && w(e) : u[e] = r[e];
		}
	}), l.includes("controller") && !_ && t.controller && t.controller.control && u.controller && u.controller.control && (t.controller.control = u.controller.control), i.includes("children") && n && m && u.virtual.enabled && (m.slides = n, m.update(!0)), i.includes("children") && n && u.loop && (C = !0), g && h.init() && h.update(!0), _ && (t.controller.control = u.controller.control), v && (t.isElement && (!c || typeof c == "string") && (c = document.createElement("div"), c.classList.add("swiper-pagination"), c.part.add("pagination"), t.el.appendChild(c)), c && (u.pagination.el = c), d.init(), d.render(), d.update()), y && (t.isElement && (!s || typeof s == "string") && (s = document.createElement("div"), s.classList.add("swiper-scrollbar"), s.part.add("scrollbar"), t.el.appendChild(s)), s && (u.scrollbar.el = s), p.init(), p.updateSize(), p.setTranslate()), b && (t.isElement && ((!a || typeof a == "string") && (a = document.createElement("div"), a.classList.add("swiper-button-next"), a.innerHTML = t.hostEl.constructor.nextButtonSvg, a.part.add("button-next"), t.el.appendChild(a)), (!o || typeof o == "string") && (o = document.createElement("div"), o.classList.add("swiper-button-prev"), o.innerHTML = t.hostEl.constructor.prevButtonSvg, o.part.add("button-prev"), t.el.appendChild(o))), a && (u.navigation.nextEl = a), o && (u.navigation.prevEl = o), f.init(), f.update()), i.includes("allowSlideNext") && (t.allowSlideNext = r.allowSlideNext), i.includes("allowSlidePrev") && (t.allowSlidePrev = r.allowSlidePrev), i.includes("direction") && t.changeDirection(r.direction, !1), (x || C) && t.loopDestroy(), (S || C) && t.loopCreate(), t.update();
}
//#endregion
//#region node_modules/swiper/shared/get-element-params.mjs
var qd = (e) => {
	if (parseFloat(e) === Number(e)) return Number(e);
	if (e === "true" || e === "") return !0;
	if (e === "false") return !1;
	if (e === "null") return null;
	if (e !== "undefined") {
		if (typeof e == "string" && e.includes("{") && e.includes("}") && e.includes("\"")) {
			let t;
			try {
				t = JSON.parse(e);
			} catch {
				t = e;
			}
			return t;
		}
		return e;
	}
}, Jd = [
	"a11y",
	"autoplay",
	"controller",
	"cards-effect",
	"coverflow-effect",
	"creative-effect",
	"cube-effect",
	"fade-effect",
	"flip-effect",
	"free-mode",
	"grid",
	"hash-navigation",
	"history",
	"keyboard",
	"mousewheel",
	"navigation",
	"pagination",
	"parallax",
	"scrollbar",
	"thumbs",
	"virtual",
	"zoom"
];
function Yd(e, t, n) {
	let r = {}, i = {};
	Vd(r, $u);
	let a = [...zd, "on"], o = a.map((e) => e.replace(/_/, ""));
	a.forEach((t) => {
		t = t.replace("_", ""), e[t] !== void 0 && (i[t] = e[t]);
	});
	let s = [...e.attributes];
	return typeof t == "string" && n !== void 0 && s.push({
		name: t,
		value: Bd(n) ? { ...n } : n
	}), s.forEach((e) => {
		let t = Jd.filter((t) => e.name.indexOf(`${t}-`) === 0)[0];
		if (t) {
			let n = Gd(t), r = Gd(e.name.split(`${t}-`)[1]);
			i[n] === void 0 && (i[n] = {}), i[n] === !0 && (i[n] = { enabled: !0 }), i[n][r] = qd(e.value);
		} else {
			let t = Gd(e.name);
			if (!o.includes(t)) return;
			let n = qd(e.value);
			i[t] && Jd.includes(e.name) && !Bd(n) ? (i[t].constructor !== Object && (i[t] = {}), i[t].enabled = !!n) : i[t] = n;
		}
	}), Vd(r, i), r.navigation ? r.navigation = {
		prevEl: ".swiper-button-prev",
		nextEl: ".swiper-button-next",
		...r.navigation === !0 ? {} : r.navigation
	} : r.navigation === !1 && delete r.navigation, r.scrollbar ? r.scrollbar = {
		el: ".swiper-scrollbar",
		...r.scrollbar === !0 ? {} : r.scrollbar
	} : r.scrollbar === !1 && delete r.scrollbar, r.pagination ? r.pagination = {
		el: ".swiper-pagination",
		...r.pagination === !0 ? {} : r.pagination
	} : r.pagination === !1 && delete r.pagination, {
		params: r,
		passedParams: i
	};
}
//#endregion
//#region node_modules/swiper/swiper-element-bundle.mjs
var Xd = ":host{--swiper-theme-color:#007aff}:host{position:relative;display:block;margin-left:auto;margin-right:auto;z-index:1}.swiper{width:100%;height:100%;margin-left:auto;margin-right:auto;position:relative;overflow:hidden;overflow:clip;list-style:none;padding:0;z-index:1;display:block}.swiper-vertical>.swiper-wrapper{flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:flex;transition-property:transform;transition-timing-function:var(--swiper-wrapper-transition-timing-function,initial);box-sizing:content-box}.swiper-android ::slotted(swiper-slide),.swiper-ios ::slotted(swiper-slide),.swiper-wrapper{transform:translate3d(0px,0,0)}.swiper-horizontal{touch-action:pan-y}.swiper-vertical{touch-action:pan-x}::slotted(swiper-slide){flex-shrink:0;width:100%;height:100%;position:relative;transition-property:transform;display:block}::slotted(.swiper-slide-invisible-blank){visibility:hidden}.swiper-autoheight,.swiper-autoheight ::slotted(swiper-slide){height:auto}.swiper-autoheight .swiper-wrapper{align-items:flex-start;transition-property:transform,height}.swiper-backface-hidden ::slotted(swiper-slide){transform:translateZ(0);-webkit-backface-visibility:hidden;backface-visibility:hidden}.swiper-3d.swiper-css-mode .swiper-wrapper{perspective:1200px}.swiper-3d .swiper-wrapper{transform-style:preserve-3d}.swiper-3d{perspective:1200px}.swiper-3d .swiper-cube-shadow,.swiper-3d ::slotted(swiper-slide){transform-style:preserve-3d}.swiper-css-mode>.swiper-wrapper{overflow:auto;scrollbar-width:none;-ms-overflow-style:none}.swiper-css-mode>.swiper-wrapper::-webkit-scrollbar{display:none}.swiper-css-mode ::slotted(swiper-slide){scroll-snap-align:start start}.swiper-css-mode.swiper-horizontal>.swiper-wrapper{scroll-snap-type:x mandatory}.swiper-css-mode.swiper-vertical>.swiper-wrapper{scroll-snap-type:y mandatory}.swiper-css-mode.swiper-free-mode>.swiper-wrapper{scroll-snap-type:none}.swiper-css-mode.swiper-free-mode ::slotted(swiper-slide){scroll-snap-align:none}.swiper-css-mode.swiper-centered>.swiper-wrapper::before{content:'';flex-shrink:0;order:9999}.swiper-css-mode.swiper-centered ::slotted(swiper-slide){scroll-snap-align:center center;scroll-snap-stop:always}.swiper-css-mode.swiper-centered.swiper-horizontal ::slotted(swiper-slide):first-child{margin-inline-start:var(--swiper-centered-offset-before)}.swiper-css-mode.swiper-centered.swiper-horizontal>.swiper-wrapper::before{height:100%;min-height:1px;width:var(--swiper-centered-offset-after)}.swiper-css-mode.swiper-centered.swiper-vertical ::slotted(swiper-slide):first-child{margin-block-start:var(--swiper-centered-offset-before)}.swiper-css-mode.swiper-centered.swiper-vertical>.swiper-wrapper::before{width:100%;min-width:1px;height:var(--swiper-centered-offset-after)}.swiper-virtual ::slotted(swiper-slide){-webkit-backface-visibility:hidden;transform:translateZ(0)}.swiper-virtual.swiper-css-mode .swiper-wrapper::after{content:'';position:absolute;left:0;top:0;pointer-events:none}.swiper-virtual.swiper-css-mode.swiper-horizontal .swiper-wrapper::after{height:1px;width:var(--swiper-virtual-size)}.swiper-virtual.swiper-css-mode.swiper-vertical .swiper-wrapper::after{width:1px;height:var(--swiper-virtual-size)}:host{--swiper-navigation-size:44px}.swiper-button-next,.swiper-button-prev{position:absolute;top:var(--swiper-navigation-top-offset,50%);width:calc(var(--swiper-navigation-size)/ 44 * 27);height:var(--swiper-navigation-size);margin-top:calc(0px - (var(--swiper-navigation-size)/ 2));z-index:10;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--swiper-navigation-color,var(--swiper-theme-color))}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-next.swiper-button-hidden,.swiper-button-prev.swiper-button-hidden{opacity:0;cursor:auto;pointer-events:none}.swiper-navigation-disabled .swiper-button-next,.swiper-navigation-disabled .swiper-button-prev{display:none!important}.swiper-button-next svg,.swiper-button-prev svg{width:100%;height:100%;object-fit:contain;transform-origin:center}.swiper-rtl .swiper-button-next svg,.swiper-rtl .swiper-button-prev svg{transform:rotate(180deg)}.swiper-button-prev,.swiper-rtl .swiper-button-next{left:var(--swiper-navigation-sides-offset,10px);right:auto}.swiper-button-next,.swiper-rtl .swiper-button-prev{right:var(--swiper-navigation-sides-offset,10px);left:auto}.swiper-button-lock{display:none}.swiper-pagination{position:absolute;text-align:center;transition:.3s opacity;transform:translate3d(0,0,0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-pagination-disabled>.swiper-pagination,.swiper-pagination.swiper-pagination-disabled{display:none!important}.swiper-horizontal>.swiper-pagination-bullets,.swiper-pagination-bullets.swiper-pagination-horizontal,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:var(--swiper-pagination-bottom,8px);top:var(--swiper-pagination-top,auto);left:0;width:100%}.swiper-pagination-bullets-dynamic{overflow:hidden;font-size:0}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transform:scale(.33);position:relative}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active{transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-main{transform:scale(1)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev{transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev{transform:scale(.33)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next{transform:scale(.66)}.swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next{transform:scale(.33)}.swiper-pagination-bullet{width:var(--swiper-pagination-bullet-width,var(--swiper-pagination-bullet-size,8px));height:var(--swiper-pagination-bullet-height,var(--swiper-pagination-bullet-size,8px));display:inline-block;border-radius:var(--swiper-pagination-bullet-border-radius,50%);background:var(--swiper-pagination-bullet-inactive-color,#000);opacity:var(--swiper-pagination-bullet-inactive-opacity, .2)}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-webkit-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-bullet:only-child{display:none!important}.swiper-pagination-bullet-active{opacity:var(--swiper-pagination-bullet-opacity, 1);background:var(--swiper-pagination-color,var(--swiper-theme-color))}.swiper-pagination-vertical.swiper-pagination-bullets,.swiper-vertical>.swiper-pagination-bullets{right:var(--swiper-pagination-right,8px);left:var(--swiper-pagination-left,auto);top:50%;transform:translate3d(0px,-50%,0)}.swiper-pagination-vertical.swiper-pagination-bullets .swiper-pagination-bullet,.swiper-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:var(--swiper-pagination-bullet-vertical-gap,6px) 0;display:block}.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic,.swiper-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{top:50%;transform:translateY(-50%);width:8px}.swiper-pagination-vertical.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet,.swiper-vertical>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{display:inline-block;transition:.2s transform,.2s top}.swiper-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet,.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 var(--swiper-pagination-bullet-horizontal-gap,4px)}.swiper-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic,.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic{left:50%;transform:translateX(-50%);white-space:nowrap}.swiper-horizontal>.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet,.swiper-pagination-horizontal.swiper-pagination-bullets.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transition:.2s transform,.2s left}.swiper-horizontal.swiper-rtl>.swiper-pagination-bullets-dynamic .swiper-pagination-bullet{transition:.2s transform,.2s right}.swiper-pagination-fraction{color:var(--swiper-pagination-fraction-color,inherit)}.swiper-pagination-progressbar{background:var(--swiper-pagination-progressbar-bg-color,rgba(0,0,0,.25));position:absolute}.swiper-pagination-progressbar .swiper-pagination-progressbar-fill{background:var(--swiper-pagination-color,var(--swiper-theme-color));position:absolute;left:0;top:0;width:100%;height:100%;transform:scale(0);transform-origin:left top}.swiper-rtl .swiper-pagination-progressbar .swiper-pagination-progressbar-fill{transform-origin:right top}.swiper-horizontal>.swiper-pagination-progressbar,.swiper-pagination-progressbar.swiper-pagination-horizontal,.swiper-pagination-progressbar.swiper-pagination-vertical.swiper-pagination-progressbar-opposite,.swiper-vertical>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite{width:100%;height:var(--swiper-pagination-progressbar-size,4px);left:0;top:0}.swiper-horizontal>.swiper-pagination-progressbar.swiper-pagination-progressbar-opposite,.swiper-pagination-progressbar.swiper-pagination-horizontal.swiper-pagination-progressbar-opposite,.swiper-pagination-progressbar.swiper-pagination-vertical,.swiper-vertical>.swiper-pagination-progressbar{width:var(--swiper-pagination-progressbar-size,4px);height:100%;left:0;top:0}.swiper-pagination-lock{display:none}.swiper-scrollbar{border-radius:var(--swiper-scrollbar-border-radius,10px);position:relative;touch-action:none;background:var(--swiper-scrollbar-bg-color,rgba(0,0,0,.1))}.swiper-scrollbar-disabled>.swiper-scrollbar,.swiper-scrollbar.swiper-scrollbar-disabled{display:none!important}.swiper-horizontal>.swiper-scrollbar,.swiper-scrollbar.swiper-scrollbar-horizontal{position:absolute;left:var(--swiper-scrollbar-sides-offset,1%);bottom:var(--swiper-scrollbar-bottom,4px);top:var(--swiper-scrollbar-top,auto);z-index:50;height:var(--swiper-scrollbar-size,4px);width:calc(100% - 2 * var(--swiper-scrollbar-sides-offset,1%))}.swiper-scrollbar.swiper-scrollbar-vertical,.swiper-vertical>.swiper-scrollbar{position:absolute;left:var(--swiper-scrollbar-left,auto);right:var(--swiper-scrollbar-right,4px);top:var(--swiper-scrollbar-sides-offset,1%);z-index:50;width:var(--swiper-scrollbar-size,4px);height:calc(100% - 2 * var(--swiper-scrollbar-sides-offset,1%))}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:var(--swiper-scrollbar-drag-bg-color,rgba(0,0,0,.5));border-radius:var(--swiper-scrollbar-border-radius,10px);left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-scrollbar-lock{display:none}::slotted(.swiper-slide-zoomed){cursor:move;touch-action:none}.swiper .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-free-mode>.swiper-wrapper{transition-timing-function:ease-out;margin:0 auto}.swiper-grid>.swiper-wrapper{flex-wrap:wrap}.swiper-grid-column>.swiper-wrapper{flex-wrap:wrap;flex-direction:column}.swiper-fade.swiper-free-mode ::slotted(swiper-slide){transition-timing-function:ease-out}.swiper-fade ::slotted(swiper-slide){pointer-events:none;transition-property:opacity}.swiper-fade ::slotted(swiper-slide) ::slotted(swiper-slide){pointer-events:none}.swiper-fade ::slotted(.swiper-slide-active){pointer-events:auto}.swiper-fade ::slotted(.swiper-slide-active) ::slotted(.swiper-slide-active){pointer-events:auto}.swiper-cube{overflow:visible}.swiper-cube ::slotted(swiper-slide){pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1;visibility:hidden;transform-origin:0 0;width:100%;height:100%}.swiper-cube ::slotted(swiper-slide) ::slotted(swiper-slide){pointer-events:none}.swiper-cube.swiper-rtl ::slotted(swiper-slide){transform-origin:100% 0}.swiper-cube ::slotted(.swiper-slide-active),.swiper-cube ::slotted(.swiper-slide-active) ::slotted(.swiper-slide-active){pointer-events:auto}.swiper-cube ::slotted(.swiper-slide-active),.swiper-cube ::slotted(.swiper-slide-next),.swiper-cube ::slotted(.swiper-slide-prev){pointer-events:auto;visibility:visible}.swiper-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0px;width:100%;height:100%;opacity:.6;z-index:0}.swiper-cube .swiper-cube-shadow:before{content:'';background:#000;position:absolute;left:0;top:0;bottom:0;right:0;filter:blur(50px)}.swiper-cube ::slotted(.swiper-slide-next)+::slotted(swiper-slide){pointer-events:auto;visibility:visible}.swiper-flip{overflow:visible}.swiper-flip ::slotted(swiper-slide){pointer-events:none;-webkit-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-flip ::slotted(swiper-slide) ::slotted(swiper-slide){pointer-events:none}.swiper-flip ::slotted(.swiper-slide-active),.swiper-flip ::slotted(.swiper-slide-active) ::slotted(.swiper-slide-active){pointer-events:auto}.swiper-creative ::slotted(swiper-slide){-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden;transition-property:transform,opacity,height}.swiper-cards{overflow:visible}.swiper-cards ::slotted(swiper-slide){transform-origin:center bottom;-webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden}", Zd = "::slotted(.swiper-slide-shadow),::slotted(.swiper-slide-shadow-bottom),::slotted(.swiper-slide-shadow-left),::slotted(.swiper-slide-shadow-right),::slotted(.swiper-slide-shadow-top){position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}::slotted(.swiper-slide-shadow){background:rgba(0,0,0,.15)}::slotted(.swiper-slide-shadow-left){background-image:linear-gradient(to left,rgba(0,0,0,.5),rgba(0,0,0,0))}::slotted(.swiper-slide-shadow-right){background-image:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,0))}::slotted(.swiper-slide-shadow-top){background-image:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0))}::slotted(.swiper-slide-shadow-bottom){background-image:linear-gradient(to bottom,rgba(0,0,0,.5),rgba(0,0,0,0))}.swiper-lazy-preloader{animation:swiper-preloader-spin 1s infinite linear;width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;transform-origin:50%;box-sizing:border-box;border:4px solid var(--swiper-preloader-color,var(--swiper-theme-color));border-radius:50%;border-top-color:transparent}@keyframes swiper-preloader-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}::slotted(.swiper-slide-shadow-cube.swiper-slide-shadow-bottom),::slotted(.swiper-slide-shadow-cube.swiper-slide-shadow-left),::slotted(.swiper-slide-shadow-cube.swiper-slide-shadow-right),::slotted(.swiper-slide-shadow-cube.swiper-slide-shadow-top){z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}::slotted(.swiper-slide-shadow-flip.swiper-slide-shadow-bottom),::slotted(.swiper-slide-shadow-flip.swiper-slide-shadow-left),::slotted(.swiper-slide-shadow-flip.swiper-slide-shadow-right),::slotted(.swiper-slide-shadow-flip.swiper-slide-shadow-top){z-index:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}::slotted(.swiper-zoom-container){width:100%;height:100%;display:flex;justify-content:center;align-items:center;text-align:center}::slotted(.swiper-zoom-container)>canvas,::slotted(.swiper-zoom-container)>img,::slotted(.swiper-zoom-container)>svg{max-width:100%;max-height:100%;object-fit:contain}", Qd = typeof window > "u" || typeof HTMLElement > "u" ? class {} : HTMLElement, $d = "<svg width=\"11\" height=\"20\" viewBox=\"0 0 11 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z\" fill=\"currentColor\"/></svg>\n    ", ef = (e, t) => {
	if (typeof CSSStyleSheet < "u" && e.adoptedStyleSheets) {
		let n = new CSSStyleSheet();
		n.replaceSync(t), e.adoptedStyleSheets = [n];
	} else {
		let n = document.createElement("style");
		n.rel = "stylesheet", n.textContent = t, e.appendChild(n);
	}
}, tf = class extends Qd {
	constructor() {
		super(), this.attachShadow({ mode: "open" });
	}
	static get nextButtonSvg() {
		return $d;
	}
	static get prevButtonSvg() {
		return $d.replace("/></svg>", " transform-origin=\"center\" transform=\"rotate(180)\"/></svg>");
	}
	cssStyles() {
		return [Xd, ...this.injectStyles && Array.isArray(this.injectStyles) ? this.injectStyles : []].join("\n");
	}
	cssLinks() {
		return this.injectStylesUrls || [];
	}
	calcSlideSlots() {
		let e = this.slideSlots || 0, t = [...this.querySelectorAll("[slot^=slide-]")].map((e) => parseInt(e.getAttribute("slot").split("slide-")[1], 10));
		if (this.slideSlots = t.length ? Math.max(...t) + 1 : 0, this.rendered) {
			if (this.slideSlots > e) for (let t = e; t < this.slideSlots; t += 1) {
				let e = document.createElement("swiper-slide");
				e.setAttribute("part", `slide slide-${t + 1}`);
				let n = document.createElement("slot");
				n.setAttribute("name", `slide-${t + 1}`), e.appendChild(n), this.shadowRoot.querySelector(".swiper-wrapper").appendChild(e);
			}
			else if (this.slideSlots < e) {
				let e = this.swiper.slides;
				for (let t = e.length - 1; t >= 0; --t) t > this.slideSlots && e[t].remove();
			}
		}
	}
	render() {
		if (this.rendered) return;
		this.calcSlideSlots();
		let e = this.cssStyles();
		this.slideSlots > 0 && (e = e.replace(/::slotted\(([a-z-0-9.]*)\)/g, "$1")), e.length && ef(this.shadowRoot, e), this.cssLinks().forEach((e) => {
			if (this.shadowRoot.querySelector(`link[href="${e}"]`)) return;
			let t = document.createElement("link");
			t.rel = "stylesheet", t.href = e, this.shadowRoot.appendChild(t);
		});
		let t = document.createElement("div");
		t.classList.add("swiper"), t.part = "container", t.innerHTML = `
      <slot name="container-start"></slot>
      <div class="swiper-wrapper" part="wrapper">
        <slot></slot>
        ${Array.from({ length: this.slideSlots }).map((e, t) => `
        <swiper-slide part="slide slide-${t}">
          <slot name="slide-${t}"></slot>
        </swiper-slide>
        `).join("")}
      </div>
      <slot name="container-end"></slot>
      ${Hd(this.passedParams) ? `
        <div part="button-prev" class="swiper-button-prev">${this.constructor.prevButtonSvg}</div>
        <div part="button-next" class="swiper-button-next">${this.constructor.nextButtonSvg}</div>
      ` : ""}
      ${Ud(this.passedParams) ? "\n        <div part=\"pagination\" class=\"swiper-pagination\"></div>\n      " : ""}
      ${Wd(this.passedParams) ? "\n        <div part=\"scrollbar\" class=\"swiper-scrollbar\"></div>\n      " : ""}
    `, this.shadowRoot.appendChild(t), this.rendered = !0;
	}
	initialize() {
		var e = this;
		if (this.initialized) return;
		this.initialized = !0;
		let { params: t, passedParams: n } = Yd(this);
		this.swiperParams = t, this.passedParams = n, delete this.swiperParams.init, this.render(), this.swiper = new rd(this.shadowRoot.querySelector(".swiper"), {
			...t.virtual ? {} : {
				observer: !0,
				observeSlideChildren: this.slideSlots > 0
			},
			...t,
			touchEventsTarget: "container",
			onAny: function(n) {
				n === "observerUpdate" && e.calcSlideSlots();
				let r = t.eventsPrefix ? `${t.eventsPrefix}${n.toLowerCase()}` : n.toLowerCase();
				var i = [...arguments].slice(1);
				let a = new CustomEvent(r, {
					detail: i,
					bubbles: n !== "hashChange",
					cancelable: !0
				});
				e.dispatchEvent(a);
			}
		});
	}
	connectedCallback() {
		this.initialized && this.nested && this.closest("swiper-slide") && this.closest("swiper-slide").swiperLoopMoveDOM || this.init === !1 || this.getAttribute("init") === "false" || this.initialize();
	}
	disconnectedCallback() {
		this.nested && this.closest("swiper-slide") && this.closest("swiper-slide").swiperLoopMoveDOM || (this.swiper && this.swiper.destroy && this.swiper.destroy(), this.initialized = !1);
	}
	updateSwiperOnPropChange(e, t) {
		let { params: n, passedParams: r } = Yd(this, e, t);
		this.passedParams = r, this.swiperParams = n, Kd({
			swiper: this.swiper,
			passedParams: this.passedParams,
			changedParams: [Gd(e)],
			...e === "navigation" && r[e] ? {
				prevEl: ".swiper-button-prev",
				nextEl: ".swiper-button-next"
			} : {},
			...e === "pagination" && r[e] ? { paginationEl: ".swiper-pagination" } : {},
			...e === "scrollbar" && r[e] ? { scrollbarEl: ".swiper-scrollbar" } : {}
		});
	}
	attributeChangedCallback(e, t, n) {
		this.initialized && (t === "true" && n === null && (n = !1), this.updateSwiperOnPropChange(e, n));
	}
	static get observedAttributes() {
		return zd.filter((e) => e.includes("_")).map((e) => e.replace(/[A-Z]/g, (e) => `-${e}`).replace("_", "").toLowerCase());
	}
};
zd.forEach((e) => {
	e !== "init" && (e = e.replace("_", ""), Object.defineProperty(tf.prototype, e, {
		configurable: !0,
		get() {
			return (this.passedParams || {})[e];
		},
		set(t) {
			this.passedParams ||= {}, this.passedParams[e] = t, this.initialized && this.updateSwiperOnPropChange(e, t);
		}
	}));
});
var nf = class extends Qd {
	constructor() {
		super(), this.attachShadow({ mode: "open" });
	}
	render() {
		let e = this.lazy || this.getAttribute("lazy") === "" || this.getAttribute("lazy") === "true";
		if (ef(this.shadowRoot, Zd), this.shadowRoot.appendChild(document.createElement("slot")), e) {
			let e = document.createElement("div");
			e.classList.add("swiper-lazy-preloader"), e.part.add("preloader"), this.shadowRoot.appendChild(e);
		}
	}
	initialize() {
		this.render();
	}
	connectedCallback() {
		this.initialize();
	}
};
//#endregion
//#region node_modules/framework7/components/swiper/swiper.js
typeof window < "u" && (window.SwiperElementRegisterParams = (e) => {
	zd.push(...e);
}), typeof window > "u" || (window.customElements.get("swiper-container") || window.customElements.define("swiper-container", tf), window.customElements.get("swiper-slide") || window.customElements.define("swiper-slide", nf));
function rf(e) {
	let t = this, n = W(e);
	if (n.length === 0) return;
	let r = n[0].swiper && n[0].swiper.isElement;
	if (n[0].swiper && !n[0].swiper.isElement) return;
	let i, a = {}, o, s;
	n.hasClass("tabs") && (i = n.children("swiper-slide").indexOf(n.children(".tab-active")[0]), o = !0, s = n.find(".tabs-routable").length > 0), n.attr("data-swiper") ? a = JSON.parse(n.attr("data-swiper")) : n[0].f7SwiperParams ? a = n[0].f7SwiperParams : (a = n.dataset(), Object.keys(a).forEach((e) => {
		let t = a[e];
		if (typeof t == "string" && t.indexOf("{") === 0 && t.indexOf("}") > 0) try {
			a[e] = JSON.parse(t);
		} catch {}
	})), a.initialSlide === void 0 && i !== void 0 && (a.initialSlide = i);
	let c = r ? n[0].swiper : t.swiper.create(n[0], a);
	r && c.slideTo(i, 0);
	function l() {
		c.update();
	}
	let u = n.parents(".tab").filter((e) => W(e).parent(".tabs").parent(".tabs-animated-wrap, swiper-container.tabs").length === 0).eq(0);
	n.parents(".popup, .login-screen, .sheet-modal, .popover").on("modal:open", l), n.parents(".panel").on("panel:open", l), u && u.length && u.on("tab:show", l), c.on("beforeDestroy", () => {
		n.parents(".popup, .login-screen, .sheet-modal, .popover").off("modal:open", l), n.parents(".panel").off("panel:open", l), u && u.length && u.off("tab:show", l);
	}), o && c.on("slideChange", () => {
		if (s) {
			let e = t.views.get(n.parents(".view"));
			e ||= t.views.main;
			let r = e.router, i = r.findTabRouteUrl(W(c.slides).eq(c.activeIndex)[0]);
			i && setTimeout(() => {
				r.navigate(i);
			}, 0);
		} else t.tab.show({ tabEl: W(c.slides).eq(c.activeIndex) });
	});
}
var af = {
	name: "swiper",
	static: { Swiper: rd },
	create() {
		let e = this;
		e.swiper = ho({
			defaultSelector: ".swiper",
			constructor: rd,
			domProp: "swiper"
		});
	},
	on: {
		pageMounted(e) {
			let t = this;
			e.$el.find("swiper-container.tabs").each((e) => {
				rf.call(t, e);
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find("swiper-container.tabs").each((e) => {
				rf.call(t, e);
			});
		},
		pageReinit(e) {
			let t = this;
			e.$el.find("swiper-container.tabs").each((e) => {
				let n = t.swiper.get(e);
				n && n.update && n.update();
			});
		},
		tabMounted(e) {
			let t = this;
			W(e).find("swiper-container.tabs").each((e) => {
				rf.call(t, e);
			});
		},
		tabShow(e) {
			let t = this;
			W(e).find("swiper-container.tabs").each((e) => {
				let n = t.swiper.get(e);
				n && n.update && n.update();
			});
		},
		tabBeforeRemove(e) {
			let t = this;
			W(e).find("swiper-container.tabs").each((e) => {
				t.swiper.destroy(e);
			});
		}
	}
}, of = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this;
		n.app = e;
		let r = J({ on: {} }, e.params.photoBrowser);
		n.useModulesParams(r), n.params = J(r, t), J(n, {
			exposed: !1,
			opened: !1,
			activeIndex: n.params.swiper.initialSlide,
			url: n.params.url,
			swipeToClose: {
				allow: !0,
				isTouched: !1,
				diff: void 0,
				start: void 0,
				current: void 0,
				started: !1,
				activeSlide: void 0,
				timeStart: void 0
			}
		}), n.useModules(), n.init();
	}
	get view() {
		let { params: e, app: t } = this;
		return e.view || t.views.main;
	}
	onSlideChange(e) {
		let t = this;
		t.activeIndex = e.activeIndex;
		let n = e.activeIndex + 1, r = t.params.virtualSlides ? t.params.photos.length : e.slides.length;
		e.params.loop && (r -= 2, n -= e.loopedSlides, n < 1 && (n = r + n), n > r && (n -= r));
		let i = t.params.virtualSlides ? W(e.wrapperEl).find(`.swiper-slide[data-swiper-slide-index="${e.activeIndex}"]`) : W(e.slides).eq(e.activeIndex), a = t.params.virtualSlides ? W(e.wrapperEl).find(`.swiper-slide[data-swiper-slide-index="${e.previousIndex}"]`) : W(e.slides).eq(e.previousIndex), o = t.$el.find(".photo-browser-current"), s = t.$el.find(".photo-browser-total"), c;
		if (t.params.type === "page" && t.params.navbar && o.length === 0 && t.app.theme === "ios" && (c = t.app.navbar.getElByPage(t.$el), c && (o = W(c).find(".photo-browser-current"), s = W(c).find(".photo-browser-total"))), o.length && s.length && (o.text(n), s.text(r), c ||= o.parents(".navbar")[0], c && t.app.navbar.size(c)), t.captions.length > 0) {
			let n = e.params.loop ? i.attr("data-swiper-slide-index") : t.activeIndex;
			t.$captionsContainerEl.find(".photo-browser-caption-active").removeClass("photo-browser-caption-active"), t.$captionsContainerEl.find(`[data-caption-index="${n}"]`).addClass("photo-browser-caption-active");
		}
		let l = a.find("video");
		l.length > 0 && "pause" in l[0] && l[0].pause();
	}
	onTouchStart() {
		let e = this.swipeToClose;
		e.allow && (e.isTouched = !0);
	}
	onTouchMove(e) {
		let t = this, n = t.swipeToClose;
		n.isTouched && (n.started || (n.started = !0, n.start = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY, t.params.virtualSlides ? n.activeSlide = W(t.swiper.wrapperEl).children(".swiper-slide-active") : n.activeSlide = W(t.swiper.slides).eq(t.swiper.activeIndex), n.timeStart = Ga()), e.preventDefault(), n.current = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY, n.diff = n.start - n.current, t.$el.transition(0).transform(`translate3d(0,${-n.diff}px,0)`));
	}
	onTouchEnd() {
		let e = this, t = e.swipeToClose;
		if (t.isTouched = !1, !t.started) {
			t.started = !1;
			return;
		}
		t.started = !1, t.allow = !1;
		let n = Math.abs(t.diff), r = (/* @__PURE__ */ new Date()).getTime() - t.timeStart;
		if (r < 300 && n > 20 || r >= 300 && n > 100) {
			Ua(() => {
				e.$el && (t.diff < 0 ? e.$el.addClass("swipe-close-to-bottom") : e.$el.addClass("swipe-close-to-top")), e.emit("local::swipeToClose", e), e.$el.transform("").transition(""), e.close(), t.allow = !0;
			});
			return;
		}
		n === 0 ? t.allow = !0 : e.$el.addClass("photo-browser-transitioning").transitionEnd(() => {
			t.allow = !0, e.$el.removeClass("photo-browser-transitioning");
		}), Ua(() => {
			e.$el.transform("").transition("");
		});
	}
	renderNavbar() {
		let e = this;
		if (e.params.renderNavbar) return e.params.renderNavbar.call(e);
		let t = e.params.iconsColor, n = e.app.theme === "ios" && e.params.pageBackLinkText ? e.params.pageBackLinkText : "", r = e.params.navbarShowCount === void 0 ? e.params.photos.length > 1 : e.params.navbarShowCount, i = e.params.type !== "page";
		return Q("div", { class: `navbar navbar-photo-browser ${e.params.theme === "dark" ? "navbar-photo-browser-dark" : ""}` }, Q("div", { class: "navbar-bg" }), Q("div", { class: "navbar-inner navbar-inner-centered-title sliding" }, !i && Q("div", { class: "left" }, Q("a", { class: `link ${n ? "" : "icon-only"} back` }, Q("i", { class: `icon icon-back ${t ? `color-${t}` : ""}` }), n && Q("span", null, n))), r && Q("div", { class: "title" }, Q("span", { class: "photo-browser-current" }), Q("span", { class: "photo-browser-of" }, e.params.navbarOfText), Q("span", { class: "photo-browser-total" })), i && (e.params.popupCloseLinkText || e.params.popupCloseLinkIcon) && Q("div", { class: "right" }, Q("a", {
			class: "link popup-close",
			"data-popup": ".photo-browser-popup"
		}, e.params.popupCloseLinkIcon && e.app.theme === "ios" && Q("i", null, Q("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			width: "56",
			height: "56",
			viewBox: "0 0 56 56"
		}, Q("path", {
			fill: "currentColor",
			d: "M 10.0234 43.0234 C 9.2266 43.8203 9.2031 45.1797 10.0234 45.9766 C 10.8438 46.7734 12.1797 46.7734 13.0000 45.9766 L 28.0000 30.9766 L 43.0000 45.9766 C 43.7969 46.7734 45.1563 46.7969 45.9766 45.9766 C 46.7734 45.1562 46.7734 43.8203 45.9766 43.0234 L 30.9531 28.0000 L 45.9766 13.0000 C 46.7734 12.2031 46.7969 10.8437 45.9766 10.0469 C 45.1328 9.2266 43.7969 9.2266 43.0000 10.0469 L 28.0000 25.0469 L 13.0000 10.0469 C 12.1797 9.2266 10.8203 9.2031 10.0234 10.0469 C 9.2266 10.8672 9.2266 12.2031 10.0234 13.0000 L 25.0234 28.0000 Z"
		}))), e.params.popupCloseLinkIcon && e.app.theme === "md" && Q("i", null, Q("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			height: "24px",
			viewBox: "0 0 24 24",
			width: "24px",
			fill: "currentColor"
		}, Q("path", {
			d: "M0 0h24v24H0V0z",
			fill: "none"
		}), Q("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" }))), e.params.popupCloseLinkText && Q("span", null, e.params.popupCloseLinkText)))));
	}
	renderToolbar() {
		let e = this;
		if (e.params.renderToolbar) return e.params.renderToolbar.call(e);
		let t = e.params.iconsColor;
		return Q("div", { class: "toolbar toolbar-bottom tabbar" }, Q("div", { class: "toolbar-inner" }, Q("a", { class: "link photo-browser-prev" }, Q("i", { class: `icon icon-back ${t ? `color-${t}` : ""}` })), Q("a", { class: "link photo-browser-next" }, Q("i", { class: `icon icon-forward ${t ? `color-${t}` : ""}` }))));
	}
	renderThumbs() {
		let e = this;
		return Q("div", { class: "toolbar toolbar-bottom photo-browser-thumbs" }, Q("div", { class: "swiper" }, Q("div", { class: "swiper-wrapper" }, e.params.thumbs.map((t, n) => e.renderThumb(t, n)))));
	}
	renderCaption(e, t) {
		let n = this;
		return n.params.renderCaption ? n.params.renderCaption.call(n, e, t) : Q("div", {
			class: "photo-browser-caption",
			"data-caption-index": t
		}, e);
	}
	renderObject(e, t) {
		let n = this;
		return n.params.renderObject ? n.params.renderObject.call(n, e, t) : Q("div", {
			class: "photo-browser-slide photo-browser-object-slide swiper-slide",
			"data-swiper-slide-index": t
		}, e.html ? e.html : e);
	}
	renderLazyPhoto(e, t) {
		let n = this;
		return n.params.renderLazyPhoto ? n.params.renderLazyPhoto.call(n, e, t) : Q("div", {
			class: "photo-browser-slide photo-browser-slide-lazy swiper-slide",
			"data-swiper-slide-index": t
		}, Q("div", { class: "swiper-lazy-preloader" }), Q("span", { class: "swiper-zoom-container" }, Q("img", {
			loading: "lazy",
			src: e.url ? e.url : e
		})));
	}
	renderPhoto(e, t) {
		let n = this;
		return n.params.renderPhoto ? n.params.renderPhoto.call(n, e, t) : Q("div", {
			class: "photo-browser-slide swiper-slide",
			"data-swiper-slide-index": t
		}, Q("span", { class: "swiper-zoom-container" }, Q("img", { src: e.url ? e.url : e })));
	}
	renderThumb(e, t) {
		let n = this, r = typeof e == "string" ? e : e.url;
		return n.params.renderThumb ? n.params.renderThumb.call(n, e, t) : Q("div", {
			class: "photo-browser-thumbs-slide swiper-slide",
			"data-swiper-slide-index": t
		}, r && Q("img", {
			src: r,
			loading: "lazy"
		}));
	}
	render() {
		let e = this;
		return e.params.render ? e.params.render.call(e, e.params) : Q("div", { class: `photo-browser photo-browser-${e.params.theme}` }, Q("div", { class: "view" }, Q("div", {
			class: `page photo-browser-page photo-browser-page-${e.params.theme} no-toolbar ${e.params.navbar ? "" : "no-navbar"}`,
			"data-name": "photo-browser-page"
		}, e.params.navbar && e.renderNavbar(), e.params.toolbar && e.renderToolbar(), e.params.thumbs && e.params.thumbs.length && e.renderThumbs(), Q("div", { class: `photo-browser-captions photo-browser-captions-${e.params.captionsTheme || e.params.theme}` }, e.params.photos.map((t, n) => t.caption ? e.renderCaption(t.caption, n) : "")), Q("div", { class: "photo-browser-swiper-container swiper" }, Q("div", { class: "photo-browser-swiper-wrapper swiper-wrapper" }, !e.params.virtualSlides && e.params.photos.map((t, n) => t.html || (typeof t == "string" || t instanceof String) && t.indexOf("<") >= 0 && t.indexOf(">") >= 0 ? e.renderObject(t, n) : e.params.lazy === !0 ? e.renderLazyPhoto(t, n) : e.renderPhoto(t, n)))))));
	}
	renderStandalone() {
		let e = this;
		return e.params.renderStandalone ? e.params.renderStandalone.call(e) : `<div class="popup photo-browser-popup photo-browser-standalone popup-tablet-fullscreen">${e.render()}</div>`;
	}
	renderPage() {
		let e = this;
		return e.params.renderPage ? e.params.renderPage.call(e) : e.render();
	}
	renderPopup() {
		let e = this;
		return e.params.renderPopup ? e.params.renderPopup.call(e) : `<div class="popup photo-browser-popup">${e.render()}</div>`;
	}
	onOpen(e, t) {
		let n = this, r = n.app, i = W(t);
		i[0].f7PhotoBrowser = n, n.$el = i, n.el = i[0], n.openedIn = e, n.opened = !0, n.$swiperContainerEl = n.$el.find(".photo-browser-swiper-container"), n.$swiperWrapperEl = n.$el.find(".photo-browser-swiper-wrapper"), n.slides = n.$el.find(".photo-browser-slide"), n.$captionsContainerEl = n.$el.find(".photo-browser-captions"), n.captions = n.$el.find(".photo-browser-caption");
		let a = n.params.thumbs && n.params.thumbs.length > 0, o, s, c, l = n.activeIndex, u = J({}, n.params.swiper, {
			initialSlide: l,
			on: {
				click(e) {
					clearTimeout(o), n.params.exposition && (o = setTimeout(() => {
						n.expositionToggle();
					}, 350)), n.emit("local::tap", e), n.emit("local::click", e);
				},
				doubleClick(e) {
					clearTimeout(o), n.emit("local::doubleTap", e), n.emit("local::doubleClick", e);
				},
				slideChange() {
					let e = this;
					a && n.thumbsSwiper && !c && (s = !0, n.thumbsSwiper.slideTo(n.swiper.activeIndex), setTimeout(() => {
						s = !1;
					})), n.onSlideChange(e);
					var t = [...arguments];
					n.emit("local::slideChange", ...t);
				},
				transitionStart() {
					var e = [...arguments];
					n.emit("local::transitionStart", ...e);
				},
				transitionEnd() {
					var e = [...arguments];
					n.emit("local::transitionEnd", ...e);
				},
				slideChangeTransitionStart() {
					let e = this;
					n.onSlideChange(e);
					var t = [...arguments];
					n.emit("local::slideChangeTransitionStart", ...t);
				},
				slideChangeTransitionEnd() {
					var e = [...arguments];
					n.emit("local::slideChangeTransitionEnd", ...e);
				}
			}
		});
		n.params.swipeToClose && n.params.type !== "page" && J(u.on, {
			touchStart(e, t) {
				n.onTouchStart(t), n.emit("local::touchStart", t);
			},
			touchMoveOpposite(e, t) {
				n.onTouchMove(t), n.emit("local::touchMoveOpposite", t);
			},
			touchEnd(e, t) {
				n.onTouchEnd(t), n.emit("local::touchEnd", t);
			}
		}), n.params.virtualSlides && J(u, { virtual: {
			slides: n.params.photos,
			renderSlide(e, t) {
				return e.html || (typeof e == "string" || e instanceof String) && e.indexOf("<") >= 0 && e.indexOf(">") >= 0 ? n.renderObject(e, t) : n.params.lazy === !0 ? n.renderLazyPhoto(e, t) : n.renderPhoto(e, t);
			}
		} });
		let d = H();
		if (n.swiper = r.swiper ? r.swiper.create(n.$swiperContainerEl[0], u) : new d.Swiper(n.$swiperContainerEl[0], u), (n.activeIndex === 0 || n.params.virtualSlides) && n.onSlideChange(n.swiper), a) {
			let e = {
				el: n.$el.find(".photo-browser-thumbs .swiper")[0],
				slidesPerView: "auto",
				centeredSlides: !0,
				spaceBetween: 4,
				watchSlidesProgress: !0,
				initialSlide: l,
				on: {
					touchMove() {
						c = !0;
					},
					touchEnd() {
						c = !1;
					},
					slideChange(e) {
						s || n.swiper.slideTo(e.activeIndex, 0);
					},
					click(e) {
						if (!e.clickedSlide) return;
						let t = parseInt(W(e.clickedSlide).attr("data-swiper-slide-index"), 10);
						e.slideTo(t, 0);
					}
				}
			};
			n.thumbsSwiper = r.swiper ? r.swiper.create(e) : new d.Swiper(e);
		}
		n.$el && n.$el.trigger("photobrowser:open"), n.emit("local::open photoBrowserOpen", n);
	}
	onOpened() {
		let e = this;
		e.$el && e.params.type === "standalone" && e.$el.css("animation", "none"), e.$el && e.$el.trigger("photobrowser:opened"), e.emit("local::opened photoBrowserOpened", e);
	}
	onClose() {
		let e = this;
		e.destroyed || (e.swiper && e.swiper.destroy && (e.swiper.destroy(!0, !1), e.swiper = null, delete e.swiper), e.thumbsSwiper && e.thumbsSwiper.destroy && (e.thumbsSwiper.destroy(!0, !1), e.thumbsSwiper = null, delete e.thumbsSwiper), e.$el && e.$el.trigger("photobrowser:close"), e.emit("local::close photoBrowserClose", e));
	}
	onClosed() {
		let e = this;
		e.destroyed || (e.opened = !1, e.$el = null, e.el = null, delete e.$el, delete e.el, e.$el && e.$el.trigger("photobrowser:closed"), e.emit("local::closed photoBrowserClosed", e));
	}
	openPage() {
		let e = this;
		if (e.opened) return e;
		let t = e.renderPage();
		return e.view.router.navigate({
			url: e.url,
			route: {
				content: t,
				path: e.url,
				on: {
					pageBeforeIn(t, n) {
						e.view.$el.addClass(`with-photo-browser-page with-photo-browser-page-${e.params.theme}`), e.onOpen("page", n.el);
					},
					pageAfterIn(t, n) {
						e.onOpened("page", n.el);
					},
					pageBeforeOut(t, n) {
						e.view.$el.removeClass(`with-photo-browser-page with-photo-browser-page-exposed with-photo-browser-page-${e.params.theme}`), e.onClose("page", n.el);
					},
					pageAfterOut(t, n) {
						e.onClosed("page", n.el);
					}
				}
			}
		}), e;
	}
	openStandalone() {
		let e = this;
		if (e.opened) return e;
		let t = {
			backdrop: !1,
			content: e.renderStandalone(),
			on: {
				popupOpen(t) {
					e.onOpen("popup", t.el);
				},
				popupOpened(t) {
					e.onOpened("popup", t.el);
				},
				popupClose(t) {
					e.onClose("popup", t.el);
				},
				popupClosed(t) {
					e.onClosed("popup", t.el);
				}
			}
		};
		return e.params.routableModals && e.view ? e.view.router.navigate({
			url: e.url,
			route: {
				path: e.url,
				popup: t
			}
		}) : e.modal = e.app.popup.create(t).open(), e;
	}
	openPopup() {
		let e = this;
		if (e.opened) return e;
		let t = {
			content: e.renderPopup(),
			push: e.params.popupPush,
			closeByBackdropClick: e.params.closeByBackdropClick,
			on: {
				popupOpen(t) {
					e.onOpen("popup", t.el);
				},
				popupOpened(t) {
					e.onOpened("popup", t.el);
				},
				popupClose(t) {
					e.onClose("popup", t.el);
				},
				popupClosed(t) {
					e.onClosed("popup", t.el);
				}
			}
		};
		return e.params.routableModals && e.view ? e.view.router.navigate({
			url: e.url,
			route: {
				path: e.url,
				popup: t
			}
		}) : e.modal = e.app.popup.create(t).open(), e;
	}
	expositionEnable() {
		let e = this;
		return e.params.type === "page" && e.view.$el.addClass("with-photo-browser-page-exposed"), e.$el && e.$el.addClass("photo-browser-exposed"), e.params.expositionHideCaptions && e.$captionsContainerEl.addClass("photo-browser-captions-exposed"), e.exposed = !0, e;
	}
	expositionDisable() {
		let e = this;
		return e.params.type === "page" && e.view.$el.removeClass("with-photo-browser-page-exposed"), e.$el && e.$el.removeClass("photo-browser-exposed"), e.params.expositionHideCaptions && e.$captionsContainerEl.removeClass("photo-browser-captions-exposed"), e.exposed = !1, e;
	}
	expositionToggle() {
		let e = this;
		return e.params.type === "page" && e.view.$el.toggleClass("with-photo-browser-page-exposed"), e.$el && e.$el.toggleClass("photo-browser-exposed"), e.params.expositionHideCaptions && e.$captionsContainerEl.toggleClass("photo-browser-captions-exposed"), e.exposed = !e.exposed, e;
	}
	open(e) {
		let t = this, n = t.params.type;
		return t.opened ? (t.swiper && e !== void 0 && t.swiper.slideTo(parseInt(e, 10)), t) : (e !== void 0 && (t.activeIndex = e), n === "standalone" && t.openStandalone(), n === "page" && t.openPage(), n === "popup" && t.openPopup(), t);
	}
	close() {
		let e = this;
		return e.opened && (e.params.routableModals && e.view || e.openedIn === "page" ? e.view.router.back() : (e.modal.once("modalClosed", () => {
			Ua(() => {
				e.destroyed || (e.modal.destroy(), delete e.modal);
			});
		}), e.modal.close())), e;
	}
	init() {}
	destroy() {
		let e = this;
		e.emit("local::beforeDestroy photoBrowserBeforeDestroy", e), e.$el && (e.$el.trigger("photobrowser:beforedestroy"), e.$el[0].f7PhotoBrowser = null, delete e.$el[0].f7PhotoBrowser), Ba(e), e.destroyed = !0, e = null;
	}
}, sf = {
	name: "photoBrowser",
	params: { photoBrowser: {
		photos: [],
		thumbs: [],
		exposition: !0,
		expositionHideCaptions: !1,
		type: "standalone",
		navbar: !0,
		toolbar: !0,
		theme: "light",
		captionsTheme: void 0,
		iconsColor: void 0,
		popupPush: !1,
		swipeToClose: !0,
		pageBackLinkText: "Back",
		popupCloseLinkText: void 0,
		popupCloseLinkIcon: !0,
		navbarOfText: "of",
		navbarShowCount: void 0,
		view: void 0,
		url: "photos/",
		routableModals: !1,
		virtualSlides: !0,
		lazy: !0,
		closeByBackdropClick: !0,
		renderNavbar: void 0,
		renderToolbar: void 0,
		renderCaption: void 0,
		renderObject: void 0,
		renderLazyPhoto: void 0,
		renderPhoto: void 0,
		renderThumb: void 0,
		renderPage: void 0,
		renderPopup: void 0,
		renderStandalone: void 0,
		swiper: {
			cssMode: !1,
			initialSlide: 0,
			spaceBetween: 20,
			speed: 300,
			loop: !1,
			keyboard: { enabled: !0 },
			navigation: {
				nextEl: ".photo-browser-next",
				prevEl: ".photo-browser-prev"
			},
			zoom: {
				enabled: !0,
				maxRatio: 3,
				minRatio: 1
			}
		}
	} },
	create() {
		let e = this;
		e.photoBrowser = ho({
			defaultSelector: ".photo-browser-popup, .photo-browser-page",
			constructor: of,
			app: e,
			domProp: "f7PhotoBrowser"
		});
	},
	static: { PhotoBrowser: of }
}, cf = class extends Os {
	constructor(e, t) {
		let n = J({ on: {} }, e.params.notification, t);
		super(e, n);
		let r = this;
		r.app = e, r.params = n;
		let { icon: i, title: a, titleRightText: o, subtitle: s, text: c, closeButton: l, closeTimeout: u, cssClass: d, closeOnClick: f } = r.params, p;
		if (p = r.params.el ? W(r.params.el) : W(r.render({
			icon: i,
			title: a,
			titleRightText: o,
			subtitle: s,
			text: c,
			closeButton: l,
			cssClass: d
		})), p && p.length > 0 && p[0].f7Modal) return p[0].f7Modal;
		if (p.length === 0) return r.destroy();
		J(r, {
			$el: p,
			el: p[0],
			type: "notification"
		}), p[0].f7Modal = r, l && p.find(".notification-close-button").on("click", () => {
			r.close();
		}), p.on("click", (e) => {
			l && W(e.target).closest(".notification-close-button").length || (r.emit("local::click notificationClick", r), f && r.close());
		}), r.on("beforeDestroy", () => {
			p.off("click");
		});
		let m, h, g, _, v, y, b = {};
		function x(e) {
			m || (m = !0, h = !1, g = void 0, v = Ga(), b.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, b.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY);
		}
		function S(e) {
			if (!m) return;
			let t = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX, n = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
			if (g === void 0 && (g = !!(g || Math.abs(n - b.y) < Math.abs(t - b.x))), g) {
				m = !1;
				return;
			}
			e.preventDefault(), h || (r.$el.removeClass("notification-transitioning"), r.$el.transition(0), y = r.$el[0].offsetHeight / 2), h = !0, _ = n - b.y;
			let i = _;
			_ > 0 && (i = _ ** .8), r.$el.transform(`translate3d(0, ${i}px, 0)`);
		}
		function C() {
			if (!m || !h) {
				m = !1, h = !1;
				return;
			}
			if (m = !1, h = !1, _ === 0) return;
			let e = Ga() - v;
			r.$el.transition(""), r.$el.addClass("notification-transitioning"), r.$el.transform(""), (_ < -10 && e < 300 || -_ >= y / 1) && r.close();
		}
		function w() {
			r.$el.on(e.touchEvents.start, x, { passive: !0 }), e.on("touchmove:active", S), e.on("touchend:passive", C);
		}
		function T() {
			r.$el.off(e.touchEvents.start, x, { passive: !0 }), e.off("touchmove:active", S), e.off("touchend:passive", C);
		}
		let E;
		function D() {
			E = Ua(() => {
				if (m && h) {
					D();
					return;
				}
				r.close();
			}, u);
		}
		return r.on("open", () => {
			r.params.swipeToClose && w(), W(".notification.modal-in").each((t) => {
				let n = e.notification.get(t);
				t !== r.el && n && n.close();
			}), u && D();
		}), r.on("close beforeDestroy", () => {
			r.params.swipeToClose && T(), clearTimeout(E);
		}), r;
	}
	render() {
		let e = this;
		if (e.params.render) return e.params.render.call(e, e);
		let { icon: t, title: n, titleRightText: r, subtitle: i, text: a, closeButton: o, cssClass: s } = e.params;
		return Q("div", { class: `notification ${t ? "notification-with-icon" : ""} ${s || ""}` }, Q("div", { class: "notification-header" }, t && Q("div", { class: "notification-icon" }, t), n && Q("div", { class: "notification-title" }, n), r && Q("div", { class: "notification-title-right-text" }, r), o && Q("span", { class: "notification-close-button" })), Q("div", { class: "notification-content" }, i && Q("div", { class: "notification-subtitle" }, i), a && Q("div", { class: "notification-text" }, a)));
	}
}, lf = {
	name: "notification",
	static: { Notification: cf },
	create() {
		let e = this;
		e.notification = J({}, go({
			app: e,
			constructor: cf,
			defaultSelector: ".notification.modal-in"
		}));
	},
	params: { notification: {
		icon: null,
		title: null,
		titleRightText: null,
		subtitle: null,
		text: null,
		closeButton: !1,
		closeTimeout: null,
		closeOnClick: !1,
		swipeToClose: !0,
		cssClass: null,
		render: null,
		containerEl: null
	} }
}, uf = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this;
		n.app = e;
		let r = X(), i = J({ on: {} }, e.params.autocomplete);
		n.useModulesParams(i), n.params = J(i, t);
		let a;
		n.params.openerEl && (a = W(n.params.openerEl), a.length && (a[0].f7Autocomplete = n));
		let o;
		n.params.inputEl && (o = W(n.params.inputEl), o.length && (o[0].f7Autocomplete = n));
		let s = Ia(), c = t.url;
		!c && a && a.length && (a.attr("href") ? c = a.attr("href") : a.find("a").length > 0 && (c = a.find("a").attr("href"))), (!c || c === "#" || c === "") && (c = n.params.url);
		let l = n.params.multiple ? "checkbox" : "radio";
		J(n, {
			$openerEl: a,
			openerEl: a && a[0],
			$inputEl: o,
			inputEl: o && o[0],
			id: s,
			url: c,
			value: n.params.value || [],
			inputType: l,
			inputName: `${l}-${s}`,
			$modalEl: void 0,
			$dropdownEl: void 0
		});
		let u = "";
		function d() {
			let e = n.$inputEl.val().trim();
			n.params.source && n.params.source.call(n, e, (t) => {
				let r = "", i = n.params.limit ? Math.min(n.params.limit, t.length) : t.length;
				n.items = t;
				let a;
				n.params.highlightMatches && (e = e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), a = RegExp(`(${e})`, "i"));
				let s, c;
				for (let e = 0; e < i; e += 1) {
					let i = typeof t[e] == "object" ? t[e][n.params.valueProperty] : t[e], o = typeof t[e] == "object" ? t[e][n.params.textProperty] : t[e];
					e === 0 && (s = i, c = n.items[e]), r += n.renderItem({
						value: i,
						text: n.params.highlightMatches ? o.replace(a, "<b>$1</b>") : o
					}, e);
				}
				if (r === "" && e === "" && n.params.dropdownPlaceholderText && (r += n.renderItem({
					placeholder: !0,
					text: n.params.dropdownPlaceholderText
				})), n.$dropdownEl.find("ul").html(r), n.params.typeahead) {
					if (!s || !c || s.toLowerCase().indexOf(e.toLowerCase()) !== 0) return;
					if (u.toLowerCase() === e.toLowerCase()) {
						n.value = [];
						return;
					}
					if (u.toLowerCase().indexOf(e.toLowerCase()) === 0) {
						u = e, n.value = [];
						return;
					}
					o.val(s), o[0].setSelectionRange(e.length, s.length);
					let t = typeof n.value[0] == "object" ? n.value[0][n.params.valueProperty] : n.value[0];
					(!t || s.toLowerCase() !== t.toLowerCase()) && (n.value = [c], n.emit("local::change autocompleteChange", [c]));
				}
				u = e;
			});
		}
		function f() {
			let e = this, t = e.value, r = W(e).parents(".autocomplete-values").length > 0, i, a, o;
			if (r) {
				if (n.inputType === "checkbox" && !e.checked) {
					for (let e = 0; e < n.value.length; e += 1) o = typeof n.value[e] == "string" ? n.value[e] : n.value[e][n.params.valueProperty], (o === t || o * 1 == t * 1) && n.value.splice(e, 1);
					n.updateValues(), n.emit("local::change autocompleteChange", n.value);
				}
				return;
			}
			for (let e = 0; e < n.items.length; e += 1) a = typeof n.items[e] == "object" ? n.items[e][n.params.valueProperty] : n.items[e], (a === t || a * 1 == t * 1) && (i = n.items[e]);
			if (n.inputType === "radio") n.value = [i];
			else if (e.checked) n.value.push(i);
			else for (let e = 0; e < n.value.length; e += 1) o = typeof n.value[e] == "object" ? n.value[e][n.params.valueProperty] : n.value[e], (o === t || o * 1 == t * 1) && n.value.splice(e, 1);
			n.updateValues(), (n.inputType === "radio" && e.checked || n.inputType === "checkbox") && n.emit("local::change autocompleteChange", n.value);
		}
		function p(e) {
			let t = W(e.target);
			t.is(n.$inputEl[0]) || n.$dropdownEl && t.closest(n.$dropdownEl[0]).length || n.close();
		}
		function m() {
			n.open();
		}
		function h() {
			n.open();
		}
		function g() {
			n.$dropdownEl.find("label.active-state").length > 0 || setTimeout(() => {
				n.close();
			}, 0);
		}
		function _() {
			n.positionDropdown();
		}
		function v(e) {
			if (!n.opened) return;
			if (e.keyCode === 27) {
				e.preventDefault(), n.$inputEl.blur();
				return;
			}
			if (e.keyCode === 13) {
				let t = n.$dropdownEl.find(".autocomplete-dropdown-selected label");
				if (t.length) {
					e.preventDefault(), t.trigger("click"), n.$inputEl.blur();
					return;
				}
				n.params.typeahead && (e.preventDefault(), n.$inputEl.blur());
				return;
			}
			if (e.keyCode !== 40 && e.keyCode !== 38) return;
			e.preventDefault();
			let t = n.$dropdownEl.find(".autocomplete-dropdown-selected"), r;
			t.length ? (r = t[e.keyCode === 40 ? "next" : "prev"]("li"), r.length || (r = n.$dropdownEl.find("li").eq(e.keyCode === 40 ? 0 : n.$dropdownEl.find("li").length - 1))) : r = n.$dropdownEl.find("li").eq(e.keyCode === 40 ? 0 : n.$dropdownEl.find("li").length - 1), !r.hasClass("autocomplete-dropdown-placeholder") && (t.removeClass("autocomplete-dropdown-selected"), r.addClass("autocomplete-dropdown-selected"));
		}
		function y() {
			let e = W(this), t;
			for (let r = 0; r < n.items.length; r += 1) {
				let i = typeof n.items[r] == "object" ? n.items[r][n.params.valueProperty] : n.items[r], a = e.attr("data-value");
				(i === a || i * 1 == a * 1) && (t = n.items[r]);
			}
			n.params.updateInputValueOnSelect && (n.$inputEl.val(typeof t == "object" ? t[n.params.valueProperty] : t), n.$inputEl.trigger("input change")), n.value = [t], n.emit("local::change autocompleteChange", [t]), n.close();
		}
		return n.attachEvents = function() {
			n.params.openIn !== "dropdown" && n.$openerEl && n.$openerEl.on("click", m), n.params.openIn === "dropdown" && n.$inputEl && (n.$inputEl.on("focus", h), n.$inputEl.on(n.params.inputEvents, d), r.android ? W("html").on("click", p) : n.$inputEl.on("blur", g), n.$inputEl.on("keydown", v));
		}, n.detachEvents = function() {
			n.params.openIn !== "dropdown" && n.$openerEl && n.$openerEl.off("click", m), n.params.openIn === "dropdown" && n.$inputEl && (n.$inputEl.off("focus", h), n.$inputEl.off(n.params.inputEvents, d), r.android ? W("html").off("click", p) : n.$inputEl.off("blur", g), n.$inputEl.off("keydown", v));
		}, n.attachDropdownEvents = function() {
			n.$dropdownEl.on("click", "label", y), e.on("resize", _);
		}, n.detachDropdownEvents = function() {
			n.$dropdownEl.off("click", "label", y), e.off("resize", _);
		}, n.attachPageEvents = function() {
			n.$el.on("change", "input[type=\"radio\"], input[type=\"checkbox\"]", f), n.params.closeOnSelect && !n.params.multiple && n.$el.once("click", ".list label", () => {
				Ua(() => {
					n.close();
				});
			});
		}, n.detachPageEvents = function() {
			n.$el.off("change", "input[type=\"radio\"], input[type=\"checkbox\"]", f);
		}, n.useModules(), n.init(), n;
	}
	get view() {
		let e = this, { $openerEl: t, $inputEl: n, app: r } = e, i;
		if (e.params.view) i = e.params.view;
		else if (t || n) {
			let e = t || n;
			i = e.closest(".view").length && e.closest(".view")[0].f7View;
		}
		return i ||= r.views.main, i;
	}
	positionDropdown() {
		let { $inputEl: e, app: t, $dropdownEl: n } = this, r = e.parents(".page-content");
		if (r.length === 0) return;
		let i = e.offset(), a = e[0].offsetWidth, o = e[0].offsetHeight, s = e.parents(".list"), c;
		s.parents().each((e) => {
			if (c) return;
			let t = W(e);
			t.parent(r).length && (c = t);
		});
		let l = s.offset(), u = parseInt(r.css("padding-bottom"), 10), d = s.length > 0 ? l.left - r.offset().left : 0, f = i.left - (s.length > 0 ? l.left : 0) - (t.rtl, 0), p = i.top - (r.offset().top - r[0].scrollTop), m = r[0].scrollHeight - u - (p + r[0].scrollTop) - e[0].offsetHeight, h = t.rtl ? "padding-right" : "padding-left", g;
		s.length && (g = (t.rtl ? s[0].offsetWidth - f - a : f) - (t.theme === "md" ? 16 : 15)), n.css({
			left: `${s.length > 0 ? d : f}px`,
			top: `${p + r[0].scrollTop + o}px`,
			width: `${s.length > 0 ? s[0].offsetWidth : a}px`
		}), n.children(".autocomplete-dropdown-inner").css({
			maxHeight: `${m}px`,
			[h]: s.length > 0 ? `${g}px` : ""
		});
	}
	focus() {
		this.$el.find("input[type=search]").focus();
	}
	source(e) {
		let t = this;
		if (!t.params.source) return;
		let { $el: n } = t;
		t.params.source.call(t, e, (r) => {
			let i = "", a = t.params.limit ? Math.min(t.params.limit, r.length) : r.length;
			t.items = r;
			for (let e = 0; e < a; e += 1) {
				let n = !1, a = typeof r[e] == "object" ? r[e][t.params.valueProperty] : r[e];
				for (let e = 0; e < t.value.length; e += 1) {
					let r = typeof t.value[e] == "object" ? t.value[e][t.params.valueProperty] : t.value[e];
					(r === a || r * 1 == a * 1) && (n = !0);
				}
				i += t.renderItem({
					value: a,
					text: typeof r[e] == "object" ? r[e][t.params.textProperty] : r[e],
					inputType: t.inputType,
					id: t.id,
					inputName: t.inputName,
					selected: n
				}, e);
			}
			n.find(".autocomplete-found ul").html(i), r.length === 0 ? e.length === 0 ? (n.find(".autocomplete-values").show(), n.find(".autocomplete-found, .autocomplete-not-found").hide()) : (n.find(".autocomplete-not-found").show(), n.find(".autocomplete-found, .autocomplete-values").hide()) : (n.find(".autocomplete-found").show(), n.find(".autocomplete-not-found, .autocomplete-values").hide());
		});
	}
	updateValues() {
		let e = this, t = "";
		for (let n = 0; n < e.value.length; n += 1) t += e.renderItem({
			value: typeof e.value[n] == "object" ? e.value[n][e.params.valueProperty] : e.value[n],
			text: typeof e.value[n] == "object" ? e.value[n][e.params.textProperty] : e.value[n],
			inputType: e.inputType,
			id: e.id,
			inputName: `${e.inputName}-checked}`,
			selected: !0
		}, n);
		e.$el.find(".autocomplete-values ul").html(t);
	}
	preloaderHide() {
		let e = this;
		e.params.openIn === "dropdown" && e.$dropdownEl ? e.$dropdownEl.find(".autocomplete-preloader").removeClass("autocomplete-preloader-visible") : W(".autocomplete-preloader").removeClass("autocomplete-preloader-visible");
	}
	preloaderShow() {
		let e = this;
		e.params.openIn === "dropdown" && e.$dropdownEl ? e.$dropdownEl.find(".autocomplete-preloader").addClass("autocomplete-preloader-visible") : W(".autocomplete-preloader").addClass("autocomplete-preloader-visible");
	}
	renderPreloader() {
		let e = this, t = {
			iosPreloaderContent: Ra,
			mdPreloaderContent: La
		};
		return Q("div", { class: `autocomplete-preloader preloader ${e.params.preloaderColor ? `color-${e.params.preloaderColor}` : ""}` }, t[`${e.app.theme}PreloaderContent`] || "");
	}
	renderSearchbar() {
		let e = this;
		return e.params.renderSearchbar ? e.params.renderSearchbar.call(e) : Q("form", { class: "searchbar" }, Q("div", { class: "searchbar-inner" }, Q("div", { class: "searchbar-input-wrap" }, Q("input", {
			type: "search",
			spellcheck: e.params.searchbarSpellcheck || "false",
			placeholder: e.params.searchbarPlaceholder
		}), Q("i", { class: "searchbar-icon" }), Q("span", { class: "input-clear-button" })), e.params.searchbarDisableButton && Q("span", { class: "searchbar-disable-button" }, e.params.searchbarDisableText)));
	}
	renderItem(e, t) {
		let n = this;
		if (n.params.renderItem) return n.params.renderItem.call(n, e, t);
		let r = e.value && typeof e.value == "string" ? e.value.replace(/"/g, "&quot;") : e.value;
		return n.params.openIn === "dropdown" ? e.placeholder ? Q("li", { class: "autocomplete-dropdown-placeholder" }, Q("label", { class: "item-content" }, Q("div", { class: "item-inner" }, Q("div", { class: "item-title" }, e.text)))) : Q("li", null, Q("label", {
			class: "item-radio item-content",
			"data-value": r
		}, Q("div", { class: "item-inner" }, Q("div", { class: "item-title" }, e.text)))) : Q("li", null, Q("label", { class: `item-${e.inputType} item-content` }, Q("input", {
			type: e.inputType,
			name: e.inputName,
			value: r,
			_checked: e.selected
		}), Q("i", { class: `icon icon-${e.inputType}` }), Q("div", { class: "item-inner" }, Q("div", { class: "item-title" }, e.text))));
	}
	renderNavbar() {
		let e = this;
		if (e.params.renderNavbar) return e.params.renderNavbar.call(e);
		let t = e.params.pageTitle;
		t === void 0 && e.$openerEl && e.$openerEl.length && (t = e.$openerEl.find(".item-title").text().trim());
		let n = e.params.openIn === "popup", r = n ? e.params.preloader && Q("div", { class: "left" }, e.renderPreloader()) : Q("div", { class: "left sliding" }, Q("a", { class: "link back" }, Q("i", { class: "icon icon-back" }), Q("span", { class: "if-not-md" }, e.params.pageBackLinkText))), i = n ? Q("div", { class: "right" }, Q("a", {
			class: "link popup-close",
			"data-popup": ".autocomplete-popup"
		}, e.params.popupCloseLinkText)) : e.params.preloader && Q("div", { class: "right" }, e.renderPreloader());
		return Q("div", { class: `navbar ${e.params.navbarColorTheme ? `color-${e.params.navbarColorTheme}` : ""}` }, Q("div", { class: "navbar-bg" }), Q("div", { class: `navbar-inner ${e.params.navbarColorTheme ? `color-${e.params.navbarColorTheme}` : ""}` }, r, t && Q("div", { class: "title sliding" }, t), i, Q("div", { class: "subnavbar sliding" }, e.renderSearchbar())));
	}
	renderDropdown() {
		let e = this;
		return e.params.renderDropdown ? e.params.renderDropdown.call(e, e.items) : Q("div", { class: "autocomplete-dropdown" }, Q("div", { class: "autocomplete-dropdown-inner" }, Q("div", { class: "list no-safe-areas" }, Q("ul", null))), e.params.preloader && e.renderPreloader());
	}
	renderPage(e) {
		let t = this;
		return t.params.renderPage ? t.params.renderPage.call(t, t.items) : Q("div", {
			class: "page page-with-subnavbar autocomplete-page",
			"data-name": "autocomplete-page"
		}, t.renderNavbar(e), Q("div", { class: "searchbar-backdrop" }), Q("div", { class: "page-content" }, Q("div", { class: `list autocomplete-list autocomplete-found autocomplete-list-${t.id} ${t.params.formColorTheme ? `color-${t.params.formColorTheme}` : ""}` }, Q("ul", null)), Q("div", { class: "list autocomplete-not-found" }, Q("ul", null, Q("li", { class: "item-content" }, Q("div", { class: "item-inner" }, Q("div", { class: "item-title" }, t.params.notFoundText))))), Q("div", { class: "list autocomplete-values" }, Q("ul", null))));
	}
	renderPopup() {
		let e = this;
		return e.params.renderPopup ? e.params.renderPopup.call(e, e.items) : Q("div", { class: "popup autocomplete-popup" }, Q("div", { class: "view" }, e.renderPage(!0), ";"));
	}
	onOpen(e, t) {
		let n = this, r = n.app, i = W(t);
		if (n.$el = i, n.el = i[0], n.openedIn = e, n.opened = !0, n.params.openIn === "dropdown") n.attachDropdownEvents(), n.$dropdownEl.addClass("autocomplete-dropdown-in"), n.$inputEl.trigger("input");
		else {
			let e = i.find(".searchbar");
			n.params.openIn === "page" && r.theme === "ios" && e.length === 0 && (e = W(r.navbar.getElByPage(i)).find(".searchbar")), n.searchbar = r.searchbar.create({
				el: e,
				backdropEl: i.find(".searchbar-backdrop"),
				customSearch: !0,
				on: { search(e, t) {
					t.length === 0 && n.searchbar.enabled ? n.searchbar.backdropShow() : n.searchbar.backdropHide(), n.source(t);
				} }
			}), n.attachPageEvents(), n.updateValues(), n.params.requestSourceOnOpen && n.source("");
		}
		n.emit("local::open autocompleteOpen", n);
	}
	autoFocus() {
		let e = this;
		return e.searchbar && e.searchbar.$inputEl && e.searchbar.$inputEl.focus(), e;
	}
	onOpened() {
		let e = this;
		e.params.openIn !== "dropdown" && e.params.autoFocus && e.autoFocus(), e.emit("local::opened autocompleteOpened", e);
	}
	onClose() {
		let e = this;
		e.destroyed || (e.searchbar && e.searchbar.destroy && (e.searchbar.destroy(), e.searchbar = null, delete e.searchbar), e.params.openIn === "dropdown" ? (e.detachDropdownEvents(), e.$dropdownEl.removeClass("autocomplete-dropdown-in").remove()) : e.detachPageEvents(), e.emit("local::close autocompleteClose", e));
	}
	onClosed() {
		let e = this;
		e.destroyed || (e.opened = !1, e.$el = null, e.el = null, delete e.$el, delete e.el, e.emit("local::closed autocompleteClosed", e));
	}
	openPage() {
		let e = this;
		if (e.opened) return e;
		let t = e.renderPage();
		return e.view.router.navigate({
			url: e.url,
			route: {
				content: t,
				path: e.url,
				on: {
					pageBeforeIn(t, n) {
						e.onOpen("page", n.el);
					},
					pageAfterIn(t, n) {
						e.onOpened("page", n.el);
					},
					pageBeforeOut(t, n) {
						e.onClose("page", n.el);
					},
					pageAfterOut(t, n) {
						e.onClosed("page", n.el);
					}
				},
				options: { animate: e.params.animate }
			}
		}), e;
	}
	openPopup() {
		let e = this;
		if (e.opened) return e;
		let t = {
			content: e.renderPopup(),
			animate: e.params.animate,
			push: e.params.popupPush,
			swipeToClose: e.params.popupSwipeToClose,
			on: {
				popupOpen(t) {
					e.onOpen("popup", t.el);
				},
				popupOpened(t) {
					e.onOpened("popup", t.el);
				},
				popupClose(t) {
					e.onClose("popup", t.el);
				},
				popupClosed(t) {
					e.onClosed("popup", t.el);
				}
			}
		};
		return e.params.routableModals && e.view ? e.view.router.navigate({
			url: e.url,
			route: {
				path: e.url,
				popup: t
			}
		}) : e.modal = e.app.popup.create(t).open(e.params.animate), e;
	}
	openDropdown() {
		let e = this;
		e.$dropdownEl ||= W(e.renderDropdown());
		let t = e.$inputEl.parents(".page-content");
		e.params.dropdownContainerEl ? W(e.params.dropdownContainerEl).append(e.$dropdownEl) : t.length === 0 ? e.$dropdownEl.insertAfter(e.$inputEl) : (e.positionDropdown(), t.append(e.$dropdownEl)), e.onOpen("dropdown", e.$dropdownEl), e.onOpened("dropdown", e.$dropdownEl);
	}
	open() {
		let e = this;
		return e.opened || e[`open${e.params.openIn.split("").map((e, t) => t === 0 ? e.toUpperCase() : e).join("")}`](), e;
	}
	close() {
		let e = this;
		return e.opened && (e.params.openIn === "dropdown" ? (e.onClose(), e.onClosed()) : e.params.routableModals && e.view || e.openedIn === "page" ? e.view.router.back({ animate: e.params.animate }) : (e.modal.once("modalClosed", () => {
			Ua(() => {
				e.destroyed || (e.modal.destroy(), delete e.modal);
			});
		}), e.modal.close())), e;
	}
	init() {
		this.attachEvents();
	}
	destroy() {
		let e = this;
		e.emit("local::beforeDestroy autocompleteBeforeDestroy", e), e.detachEvents(), e.$inputEl && e.$inputEl[0] && delete e.$inputEl[0].f7Autocomplete, e.$openerEl && e.$openerEl[0] && delete e.$openerEl[0].f7Autocomplete, Ba(e), e.destroyed = !0;
	}
}, df = {
	name: "autocomplete",
	params: { autocomplete: {
		openerEl: void 0,
		inputEl: void 0,
		view: void 0,
		dropdownContainerEl: void 0,
		dropdownPlaceholderText: void 0,
		typeahead: !1,
		highlightMatches: !0,
		updateInputValueOnSelect: !0,
		inputEvents: "input",
		value: void 0,
		multiple: !1,
		source: void 0,
		limit: void 0,
		valueProperty: "id",
		textProperty: "text",
		openIn: "page",
		pageBackLinkText: "Back",
		popupCloseLinkText: "Close",
		pageTitle: void 0,
		searchbarPlaceholder: "Search...",
		searchbarDisableText: "Cancel",
		searchbarDisableButton: !0,
		searchbarSpellcheck: !1,
		popupPush: !1,
		popupSwipeToClose: void 0,
		animate: !0,
		autoFocus: !1,
		closeOnSelect: !1,
		notFoundText: "Nothing found",
		requestSourceOnOpen: !1,
		preloaderColor: void 0,
		preloader: !1,
		formColorTheme: void 0,
		navbarColorTheme: void 0,
		routableModals: !1,
		url: "select/",
		renderDropdown: void 0,
		renderPage: void 0,
		renderPopup: void 0,
		renderItem: void 0,
		renderSearchbar: void 0,
		renderNavbar: void 0
	} },
	static: { Autocomplete: uf },
	create() {
		let e = this;
		e.autocomplete = J(ho({
			defaultSelector: void 0,
			constructor: uf,
			app: e,
			domProp: "f7Autocomplete"
		}), {
			open(t) {
				let n = e.autocomplete.get(t);
				if (n && n.open) return n.open();
			},
			close(t) {
				let n = e.autocomplete.get(t);
				if (n && n.close) return n.close();
			}
		});
	}
}, ff = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this, r = Y(), i = J({}, e.params.tooltip), a = V();
		n.useModulesParams(i), n.params = J(i, t), t.offset === void 0 && r.touch && n.params.trigger === "hover" && (n.params.offset = 10);
		let { targetEl: o, containerEl: s } = n.params;
		if (!o && !n.params.delegated) return n;
		let c = W(o);
		if (c.length === 0 && !n.params.delegated) return n;
		if (c[0] && c[0].f7Tooltip && !n.params.delegated) return c[0].f7Tooltip;
		let l = W(s || e.$el).eq(0);
		l.length === 0 && (l = e.$el);
		let u = W(n.render()).eq(0);
		J(n, {
			app: e,
			$targetEl: c,
			targetEl: c && c[0],
			$containerEl: l,
			containerEl: l && l[0],
			$el: u,
			el: u && u[0],
			text: n.params.text || "",
			visible: !1,
			opened: !1
		}), c[0] && (c[0].f7Tooltip = n);
		let d = {}, f;
		function p() {
			n.opened ? n.hide() : n.show(this);
		}
		function m(e) {
			n.opened && (W(e.target).closest(c).length || W(e.target).closest(n.$el).length) || n.hide();
		}
		function h(e) {
			f || (f = !0, d.x = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, d.y = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, n.show(this));
		}
		function g(e) {
			if (!f) return;
			let t = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX, r = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY;
			((t - d.x) ** 2 + (r - d.y) ** 2) ** .5 > 50 && (f = !1, n.hide());
		}
		function _() {
			f && (f = !1, n.hide());
		}
		function v() {
			n.show(this);
		}
		function y() {
			n.hide();
		}
		function b() {
			u.hasClass("tooltip-in") || u.removeClass("tooltip-out").remove();
		}
		return n.attachEvents = function() {
			if (u.on("transitionend", b), n.params.trigger === "click") {
				n.params.delegated ? W(a).on("click", n.params.targetEl, p) : n.$targetEl.on("click", p), W("html").on("click", m);
				return;
			}
			if (n.params.trigger !== "manual") if (r.touch) {
				let t = r.passiveListener ? { passive: !0 } : !1;
				n.params.delegated ? W(a).on(e.touchEvents.start, n.params.targetEl, h, t) : n.$targetEl.on(e.touchEvents.start, h, t), e.on("touchmove", g), e.on("touchend:passive", _);
			} else n.params.delegated ? (W(a).on(r.pointerEvents ? "pointerenter" : "mouseenter", n.params.targetEl, v, !0), W(a).on(r.pointerEvents ? "pointerleave" : "mouseleave", n.params.targetEl, y, !0)) : (n.$targetEl.on(r.pointerEvents ? "pointerenter" : "mouseenter", v), n.$targetEl.on(r.pointerEvents ? "pointerleave" : "mouseleave", y));
		}, n.detachEvents = function() {
			if (u.off("transitionend", b), n.params.trigger === "click") {
				n.params.delegated ? W(a).on("click", n.params.targetEl, p) : n.$targetEl.off("click", p), W("html").off("click", m);
				return;
			}
			if (n.params.trigger !== "manual") if (r.touch) {
				let t = r.passiveListener ? { passive: !0 } : !1;
				n.params.delegated ? W(a).off(e.touchEvents.start, n.params.targetEl, h, t) : n.$targetEl.off(e.touchEvents.start, h, t), e.off("touchmove", g), e.off("touchend:passive", _);
			} else n.params.delegated ? (W(a).off(r.pointerEvents ? "pointerenter" : "mouseenter", n.params.targetEl, v, !0), W(a).off(r.pointerEvents ? "pointerleave" : "mouseleave", n.params.targetEl, y, !0)) : (n.$targetEl.off(r.pointerEvents ? "pointerenter" : "mouseenter", v), n.$targetEl.off(r.pointerEvents ? "pointerleave" : "mouseleave", y));
		}, n.useModules(), n.init(), n;
	}
	setTargetEl(e) {
		let t = this;
		return t.detachEvents(), t.$targetEl = W(e), t.targetEl = t.$targetEl[0], t.attachEvents(), t;
	}
	position(e) {
		let t = this, { $el: n, app: r, $containerEl: i } = t, a = !!t.params.containerEl, o = t.params.offset || 0;
		n.css({
			left: "",
			top: ""
		});
		let s = W(e || t.targetEl), [c, l] = [n.width(), n.height()];
		n.css({
			left: "",
			top: ""
		});
		let u, d, f, p, m = a && i.length ? i[0].getBoundingClientRect() : r;
		if (s && s.length > 0) {
			if (u = s.outerWidth(), d = s.outerHeight(), u === void 0 && d === void 0) {
				let e = s[0].getBoundingClientRect();
				u = e.width, d = e.height;
			}
			let e = s.offset();
			f = e.left - m.left, p = e.top - m.top;
			let t = s.parents(".page");
			t.length > 0 && (p -= t[0].scrollTop);
		}
		let [h, g] = [
			0,
			0,
			0
		], _ = "top";
		l + o < p ? g = p - l - o : l < m.height - p - d ? (_ = "bottom", g = p + d + o) : (_ = "middle", g = d / 2 + p - l / 2, g <= 0 ? g = 8 : g + l >= m.height && (g = m.height - l - 8)), _ === "top" || _ === "bottom" ? (h = u / 2 + f - c / 2, h < 8 && (h = 8), h + c > m.width && (h = m.width - c - 8), h < 0 && (h = 0)) : _ === "middle" && (h = f - c, (h < 8 || h + c > m.width) && (h < 8 && (h = f + u), h + c > m.width && (h = m.width - c - 8))), n.css({
			top: `${g}px`,
			left: `${h}px`
		});
	}
	show(e) {
		let t = this, { $el: n, $targetEl: r, $containerEl: i } = t;
		i[0] && n[0] && !i[0].contains(n[0]) && i.append(n), t.position(e);
		let a = W(e);
		return t.visible = !0, t.opened = !0, r.trigger("tooltip:show"), n.trigger("tooltip:show"), a.length && a[0] !== r[0] && a.trigger("tooltip:show"), t.emit("local::show tooltipShow", t), n.removeClass("tooltip-out").addClass("tooltip-in"), t;
	}
	hide() {
		let e = this, { $el: t, $targetEl: n } = e;
		return e.visible = !1, e.opened = !1, n.trigger("tooltip:hide"), t.trigger("tooltip:hide"), e.emit("local::hide tooltipHide", e), t.addClass("tooltip-out").removeClass("tooltip-in"), e;
	}
	render() {
		let e = this;
		if (e.params.render) return e.params.render.call(e, e);
		let { cssClass: t, text: n } = e.params;
		return `
      <div class="tooltip ${t || ""}">
        <div class="tooltip-content">${n || ""}</div>
      </div>
    `.trim();
	}
	setText(e) {
		let t = this;
		return e === void 0 ? t : (t.params.text = e, t.text = e, t.$el && t.$el.children(".tooltip-content").html(e), t.opened && t.position(), t);
	}
	init() {
		this.attachEvents();
	}
	destroy() {
		let e = this;
		!e.$targetEl || e.destroyed || (e.$targetEl.trigger("tooltip:beforedestroy"), e.emit("local::beforeDestroy tooltipBeforeDestroy", e), e.$el.remove(), e.$targetEl[0] && delete e.$targetEl[0].f7Tooltip, e.detachEvents(), Ba(e), e.destroyed = !0);
	}
}, pf = {
	name: "tooltip",
	static: { Tooltip: ff },
	create() {
		let e = this;
		e.tooltip = ho({
			defaultSelector: ".tooltip",
			constructor: ff,
			app: e,
			domProp: "f7Tooltip"
		}), e.tooltip.show = function(e) {
			let t = W(e);
			if (t.length === 0) return;
			let n = t[0].f7Tooltip;
			if (n) return n.show(t[0]), n;
		}, e.tooltip.hide = function(e) {
			let t = W(e);
			if (t.length === 0) return;
			let n = t[0].f7Tooltip;
			if (n) return n.hide(), n;
		}, e.tooltip.setText = function(e, t) {
			let n = W(e);
			if (n.length === 0) return;
			let r = n[0].f7Tooltip;
			if (r) return r.setText(t), r;
		};
	},
	params: { tooltip: {
		targetEl: null,
		delegated: !1,
		text: null,
		cssClass: null,
		render: null,
		offset: 0,
		trigger: "hover",
		containerEl: void 0
	} },
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".tooltip-init").each((e) => {
				let n = W(e).attr("data-tooltip");
				n && t.tooltip.create({
					targetEl: e,
					text: n
				});
			});
		},
		tabBeforeRemove(e) {
			W(e).find(".tooltip-init").each((e) => {
				e.f7Tooltip && e.f7Tooltip.destroy();
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".tooltip-init").each((e) => {
				let n = W(e).attr("data-tooltip");
				n && t.tooltip.create({
					targetEl: e,
					text: n
				});
			}), t.theme === "ios" && e.view && e.view.router.dynamicNavbar && e.$navbarEl && e.$navbarEl.length > 0 && e.$navbarEl.find(".tooltip-init").each((e) => {
				let n = W(e).attr("data-tooltip");
				n && t.tooltip.create({
					targetEl: e,
					text: n
				});
			});
		},
		pageBeforeRemove(e) {
			let t = this;
			e.$el.find(".tooltip-init").each((e) => {
				e.f7Tooltip && e.f7Tooltip.destroy();
			}), t.theme === "ios" && e.view && e.view.router.dynamicNavbar && e.$navbarEl && e.$navbarEl.length > 0 && e.$navbarEl.find(".tooltip-init").each((e) => {
				e.f7Tooltip && e.f7Tooltip.destroy();
			});
		}
	},
	vnode: { "tooltip-init": {
		insert(e) {
			let t = this, n = e.elm, r = W(n).attr("data-tooltip");
			r && t.tooltip.create({
				targetEl: n,
				text: r
			});
		},
		update(e) {
			let t = e.elm;
			t.f7Tooltip && e && e.data && e.data.attrs && e.data.attrs["data-tooltip"] && t.f7Tooltip.setText(e.data.attrs["data-tooltip"]);
		},
		destroy(e) {
			let t = e.elm;
			t.f7Tooltip && t.f7Tooltip.destroy();
		}
	} }
}, mf = { name: "skeleton" }, hf = {
	render(e) {
		let { sliderLabel: t, sliderValue: n, sliderValueEditable: r, alphaLabelText: i } = e.params;
		return Q("div", { class: "color-picker-module color-picker-module-alpha-slider" }, Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, i), Q("div", { class: "range-slider color-picker-slider color-picker-slider-alpha" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "0.01",
			min: "0",
			max: "1",
			class: "color-picker-value-alpha"
		}) : Q("span", { class: "color-picker-value-alpha" }))));
	},
	init(e) {
		e.alphaRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-alpha"),
			min: 0,
			max: 1,
			step: .01,
			value: 1,
			on: { change(t, n) {
				let r = Math.floor(n * 100) / 100;
				e.setValue({ alpha: r });
			} }
		});
		function t(t) {
			let n = e.value.alpha, r = parseFloat(t.target.value);
			if (Number.isNaN(r)) {
				t.target.value = n;
				return;
			}
			r = Math.max(0, Math.min(1, r)), e.setValue({ alpha: r });
		}
		e.$el.on("change", ".color-picker-module-alpha-slider input", t), e.destroyAlphaSliderEvents = function() {
			e.$el.off("change", ".color-picker-module-alpha-slider input", t);
		};
	},
	update(e) {
		let { value: t } = e, { sliderValue: n, sliderValueEditable: r } = e.params, { alpha: i } = t;
		e.alphaRangeSlider.value = i, e.alphaRangeSlider.layout(), n && r ? e.$el.find("input.color-picker-value-alpha").val(i) : e.$el.find("span.color-picker-value-alpha").text(i);
	},
	destroy(e) {
		e.alphaRangeSlider && e.alphaRangeSlider.destroy && e.alphaRangeSlider.destroy(), delete e.alphaRangeSlider, e.destroyAlphaSliderEvents && e.destroyAlphaSliderEvents(), delete e.destroyAlphaSliderEvents;
	}
}, gf = {
	render() {
		return Q("div", { class: "color-picker-module color-picker-module-current-color" }, Q("div", { class: "color-picker-current-color" }));
	},
	update(e) {
		e.$el.find(".color-picker-module-current-color .color-picker-current-color").css("background-color", e.value.hex);
	}
}, _f = {
	render(e) {
		let { hexLabel: t, hexLabelText: n, hexValueEditable: r } = e.params;
		return Q("div", { class: "color-picker-module color-picker-module-hex" }, Q("div", { class: "color-picker-hex-wrap" }, t && Q("div", { class: "color-picker-hex-label" }, n), Q("div", { class: "color-picker-hex-value" }, r ? Q("input", {
			type: "text",
			class: "color-picker-value-hex"
		}) : Q("span", { class: "color-picker-value-hex" }))));
	},
	init(e) {
		function t(t) {
			let n = e.value.hex, r = t.target.value.replace(/#/g, "");
			if (Number.isNaN(r) || !r || r.length !== 3 && r.length !== 6) {
				t.target.value = n;
				return;
			}
			let i = parseInt(r, 16);
			i > 16777215 && (r = "fff"), i < 0 && (r = "000"), e.setValue({ hex: r });
		}
		e.$el.on("change", ".color-picker-module-hex input", t), e.destroyHexEvents = function() {
			e.$el.off("change", ".color-picker-module-hex input", t);
		};
	},
	update(e) {
		let { value: t } = e, { hexValueEditable: n } = e.params, { hex: r } = t;
		n ? e.$el.find("input.color-picker-value-hex").val(r) : e.$el.find("span.color-picker-value-hex").text(r);
	},
	destroy(e) {
		e.destroyHexEvents && e.destroyHexEvents(), delete e.destroyHexEvents;
	}
}, vf = {
	render(e) {
		let { sliderLabel: t, sliderValue: n, sliderValueEditable: r, hueLabelText: i, saturationLabelText: a, brightnessLabelText: o } = e.params;
		return Q("div", { class: "color-picker-module color-picker-module-hsb-sliders" }, Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, i), Q("div", { class: "range-slider color-picker-slider color-picker-slider-hue" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "0.1",
			min: "0",
			max: "360",
			class: "color-picker-value-hue",
			"data-color-index": "0"
		}) : Q("span", { class: "color-picker-value-hue" }))), Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, a), Q("div", { class: "range-slider color-picker-slider color-picker-slider-saturation" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "0.1",
			min: "0",
			max: "100",
			class: "color-picker-value-saturation",
			"data-color-index": "1"
		}) : Q("span", { class: "color-picker-value-saturation" }))), Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, o), Q("div", { class: "range-slider color-picker-slider color-picker-slider-brightness" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "0.1",
			min: "0",
			max: "100",
			class: "color-picker-value-brightness",
			"data-color-index": "2"
		}) : Q("span", { class: "color-picker-value-brightness" }))));
	},
	init(e) {
		e.hueRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-hue"),
			min: 0,
			max: 360,
			step: .1,
			value: 0,
			on: { change(t, n) {
				e.setValue({ hue: n });
			} }
		}), e.saturationRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-saturation"),
			min: 0,
			max: 1,
			step: .001,
			value: 0,
			on: { change(t, n) {
				let r = Math.floor(n * 1e3) / 1e3;
				e.setValue({ hsb: [
					e.value.hsb[0],
					r,
					e.value.hsb[2]
				] });
			} }
		}), e.brightnessRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-brightness"),
			min: 0,
			max: 1,
			step: .001,
			value: 0,
			on: { change(t, n) {
				let r = Math.floor(n * 1e3) / 1e3;
				e.setValue({ hsb: [
					e.value.hsb[0],
					e.value.hsb[1],
					r
				] });
			} }
		});
		function t(t) {
			let n = [...e.value.hsb], r = parseInt(W(t.target).attr("data-color-index"), 10), i = parseFloat(t.target.value);
			if (Number.isNaN(i)) {
				t.target.value = n[r];
				return;
			}
			i = r === 0 ? Math.max(0, Math.min(360, i)) : Math.max(0, Math.min(100, i)) / 100, n[r] = i, e.setValue({ hsb: n });
		}
		e.$el.on("change", ".color-picker-module-hsb-sliders input", t), e.destroyHsbSlidersEvents = function() {
			e.$el.off("change", ".color-picker-module-hsb-sliders input", t);
		};
	},
	update(e) {
		let { app: t, value: n } = e, { sliderValue: r, sliderValueEditable: i } = e.params, { hsb: a, hue: o } = n;
		e.hueRangeSlider.value = o, e.saturationRangeSlider.value = a[1], e.brightnessRangeSlider.value = a[2], e.hueRangeSlider.layout(), e.saturationRangeSlider.layout(), e.brightnessRangeSlider.layout();
		let s = to(a[0], a[1], 1), c = to(a[0], 0, 1), l = to(a[0], 1, 1), u = a[2];
		e.hueRangeSlider.$el[0].style.setProperty("--f7-range-knob-color", `hsl(${o}, 100%, 50%)`), e.saturationRangeSlider.$el[0].style.setProperty("--f7-range-knob-color", `hsl(${s[0]}, ${s[1] * 100}%, ${s[2] * 100}%)`), e.brightnessRangeSlider.$el[0].style.setProperty("--f7-range-knob-color", `rgb(${u * 255}, ${u * 255}, ${u * 255})`), e.saturationRangeSlider.$el.find(".range-bar").css("background-image", `linear-gradient(${t.rtl ? "to left" : "to right"}, hsl(${c[0]}, ${c[1] * 100}%, ${c[2] * 100}%), hsl(${l[0]}, ${l[1] * 100}%, ${l[2] * 100}%))`), r && i ? (e.$el.find("input.color-picker-value-hue").val(`${o}`), e.$el.find("input.color-picker-value-saturation").val(`${a[1] * 1e3 / 10}`), e.$el.find("input.color-picker-value-brightness").val(`${a[2] * 1e3 / 10}`)) : r && (e.$el.find("span.color-picker-value-hue").text(`${o}`), e.$el.find("span.color-picker-value-saturation").text(`${a[1] * 1e3 / 10}`), e.$el.find("span.color-picker-value-brightness").text(`${a[2] * 1e3 / 10}`));
	},
	destroy(e) {
		e.hueRangeSlider && e.hueRangeSlider.destroy && e.hueRangeSlider.destroy(), e.saturationRangeSlider && e.saturationRangeSlider.destroy && e.saturationRangeSlider.destroy(), e.brightnessRangeSlider && e.brightnessRangeSlider.destroy && e.brightnessRangeSlider.destroy(), delete e.hueRangeSlider, delete e.saturationRangeSlider, delete e.brightnessRangeSlider, e.destroyHsbSlidersEvents && e.destroyHsbSlidersEvents(), delete e.destroyHsbSlidersEvents;
	}
}, yf = {
	render(e) {
		let { sliderLabel: t, sliderValue: n, sliderValueEditable: r, hueLabelText: i } = e.params;
		return Q("div", { class: "color-picker-module color-picker-module-hue-slider" }, Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, i), Q("div", { class: "range-slider color-picker-slider color-picker-slider-hue" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "0.1",
			min: "0",
			max: "360",
			class: "color-picker-value-hue"
		}) : Q("span", { class: "color-picker-value-hue" }))));
	},
	init(e) {
		e.hueRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-hue"),
			min: 0,
			max: 360,
			step: .1,
			value: 0,
			on: { change(t, n) {
				e.setValue({ hue: n });
			} }
		});
	},
	update(e) {
		let { value: t } = e, { sliderValue: n, sliderValueEditable: r } = e.params, { hue: i } = t;
		e.hueRangeSlider.value = i, e.hueRangeSlider.layout(), e.hueRangeSlider.$el[0].style.setProperty("--f7-range-knob-color", `hsl(${i}, 100%, 50%)`), n && r ? e.$el.find("input.color-picker-value-hue").val(`${i}`) : n && e.$el.find("span.color-picker-value-hue").text(`${i}`);
	},
	destroy(e) {
		e.hueRangeSlider && e.hueRangeSlider.destroy && e.hueRangeSlider.destroy(), delete e.hueRangeSlider;
	}
}, bf = {
	render(e) {
		let { sliderLabel: t, sliderValue: n, sliderValueEditable: r, brightnessLabelText: i } = e.params;
		return Q("div", { class: "color-picker-module color-picker-module-brightness-slider" }, Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, i), Q("div", { class: "range-slider color-picker-slider color-picker-slider-brightness" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "0.1",
			min: "0",
			max: "100",
			class: "color-picker-value-brightness"
		}) : Q("span", { class: "color-picker-value-brightness" }))));
	},
	init(e) {
		e.brightnessRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-brightness"),
			min: 0,
			max: 1,
			step: .001,
			value: 0,
			on: { change(t, n) {
				let r = Math.floor(n * 1e3) / 1e3;
				e.setValue({ hsb: [
					e.value.hsb[0],
					e.value.hsb[1],
					r
				] });
			} }
		});
	},
	update(e) {
		let { value: t, app: n } = e, { sliderValue: r, sliderValueEditable: i } = e.params, { hsb: a } = t;
		e.brightnessRangeSlider.value = a[2], e.brightnessRangeSlider.layout();
		let o = to(a[0], a[1], a[2]), s = to(a[0], a[1], 0), c = to(a[0], a[1], 1);
		e.brightnessRangeSlider.$el[0].style.setProperty("--f7-range-knob-color", `hsl(${o[0]}, ${o[1] * 100}%, ${o[2] * 100}%)`), e.brightnessRangeSlider.$el.find(".range-bar").css("background-image", `linear-gradient(${n.rtl ? "to left" : "to right"}, hsl(${s[0]}, ${s[1] * 100}%, ${s[2] * 100}%), hsl(${c[0]}, ${c[1] * 100}%, ${c[2] * 100}%))`), r && i ? e.$el.find("input.color-picker-value-brightness").val(`${a[2] * 1e3 / 10}`) : r && e.$el.find("span.color-picker-value-brightness").text(`${a[2] * 1e3 / 10}`);
	},
	destroy(e) {
		e.brightnessRangeSlider && e.brightnessRangeSlider.destroy && e.brightnessRangeSlider.destroy(), delete e.brightnessRangeSlider;
	}
}, xf = {
	render(e) {
		return Q("div", { class: "color-picker-module color-picker-module-palette" }, Q("div", { class: "color-picker-palette" }, e.params.palette.map((e) => {
			if (Array.isArray(e)) {
				let t = "<div class=\"color-picker-palette-row\">";
				return t += e.map((e) => `
                <div class="color-picker-palette-value" data-palette-color="${e}" style="background-color: ${e}"></div>
              `).join(""), t += "</div>", t;
			}
			return Q("div", {
				class: "color-picker-palette-value",
				"data-palette-color": e,
				style: `background-color: ${e}`
			});
		})));
	},
	init(e) {
		function t(t) {
			let n = W(t.target).attr("data-palette-color");
			e.setValue({ hex: n });
		}
		e.$el.on("click", ".color-picker-module-palette .color-picker-palette-value", t), e.destroyPaletteEvents = function() {
			e.$el.off("click", ".color-picker-module-hex input", t);
		};
	},
	destroy(e) {
		e.destroyPaletteEvents && e.destroyPaletteEvents(), delete e.destroyPaletteEvents;
	}
}, Sf = {
	render() {
		return Q("div", { class: "color-picker-module color-picker-module-initial-current-colors" }, Q("div", { class: "color-picker-initial-current-colors" }, Q("div", { class: "color-picker-initial-color" }), Q("div", { class: "color-picker-current-color" })));
	},
	init(e) {
		function t() {
			if (e.initialValue) {
				let { hex: t, alpha: n } = e.initialValue;
				e.setValue({
					hex: t,
					alpha: n
				});
			}
		}
		e.$el.on("click", ".color-picker-initial-color", t), e.destroyInitialCurrentEvents = function() {
			e.$el.off("click", ".color-picker-initial-color", t);
		};
	},
	update(e) {
		e.$el.find(".color-picker-module-initial-current-colors .color-picker-initial-color").css("background-color", e.initialValue.hex), e.$el.find(".color-picker-module-initial-current-colors .color-picker-current-color").css("background-color", e.value.hex);
	},
	destroy(e) {
		e.destroyInitialCurrentEvents && e.destroyInitialCurrentEvents(), delete e.destroyInitialCurrentEvents;
	}
}, Cf = {
	render(e) {
		let { barLabel: t, barValue: n, barValueEditable: r, redLabelText: i, greenLabelText: a, blueLabelText: o } = e.params;
		return Q("div", { class: "color-picker-module color-picker-module-rgb-bars" }, Q("div", { class: "color-picker-bar-wrap" }, t && Q("div", { class: "color-picker-bar-label" }, i), Q("div", { class: "range-slider color-picker-bar color-picker-bar-red" }), n && Q("div", { class: "color-picker-bar-value" }, r ? Q("input", {
			type: "number",
			step: "1",
			min: "0",
			max: "255",
			class: "color-picker-value-bar-red",
			"data-color-index": "0"
		}) : Q("span", { class: "color-picker-value-bar-red" }))), Q("div", { class: "color-picker-bar-wrap" }, t && Q("div", { class: "color-picker-bar-label" }, a), Q("div", { class: "range-slider color-picker-bar color-picker-bar-green" }), n && Q("div", { class: "color-picker-bar-value" }, r ? Q("input", {
			type: "number",
			step: "1",
			min: "0",
			max: "255",
			class: "color-picker-value-bar-green",
			"data-color-index": "1"
		}) : Q("span", { class: "color-picker-value-bar-green" }))), Q("div", { class: "color-picker-bar-wrap" }, t && Q("div", { class: "color-picker-bar-label" }, o), Q("div", { class: "range-slider color-picker-bar color-picker-bar-blue" }), n && Q("div", { class: "color-picker-bar-value" }, r ? Q("input", {
			type: "number",
			step: "1",
			min: "0",
			max: "255",
			class: "color-picker-value-bar-blue",
			"data-color-index": "2"
		}) : Q("span", { class: "color-picker-value-bar-blue" }))));
	},
	init(e) {
		e.redBar = e.app.range.create({
			el: e.$el.find(".color-picker-bar-red"),
			min: 0,
			max: 255,
			step: 1,
			value: 0,
			vertical: !0,
			on: { change(t, n) {
				e.setValue({ rgb: [
					n,
					e.value.rgb[1],
					e.value.rgb[2]
				] });
			} }
		}), e.greenBar = e.app.range.create({
			el: e.$el.find(".color-picker-bar-green"),
			min: 0,
			max: 255,
			step: 1,
			value: 0,
			vertical: !0,
			on: { change(t, n) {
				e.setValue({ rgb: [
					e.value.rgb[0],
					n,
					e.value.rgb[2]
				] });
			} }
		}), e.blueBar = e.app.range.create({
			el: e.$el.find(".color-picker-bar-blue"),
			min: 0,
			max: 255,
			step: 1,
			value: 0,
			vertical: !0,
			on: { change(t, n) {
				e.setValue({ rgb: [
					e.value.rgb[0],
					e.value.rgb[1],
					n
				] });
			} }
		});
		function t(t) {
			let n = [...e.value.rgb], r = parseInt(W(t.target).attr("data-color-index"), 10), i = parseInt(t.target.value, 10);
			if (Number.isNaN(i)) {
				t.target.value = n[r];
				return;
			}
			i = Math.max(0, Math.min(255, i)), n[r] = i, e.setValue({ rgb: n });
		}
		e.$el.on("change", ".color-picker-module-rgb-bars input", t), e.destroyRgbBarsEvents = function() {
			e.$el.off("change", ".color-picker-module-rgb-bars input", t);
		};
	},
	update(e) {
		let { value: t, redBar: n, greenBar: r, blueBar: i } = e, { barValue: a, barValueEditable: o } = e.params, { rgb: s } = t;
		n.value = s[0], r.value = s[1], i.value = s[2], n.layout(), r.layout(), i.layout(), n.$el.find(".range-bar").css("background-image", `linear-gradient(to top, rgb(0, ${s[1]}, ${s[2]}), rgb(255, ${s[1]}, ${s[2]}))`), r.$el.find(".range-bar").css("background-image", `linear-gradient(to top, rgb(${s[0]}, 0, ${s[2]}), rgb(${s[0]}, 255, ${s[2]}))`), i.$el.find(".range-bar").css("background-image", `linear-gradient(to top, rgb(${s[0]}, ${s[1]}, 0), rgb(${s[0]}, ${s[1]}, 255))`), a && o ? (e.$el.find("input.color-picker-value-bar-red").val(s[0]), e.$el.find("input.color-picker-value-bar-green").val(s[1]), e.$el.find("input.color-picker-value-bar-blue").val(s[2])) : a && (e.$el.find("span.color-picker-value-bar-red").text(s[0]), e.$el.find("span.color-picker-value-bar-green").text(s[1]), e.$el.find("span.color-picker-value-bar-blue").text(s[2]));
	},
	destroy(e) {
		e.redBar && e.redBar.destroy && e.redBar.destroy(), e.greenBar && e.greenBar.destroy && e.greenBar.destroy(), e.blueBar && e.blueBar.destroy && e.blueBar.destroy(), delete e.redBar, delete e.greenBar, delete e.blueBar, e.destroyRgbBarsEvents && e.destroyRgbBarsEvents(), delete e.destroyRgbBarsEvents;
	}
}, wf = {
	render(e) {
		let { sliderLabel: t, sliderValue: n, sliderValueEditable: r, redLabelText: i, greenLabelText: a, blueLabelText: o } = e.params;
		return Q("div", { class: "color-picker-module color-picker-module-rgb-sliders" }, Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, i), Q("div", { class: "range-slider color-picker-slider color-picker-slider-red" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "1",
			min: "0",
			max: "255",
			class: "color-picker-value-red",
			"data-color-index": "0"
		}) : Q("span", { class: "color-picker-value-red" }))), Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, a), Q("div", { class: "range-slider color-picker-slider color-picker-slider-green" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "1",
			min: "0",
			max: "255",
			class: "color-picker-value-green",
			"data-color-index": "1"
		}) : Q("span", { class: "color-picker-value-green" }))), Q("div", { class: "color-picker-slider-wrap" }, t && Q("div", { class: "color-picker-slider-label" }, o), Q("div", { class: "range-slider color-picker-slider color-picker-slider-blue" }), n && Q("div", { class: "color-picker-slider-value" }, r ? Q("input", {
			type: "number",
			step: "1",
			min: "0",
			max: "255",
			class: "color-picker-value-blue",
			"data-color-index": "2"
		}) : Q("span", { class: "color-picker-value-blue" }))));
	},
	init(e) {
		e.redRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-red"),
			min: 0,
			max: 255,
			step: 1,
			value: 0,
			on: { change(t, n) {
				e.setValue({ rgb: [
					n,
					e.value.rgb[1],
					e.value.rgb[2]
				] });
			} }
		}), e.greenRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-green"),
			min: 0,
			max: 255,
			step: 1,
			value: 0,
			on: { change(t, n) {
				e.setValue({ rgb: [
					e.value.rgb[0],
					n,
					e.value.rgb[2]
				] });
			} }
		}), e.blueRangeSlider = e.app.range.create({
			el: e.$el.find(".color-picker-slider-blue"),
			min: 0,
			max: 255,
			step: 1,
			value: 0,
			on: { change(t, n) {
				e.setValue({ rgb: [
					e.value.rgb[0],
					e.value.rgb[1],
					n
				] });
			} }
		});
		function t(t) {
			let n = [...e.value.rgb], r = parseInt(W(t.target).attr("data-color-index"), 10), i = parseInt(t.target.value, 10);
			if (Number.isNaN(i)) {
				t.target.value = n[r];
				return;
			}
			i = Math.max(0, Math.min(255, i)), n[r] = i, e.setValue({ rgb: n });
		}
		e.$el.on("change", ".color-picker-module-rgb-sliders input", t), e.destroyRgbSlidersEvents = function() {
			e.$el.off("change", ".color-picker-module-rgb-sliders input", t);
		};
	},
	update(e) {
		let { app: t, value: n, redRangeSlider: r, greenRangeSlider: i, blueRangeSlider: a } = e, { sliderValue: o, sliderValueEditable: s } = e.params, { rgb: c } = n;
		r.value = c[0], i.value = c[1], a.value = c[2], r.layout(), i.layout(), a.layout(), r.$el[0].style.setProperty("--f7-range-knob-color", `rgb(${c[0]}, ${c[1]}, ${c[2]})`), i.$el[0].style.setProperty("--f7-range-knob-color", `rgb(${c[0]}, ${c[1]}, ${c[2]})`), a.$el[0].style.setProperty("--f7-range-knob-color", `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
		let l = t.rtl ? "to left" : "to right";
		r.$el.find(".range-bar").css("background-image", `linear-gradient(${l}, rgb(0, ${c[1]}, ${c[2]}), rgb(255, ${c[1]}, ${c[2]}))`), i.$el.find(".range-bar").css("background-image", `linear-gradient(${l}, rgb(${c[0]}, 0, ${c[2]}), rgb(${c[0]}, 255, ${c[2]}))`), a.$el.find(".range-bar").css("background-image", `linear-gradient(${l}, rgb(${c[0]}, ${c[1]}, 0), rgb(${c[0]}, ${c[1]}, 255))`), o && s ? (e.$el.find("input.color-picker-value-red").val(c[0]), e.$el.find("input.color-picker-value-green").val(c[1]), e.$el.find("input.color-picker-value-blue").val(c[2])) : o && (e.$el.find("span.color-picker-value-red").text(c[0]), e.$el.find("span.color-picker-value-green").text(c[1]), e.$el.find("span.color-picker-value-blue").text(c[2]));
	},
	destroy(e) {
		e.redRangeSlider && e.redRangeSlider.destroy && e.redRangeSlider.destroy(), e.greenRangeSlider && e.greenRangeSlider.destroy && e.greenRangeSlider.destroy(), e.blueRangeSlider && e.blueRangeSlider.destroy && e.blueRangeSlider.destroy(), delete e.redRangeSlider, delete e.greenRangeSlider, delete e.blueRangeSlider, e.destroyRgbSlidersEvents && e.destroyRgbSlidersEvents(), delete e.destroyRgbSlidersEvents;
	}
}, Tf = {
	render() {
		return Q("div", { class: "color-picker-module color-picker-module-sb-spectrum" }, Q("div", {
			class: "color-picker-sb-spectrum",
			style: "background-color: hsl(0, 100%, 50%)"
		}, Q("div", { class: "color-picker-sb-spectrum-handle" })));
	},
	init(e) {
		let { app: t } = e, n, r, i, a, o, s, c, l, { $el: u } = e;
		function d(t, n) {
			let r = (t - s.left) / s.width, i = (n - s.top) / s.height;
			r = Math.max(0, Math.min(1, r)), i = 1 - Math.max(0, Math.min(1, i)), e.setValue({ hsb: [
				e.value.hue,
				r,
				i
			] });
		}
		function f(e) {
			if (n) return;
			r = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, a = r, i = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, o = i;
			let t = W(e.target);
			l = t.closest(".color-picker-sb-spectrum-handle").length > 0, l || (c = t.closest(".color-picker-sb-spectrum").length > 0), c && (s = u.find(".color-picker-sb-spectrum")[0].getBoundingClientRect(), d(r, i)), (l || c) && u.find(".color-picker-sb-spectrum-handle").addClass("color-picker-sb-spectrum-handle-pressed");
		}
		function p(e) {
			(c || l) && (a = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX, o = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY, e.preventDefault(), n || (n = !0, l && (s = u.find(".color-picker-sb-spectrum")[0].getBoundingClientRect())), (c || l) && d(a, o));
		}
		function m() {
			n = !1, (c || l) && u.find(".color-picker-sb-spectrum-handle").removeClass("color-picker-sb-spectrum-handle-pressed"), c = !1, l = !1;
		}
		function h() {
			e.modules["sb-spectrum"].update(e);
		}
		let g = t.touchEvents.start === "touchstart" && Y().passiveListener ? {
			passive: !0,
			capture: !1
		} : !1;
		e.$el.on(t.touchEvents.start, f, g), t.on("touchmove:active", p), t.on("touchend:passive", m), t.on("resize", h), e.destroySpectrumEvents = function() {
			e.$el.off(t.touchEvents.start, f, g), t.off("touchmove:active", p), t.off("touchend:passive", m), t.off("resize", h);
		};
	},
	update(e) {
		let { value: t } = e, { hsl: n, hsb: r } = t, i = e.$el.find(".color-picker-sb-spectrum")[0].offsetWidth, a = e.$el.find(".color-picker-sb-spectrum")[0].offsetHeight;
		e.$el.find(".color-picker-sb-spectrum").css("background-color", `hsl(${n[0]}, 100%, 50%)`), e.$el.find(".color-picker-sb-spectrum-handle").css("background-color", `hsl(${n[0]}, ${n[1] * 100}%, ${n[2] * 100}%)`).transform(`translate(${i * r[1]}px, ${a * (1 - r[2])}px)`);
	},
	destroy(e) {
		e.destroySpectrumEvents && e.destroySpectrumEvents(), delete e.destroySpectrumEvents;
	}
}, Ef = {
	render() {
		return Q("div", { class: "color-picker-module color-picker-module-hs-spectrum" }, Q("div", { class: "color-picker-hs-spectrum" }, Q("div", { class: "color-picker-hs-spectrum-handle" })));
	},
	init(e) {
		let { app: t } = e, n, r, i, a, o, s, c, l, { $el: u } = e;
		function d(t, n) {
			let r = (t - s.left) / s.width * 360, i = (n - s.top) / s.height;
			r = Math.max(0, Math.min(360, r)), i = 1 - Math.max(0, Math.min(1, i)), e.setValue({ hsb: [
				r,
				i,
				e.value.hsb[2]
			] });
		}
		function f(e) {
			if (n) return;
			r = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, a = r, i = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, o = i;
			let t = W(e.target);
			l = t.closest(".color-picker-hs-spectrum-handle").length > 0, l || (c = t.closest(".color-picker-hs-spectrum").length > 0), c && (s = u.find(".color-picker-hs-spectrum")[0].getBoundingClientRect(), d(r, i)), (l || c) && u.find(".color-picker-hs-spectrum-handle").addClass("color-picker-hs-spectrum-handle-pressed");
		}
		function p(e) {
			(c || l) && (a = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX, o = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY, e.preventDefault(), n || (n = !0, l && (s = u.find(".color-picker-hs-spectrum")[0].getBoundingClientRect())), (c || l) && d(a, o));
		}
		function m() {
			n = !1, (c || l) && u.find(".color-picker-hs-spectrum-handle").removeClass("color-picker-hs-spectrum-handle-pressed"), c = !1, l = !1;
		}
		function h() {
			e.modules["hs-spectrum"].update(e);
		}
		let g = t.touchEvents.start === "touchstart" && Y().passiveListener ? {
			passive: !0,
			capture: !1
		} : !1;
		e.$el.on(t.touchEvents.start, f, g), t.on("touchmove:active", p), t.on("touchend:passive", m), t.on("resize", h), e.destroySpectrumEvents = function() {
			e.$el.off(t.touchEvents.start, f, g), t.off("touchmove:active", p), t.off("touchend:passive", m), t.off("resize", h);
		};
	},
	update(e) {
		let { value: t } = e, { hsb: n } = t, r = e.$el.find(".color-picker-hs-spectrum")[0].offsetWidth, i = e.$el.find(".color-picker-hs-spectrum")[0].offsetHeight, a = to(n[0], n[1], 1);
		e.$el.find(".color-picker-hs-spectrum-handle").css("background-color", `hsl(${a[0]}, ${a[1] * 100}%, ${a[2] * 100}%)`).transform(`translate(${r * (n[0] / 360)}px, ${i * (1 - n[1])}px)`);
	},
	destroy(e) {
		e.destroySpectrumEvents && e.destroySpectrumEvents(), delete e.destroySpectrumEvents;
	}
};
//#endregion
//#region node_modules/framework7/components/color-picker/modules/wheel.js
function Df() {
	let e = "";
	for (let t = 256; t > 0; --t) {
		let n = t * Math.PI / (256 / 2), r = 360 / 256 * t;
		e += `<circle cx="${150 - Math.sin(n) * 125}" cy="${150 - Math.cos(n) * 125}" r="25" fill="hsl(${r}, 100%, 50%)"></circle>`;
	}
	return e;
}
var Of = {
	render() {
		return Q("div", { class: "color-picker-module color-picker-module-wheel" }, Q("div", { class: "color-picker-wheel" }, Q("svg", {
			viewBox: "0 0 300 300",
			width: "300",
			height: "300"
		}, Df()), Q("div", { class: "color-picker-wheel-handle" }), Q("div", {
			class: "color-picker-sb-spectrum",
			style: "background-color: hsl(0, 100%, 50%)"
		}, Q("div", { class: "color-picker-sb-spectrum-handle" }))));
	},
	init(e) {
		let { app: t } = e, n, r, i, a, o, s, c, l, u, d, f, { $el: p } = e;
		function m(t, n) {
			let r = s.left + s.width / 2, i = s.top + s.height / 2, a = Math.atan2(n - i, t - r) * 180 / Math.PI + 90;
			a < 0 && (a += 360), a = 360 - a, e.setValue({ hue: a });
		}
		function h(t, n) {
			let r = (t - u.left) / u.width, i = (n - u.top) / u.height;
			r = Math.max(0, Math.min(1, r)), i = 1 - Math.max(0, Math.min(1, i)), e.setValue({ hsb: [
				e.value.hue,
				r,
				i
			] });
		}
		function g(e) {
			if (n) return;
			r = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX, a = r, i = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY, o = i;
			let t = W(e.target);
			l = t.closest(".color-picker-wheel-handle").length > 0, c = t.closest("circle").length > 0, f = t.closest(".color-picker-sb-spectrum-handle").length > 0, f || (d = t.closest(".color-picker-sb-spectrum").length > 0), c && (s = p.find(".color-picker-wheel")[0].getBoundingClientRect(), m(r, i)), d && (u = p.find(".color-picker-sb-spectrum")[0].getBoundingClientRect(), h(r, i)), (f || d) && p.find(".color-picker-sb-spectrum-handle").addClass("color-picker-sb-spectrum-handle-pressed");
		}
		function _(e) {
			!(c || l) && !(d || f) || (a = e.type === "touchmove" ? e.targetTouches[0].pageX : e.pageX, o = e.type === "touchmove" ? e.targetTouches[0].pageY : e.pageY, e.preventDefault(), n || (n = !0, l && (s = p.find(".color-picker-wheel")[0].getBoundingClientRect()), f && (u = p.find(".color-picker-sb-spectrum")[0].getBoundingClientRect())), (c || l) && m(a, o), (d || f) && h(a, o));
		}
		function v() {
			n = !1, (d || f) && p.find(".color-picker-sb-spectrum-handle").removeClass("color-picker-sb-spectrum-handle-pressed"), c = !1, l = !1, d = !1, f = !1;
		}
		function y() {
			e.modules.wheel.update(e);
		}
		let b = t.touchEvents.start === "touchstart" && Y().passiveListener ? {
			passive: !0,
			capture: !1
		} : !1;
		e.$el.on(t.touchEvents.start, g, b), t.on("touchmove:active", _), t.on("touchend:passive", v), t.on("resize", y), e.destroyWheelEvents = function() {
			e.$el.off(t.touchEvents.start, g, b), t.off("touchmove:active", _), t.off("touchend:passive", v), t.off("resize", y);
		};
	},
	update(e) {
		let { value: t } = e, { hsl: n, hsb: r } = t, i = e.$el.find(".color-picker-sb-spectrum")[0].offsetWidth, a = e.$el.find(".color-picker-sb-spectrum")[0].offsetHeight, o = e.$el.find(".color-picker-wheel")[0].offsetWidth, s = o / 2, c = t.hue * Math.PI / 180, l = o / 6 / 2, u = s - Math.sin(c) * (s - l) - l, d = s - Math.cos(c) * (s - l) - l;
		e.$el.find(".color-picker-wheel-handle").css("background-color", `hsl(${n[0]}, 100%, 50%)`).transform(`translate(${u}px, ${d}px)`), e.$el.find(".color-picker-sb-spectrum").css("background-color", `hsl(${n[0]}, 100%, 50%)`), e.$el.find(".color-picker-sb-spectrum-handle").css("background-color", `hsl(${n[0]}, ${n[1] * 100}%, ${n[2] * 100}%)`).transform(`translate(${i * r[1]}px, ${a * (1 - r[2])}px)`);
	},
	destroy(e) {
		e.destroyWheelEvents && e.destroyWheelEvents(), delete e.destroyWheelEvents;
	}
}, kf = class extends Z {
	constructor(e, t) {
		t === void 0 && (t = {}), super(t, [e]);
		let n = this;
		n.params = J({}, e.params.colorPicker, t);
		let r;
		if (n.params.containerEl && (r = W(n.params.containerEl), r.length === 0)) return n;
		let i;
		n.params.inputEl && (i = W(n.params.inputEl));
		let a;
		n.params.targetEl && (a = W(n.params.targetEl)), J(n, {
			app: e,
			$containerEl: r,
			containerEl: r && r[0],
			inline: r && r.length > 0,
			$inputEl: i,
			inputEl: i && i[0],
			$targetEl: a,
			targetEl: a && a[0],
			initialized: !1,
			opened: !1,
			url: n.params.url,
			modules: {
				"alpha-slider": hf,
				"current-color": gf,
				hex: _f,
				"hsb-sliders": vf,
				"hue-slider": yf,
				"brightness-slider": bf,
				palette: xf,
				"initial-current-colors": Sf,
				"rgb-bars": Cf,
				"rgb-sliders": wf,
				"sb-spectrum": Tf,
				"hs-spectrum": Ef,
				wheel: Of
			}
		});
		function o() {
			n.open();
		}
		function s(e) {
			e.preventDefault();
		}
		function c() {
			n.open();
		}
		function l(e) {
			if (n.destroyed || !n.params || n.params.openIn === "page") return;
			let t = W(e.target);
			!n.opened || n.closing || t.closest("[class*=\"backdrop\"]").length || t.closest(".color-picker-popup, .color-picker-popover").length || (i && i.length > 0 ? t[0] !== i[0] && t.closest(".sheet-modal").length === 0 && n.close() : W(e.target).closest(".sheet-modal").length === 0 && n.close());
		}
		return J(n, {
			attachInputEvents() {
				n.$inputEl.on("click", o), n.params.inputReadOnly && (n.$inputEl.on("focus mousedown", s), n.$inputEl[0] && (n.$inputEl[0].f7ValidateReadonly = !0));
			},
			detachInputEvents() {
				n.$inputEl.off("click", o), n.params.inputReadOnly && (n.$inputEl.off("focus mousedown", s), n.$inputEl[0] && delete n.$inputEl[0].f7ValidateReadonly);
			},
			attachTargetEvents() {
				n.$targetEl.on("click", c);
			},
			detachTargetEvents() {
				n.$targetEl.off("click", c);
			},
			attachHtmlEvents() {
				e.on("click", l);
			},
			detachHtmlEvents() {
				e.off("click", l);
			}
		}), n.init(), n;
	}
	get view() {
		let { $inputEl: e, $targetEl: t, app: n, params: r } = this, i;
		return r.view ? i = r.view : (e && (i = e.parents(".view").length && e.parents(".view")[0].f7View), !i && t && (i = t.parents(".view").length && t.parents(".view")[0].f7View)), i ||= n.views.main, i;
	}
	attachEvents() {
		let e = this;
		e.centerModules = e.centerModules.bind(e), e.params.centerModules && e.app.on("resize", e.centerModules);
	}
	detachEvents() {
		let e = this;
		e.params.centerModules && e.app.off("resize", e.centerModules);
	}
	centerModules() {
		let e = this;
		if (!e.opened || !e.$el || e.inline) return;
		let t = e.$el.find(".page-content");
		if (!t.length) return;
		let { scrollHeight: n, offsetHeight: r } = t[0];
		n <= r ? t.addClass("justify-content-center") : t.removeClass("justify-content-center");
	}
	initInput() {
		let e = this;
		e.$inputEl && e.params.inputReadOnly && e.$inputEl.prop("readOnly", !0);
	}
	getModalType() {
		let e = this, { app: t, modal: n, params: r } = e, { openIn: i, openInPhone: a } = r, o = X();
		return n && n.type ? n.type : i === "auto" ? e.inline ? null : o.ios ? o.ipad ? "popover" : a : t.width >= 768 ? "popover" : a : i;
	}
	formatValue() {
		let e = this, { value: t } = e;
		return e.params.formatValue ? e.params.formatValue.call(e, t) : t.hex;
	}
	normalizeHsValues(e) {
		return [
			Math.floor(e[0] * 10) / 10,
			Math.floor(e[1] * 1e3) / 1e3,
			Math.floor(e[2] * 1e3) / 1e3
		];
	}
	setValue(e, t) {
		e === void 0 && (e = {}), t === void 0 && (t = !0);
		let n = this;
		if (e === void 0) return;
		let { hex: r, rgb: i, hsl: a, hsb: o, alpha: s = 1, hue: c, rgba: l, hsla: u } = n.value || {}, d = n.value || !n.value && !n.params.value, f;
		if (Object.keys(e).forEach((t) => {
			if (!n.value || n.value[t] === void 0) {
				f = !0;
				return;
			}
			let r = e[t];
			Array.isArray(r) ? r.forEach((e, r) => {
				e !== n.value[t][r] && (f = !0);
			}) : r !== n.value[t] && (f = !0);
		}), f) {
			if (e.rgb || e.rgba) {
				let [t, d, f, p = s] = e.rgb || e.rgba;
				i = [
					t,
					d,
					f
				], r = Qa(...i), a = $a(...i), o = no(...a), a = n.normalizeHsValues(a), o = n.normalizeHsValues(o), c = o[0], s = p, l = [
					i[0],
					i[1],
					i[2],
					p
				], u = [
					a[0],
					a[1],
					a[2],
					p
				];
			}
			if (e.hsl || e.hsla) {
				let [t, d, f, p = s] = e.hsl || e.hsla;
				a = [
					t,
					d,
					f
				], i = eo(...a), r = Qa(...i), o = no(...a), a = n.normalizeHsValues(a), o = n.normalizeHsValues(o), c = o[0], s = p, l = [
					i[0],
					i[1],
					i[2],
					p
				], u = [
					a[0],
					a[1],
					a[2],
					p
				];
			}
			if (e.hsb) {
				let [t, d, f, p = s] = e.hsb;
				o = [
					t,
					d,
					f
				], a = to(...o), i = eo(...a), r = Qa(...i), a = n.normalizeHsValues(a), o = n.normalizeHsValues(o), c = o[0], s = p, l = [
					i[0],
					i[1],
					i[2],
					p
				], u = [
					a[0],
					a[1],
					a[2],
					p
				];
			}
			if (e.hex && (i = Za(e.hex), r = Qa(...i), a = $a(...i), o = no(...a), a = n.normalizeHsValues(a), o = n.normalizeHsValues(o), c = o[0], l = [
				i[0],
				i[1],
				i[2],
				s
			], u = [
				a[0],
				a[1],
				a[2],
				s
			]), e.alpha !== void 0 && (s = e.alpha, i !== void 0 && (l = [
				i[0],
				i[1],
				i[2],
				s
			]), a !== void 0 && (u = [
				a[0],
				a[1],
				a[2],
				s
			])), e.hue !== void 0) {
				let [t, d, f] = a;
				a = [
					e.hue,
					d,
					f
				], o = no(...a), i = eo(...a), r = Qa(...i), a = n.normalizeHsValues(a), o = n.normalizeHsValues(o), c = o[0], l = [
					i[0],
					i[1],
					i[2],
					s
				], u = [
					a[0],
					a[1],
					a[2],
					s
				];
			}
			n.value = {
				hex: r,
				alpha: s,
				hue: c,
				rgb: i,
				hsl: a,
				hsb: o,
				rgba: l,
				hsla: u
			}, n.initialValue ||= J({}, n.value), n.updateValue(d), n.opened && t && n.updateModules();
		}
	}
	getValue() {
		return this.value;
	}
	updateValue(e) {
		e === void 0 && (e = !0);
		let t = this, { $inputEl: n, value: r, $targetEl: i } = t;
		if (i && t.params.targetElSetBackgroundColor) {
			let { rgba: e } = r;
			i.css("background-color", `rgba(${e.join(", ")})`);
		}
		if (e && t.emit("local::change colorPickerChange", t, r), n && n.length) {
			let i = t.formatValue(r);
			n && n.length && (n.val(i), e && n.trigger("change"));
		}
	}
	updateModules() {
		let e = this, { modules: t } = e;
		e.params.modules.forEach((n) => {
			typeof n == "string" && t[n] && t[n].update ? t[n].update(e) : n && n.update && n.update(e);
		});
	}
	update() {
		this.updateModules();
	}
	renderPicker() {
		let e = this, { params: t, modules: n } = e, r = "";
		return t.modules.forEach((t) => {
			typeof t == "string" && n[t] && n[t].render ? r += n[t].render(e) : t && t.render && (r += t.render(e));
		}), r;
	}
	renderNavbar() {
		let e = this;
		if (e.params.renderNavbar) return e.params.renderNavbar.call(e, e);
		let { openIn: t, navbarTitleText: n, navbarBackLinkText: r, navbarCloseText: i } = e.params;
		return Q("div", { class: "navbar" }, Q("div", { class: "navbar-bg" }), Q("div", { class: "navbar-inner sliding" }, t === "page" && Q("div", { class: "left" }, Q("a", { class: "link back" }, Q("i", { class: "icon icon-back" }), Q("span", { class: "if-not-md" }, r))), Q("div", { class: "title" }, n), t !== "page" && Q("div", { class: "right" }, Q("a", {
			class: "link popup-close",
			"data-popup": ".color-picker-popup"
		}, i))));
	}
	renderToolbar() {
		let e = this;
		return e.params.renderToolbar ? e.params.renderToolbar.call(e, e) : Q("div", { class: "toolbar toolbar-top" }, Q("div", { class: "toolbar-inner" }, Q("div", { class: "left" }), Q("div", { class: "right" }, Q("a", {
			class: "link sheet-close popover-close",
			"data-sheet": ".color-picker-sheet-modal",
			"data-popover": ".color-picker-popover"
		}, e.params.toolbarCloseText))));
	}
	renderInline() {
		let e = this, { cssClass: t, groupedModules: n } = e.params;
		return Q("div", { class: `color-picker color-picker-inline ${n ? "color-picker-grouped-modules" : ""} ${t || ""}` }, e.renderPicker());
	}
	renderSheet() {
		let e = this, { cssClass: t, toolbarSheet: n, groupedModules: r } = e.params;
		return Q("div", { class: `sheet-modal color-picker color-picker-sheet-modal ${r ? "color-picker-grouped-modules" : ""} ${t || ""}` }, n && e.renderToolbar(), Q("div", { class: "sheet-modal-inner" }, Q("div", { class: "page-content" }, e.renderPicker())));
	}
	renderPopover() {
		let e = this, { cssClass: t, toolbarPopover: n, groupedModules: r } = e.params;
		return Q("div", { class: `popover color-picker-popover ${t || ""}` }, Q("div", { class: "popover-inner" }, Q("div", { class: `color-picker ${r ? "color-picker-grouped-modules" : ""}` }, n && e.renderToolbar(), Q("div", { class: "page-content" }, e.renderPicker()))));
	}
	renderPopup() {
		let e = this, { cssClass: t, navbarPopup: n, groupedModules: r } = e.params;
		return Q("div", { class: `popup color-picker-popup ${t || ""}` }, Q("div", { class: "page" }, n && e.renderNavbar(), Q("div", { class: `color-picker ${r ? "color-picker-grouped-modules" : ""}` }, Q("div", { class: "page-content" }, e.renderPicker()))));
	}
	renderPage() {
		let e = this, { cssClass: t, groupedModules: n } = e.params;
		return Q("div", {
			class: `page color-picker-page ${t || ""}`,
			"data-name": "color-picker-page"
		}, e.renderNavbar(), Q("div", { class: `color-picker ${n ? "color-picker-grouped-modules" : ""}` }, Q("div", { class: "page-content" }, e.renderPicker())));
	}
	render() {
		let e = this, { params: t } = e;
		if (t.render) return t.render.call(e);
		if (e.inline) return e.renderInline();
		if (t.openIn === "page") return e.renderPage();
		let n = e.getModalType();
		if (n === "popover") return e.renderPopover();
		if (n === "sheet") return e.renderSheet();
		if (n === "popup") return e.renderPopup();
	}
	onOpen() {
		let e = this, { initialized: t, $el: n, app: r, $inputEl: i, inline: a, value: o, params: s, modules: c } = e;
		e.closing = !1, e.opened = !0, e.opening = !0, e.attachEvents(), s.modules.forEach((t) => {
			typeof t == "string" && c[t] && c[t].init ? c[t].init(e) : t && t.init && t.init(e);
		});
		let l = !o && s.value;
		t ? o && (e.initialValue = J({}, o), e.setValue(o, !1)) : o ? e.setValue(o) : s.value ? e.setValue(s.value, !1) : s.value || e.setValue({ hex: "#ff0000" }, !1), l && e.updateValue(), e.updateModules(), s.centerModules && e.centerModules(), !a && i && i.length && r.theme === "md" && i.trigger("focus"), e.initialized = !0, n && n.trigger("colorpicker:open"), i && i.trigger("colorpicker:open"), e.emit("local::open colorPickerOpen", e);
	}
	onOpened() {
		let e = this;
		e.opening = !1, e.$el && e.$el.trigger("colorpicker:opened"), e.$inputEl && e.$inputEl.trigger("colorpicker:opened"), e.emit("local::opened colorPickerOpened", e);
	}
	onClose() {
		let e = this, { app: t, params: n, modules: r } = e;
		if (e.opening = !1, e.closing = !0, e.detachEvents(), e.$inputEl) if (t.theme === "md") e.$inputEl.trigger("blur");
		else {
			let n = e.$inputEl.attr("validate"), r = e.$inputEl.attr("required");
			n && r && t.input.validate(e.$inputEl);
		}
		n.modules.forEach((t) => {
			typeof t == "string" && r[t] && r[t].destroy ? r[t].destroy(e) : t && t.destroy && t.destroy(e);
		}), e.$el && e.$el.trigger("colorpicker:close"), e.$inputEl && e.$inputEl.trigger("colorpicker:close"), e.emit("local::close colorPickerClose", e);
	}
	onClosed() {
		let e = this;
		e.opened = !1, e.closing = !1, e.inline || Ua(() => {
			e.modal && e.modal.el && e.modal.destroy && (e.params.routableModals || e.modal.destroy()), delete e.modal;
		}), e.$el && e.$el.trigger("colorpicker:closed"), e.$inputEl && e.$inputEl.trigger("colorpicker:closed"), e.emit("local::closed colorPickerClosed", e);
	}
	open() {
		let e = this, { app: t, opened: n, inline: r, $inputEl: i, $targetEl: a, params: o } = e;
		if (n) return;
		if (r) {
			e.$el = W(e.render()), e.$el[0].f7ColorPicker = e, e.$containerEl.append(e.$el), e.onOpen(), e.onOpened();
			return;
		}
		let s = e.render();
		if (o.openIn === "page") e.view.router.navigate({
			url: e.url,
			route: {
				content: s,
				path: e.url,
				on: {
					pageBeforeIn(t, n) {
						e.$el = n.$el.find(".color-picker"), e.$el[0].f7ColorPicker = e, e.onOpen();
					},
					pageAfterIn() {
						e.onOpened();
					},
					pageBeforeOut() {
						e.onClose();
					},
					pageAfterOut() {
						e.onClosed(), e.$el && e.$el[0] && (e.$el[0].f7ColorPicker = null, delete e.$el[0].f7ColorPicker);
					}
				}
			}
		});
		else {
			let n = e.getModalType(), r = o.backdrop;
			r ?? (n === "popover" && t.params.popover.backdrop !== !1 && (r = !0), n === "popup" && (r = !0));
			let c = {
				targetEl: a || i,
				scrollToEl: o.scrollToInput ? a || i : void 0,
				content: s,
				backdrop: r,
				closeByBackdropClick: o.closeByBackdropClick,
				on: {
					open() {
						let t = this;
						e.modal = t, e.$el = n === "popover" || n === "popup" ? t.$el.find(".color-picker") : t.$el, e.$el[0].f7ColorPicker = e, e.onOpen();
					},
					opened() {
						e.onOpened();
					},
					close() {
						e.onClose();
					},
					closed() {
						e.onClosed(), e.$el && e.$el[0] && (e.$el[0].f7ColorPicker = null, delete e.$el[0].f7ColorPicker);
					}
				}
			};
			n === "popup" && (c.push = o.popupPush, c.swipeToClose = o.popupSwipeToClose), n === "sheet" && (c.push = o.sheetPush, c.swipeToClose = o.sheetSwipeToClose), o.routableModals && e.view ? e.view.router.navigate({
				url: e.url,
				route: {
					path: e.url,
					[n]: c
				}
			}) : (e.modal = t[n].create(c), e.modal.open());
		}
	}
	close() {
		let e = this, { opened: t, inline: n } = e;
		if (t) {
			if (n) {
				e.onClose(), e.onClosed();
				return;
			}
			e.params.routableModals && e.view || e.params.openIn === "page" ? e.view.router.back() : e.modal.close();
		}
	}
	init() {
		let e = this;
		if (e.initInput(), e.inline) {
			e.open(), e.emit("local::init colorPickerInit", e);
			return;
		}
		!e.initialized && e.params.value && e.setValue(e.params.value), e.$inputEl && e.attachInputEvents(), e.$targetEl && e.attachTargetEvents(), e.params.closeByOutsideClick && e.attachHtmlEvents(), e.emit("local::init colorPickerInit", e);
	}
	destroy() {
		let e = this;
		if (e.destroyed) return;
		let { $el: t } = e;
		e.emit("local::beforeDestroy colorPickerBeforeDestroy", e), t && t.trigger("colorpicker:beforedestroy"), e.close(), e.detachEvents(), e.$inputEl && e.detachInputEvents(), e.$targetEl && e.detachTargetEvents(), e.params.closeByOutsideClick && e.detachHtmlEvents(), t && t.length && delete e.$el[0].f7ColorPicker, Ba(e), e.destroyed = !0;
	}
}, Af = {
	name: "colorPicker",
	static: { ColorPicker: kf },
	create() {
		let e = this;
		e.colorPicker = ho({
			defaultSelector: ".color-picker",
			constructor: kf,
			app: e,
			domProp: "f7ColorPicker"
		}), e.colorPicker.close = function(e) {
			e === void 0 && (e = ".color-picker");
			let t = W(e);
			if (t.length === 0) return;
			let n = t[0].f7ColorPicker;
			!n || n && !n.opened || n.close();
		};
	},
	params: { colorPicker: {
		value: null,
		modules: ["wheel"],
		palette: [
			[
				"#FFEBEE",
				"#FFCDD2",
				"#EF9A9A",
				"#E57373",
				"#EF5350",
				"#F44336",
				"#E53935",
				"#D32F2F",
				"#C62828",
				"#B71C1C"
			],
			[
				"#F3E5F5",
				"#E1BEE7",
				"#CE93D8",
				"#BA68C8",
				"#AB47BC",
				"#9C27B0",
				"#8E24AA",
				"#7B1FA2",
				"#6A1B9A",
				"#4A148C"
			],
			[
				"#E8EAF6",
				"#C5CAE9",
				"#9FA8DA",
				"#7986CB",
				"#5C6BC0",
				"#3F51B5",
				"#3949AB",
				"#303F9F",
				"#283593",
				"#1A237E"
			],
			[
				"#E1F5FE",
				"#B3E5FC",
				"#81D4FA",
				"#4FC3F7",
				"#29B6F6",
				"#03A9F4",
				"#039BE5",
				"#0288D1",
				"#0277BD",
				"#01579B"
			],
			[
				"#E0F2F1",
				"#B2DFDB",
				"#80CBC4",
				"#4DB6AC",
				"#26A69A",
				"#009688",
				"#00897B",
				"#00796B",
				"#00695C",
				"#004D40"
			],
			[
				"#F1F8E9",
				"#DCEDC8",
				"#C5E1A5",
				"#AED581",
				"#9CCC65",
				"#8BC34A",
				"#7CB342",
				"#689F38",
				"#558B2F",
				"#33691E"
			],
			[
				"#FFFDE7",
				"#FFF9C4",
				"#FFF59D",
				"#FFF176",
				"#FFEE58",
				"#FFEB3B",
				"#FDD835",
				"#FBC02D",
				"#F9A825",
				"#F57F17"
			],
			[
				"#FFF3E0",
				"#FFE0B2",
				"#FFCC80",
				"#FFB74D",
				"#FFA726",
				"#FF9800",
				"#FB8C00",
				"#F57C00",
				"#EF6C00",
				"#E65100"
			]
		],
		groupedModules: !1,
		centerModules: !0,
		sliderLabel: !1,
		sliderValue: !1,
		sliderValueEdiable: !1,
		barLabel: !1,
		barValue: !1,
		barValueEdiable: !1,
		hexLabel: !1,
		hexValueEditable: !1,
		redLabelText: "R",
		greenLabelText: "G",
		blueLabelText: "B",
		hueLabelText: "H",
		saturationLabelText: "S",
		brightnessLabelText: "B",
		hexLabelText: "HEX",
		alphaLabelText: "A",
		containerEl: null,
		openIn: "popover",
		openInPhone: "popup",
		popupPush: !1,
		popupSwipeToClose: void 0,
		sheetPush: !1,
		sheetSwipeToClose: void 0,
		formatValue: null,
		targetEl: null,
		targetElSetBackgroundColor: !1,
		inputEl: null,
		inputReadOnly: !0,
		closeByOutsideClick: !0,
		scrollToInput: !0,
		toolbarSheet: !0,
		toolbarPopover: !1,
		toolbarCloseText: "Done",
		navbarPopup: !0,
		navbarCloseText: "Done",
		navbarTitleText: "Color",
		navbarBackLinkText: "Back",
		cssClass: null,
		routableModals: !1,
		view: null,
		url: "color/",
		backdrop: null,
		closeByBackdropClick: !0,
		renderToolbar: null,
		renderNavbar: null,
		renderInline: null,
		renderPopover: null,
		renderSheet: null,
		renderPopup: null,
		render: null
	} }
}, jf = {
	open(e) {
		let t = this, n = W(e).eq(0);
		if (!n.length) return;
		n.addClass("treeview-item-opened"), n.trigger("treeview:open"), t.emit("treeviewOpen", n[0]);
		function r(e) {
			e ? (n.removeClass("treeview-item-opened"), n.trigger("treeview:close"), t.emit("treeviewClose", n[0])) : n[0].f7TreeviewChildrenLoaded = !0, n.find(".treeview-toggle").removeClass("treeview-toggle-hidden"), n.find(".treeview-preloader").remove();
		}
		if (n.hasClass("treeview-load-children") && !n[0].f7TreeviewChildrenLoaded) {
			let e = {
				iosPreloaderContent: Ra,
				mdPreloaderContent: La
			};
			n.trigger("treeview:loadchildren", r), t.emit("treeviewLoadChildren", n[0], r), n.find(".treeview-toggle").addClass("treeview-toggle-hidden"), n.find(".treeview-item-root").prepend(`<div class="preloader treeview-preloader">${e[`${t.theme}PreloaderContent`]}</div>`);
		}
	},
	close(e) {
		let t = this, n = W(e).eq(0);
		n.length && (n.removeClass("treeview-item-opened"), n.trigger("treeview:close"), t.emit("treeviewClose", n[0]));
	},
	toggle(e) {
		let t = this, n = W(e).eq(0);
		if (!n.length) return;
		let r = n.hasClass("treeview-item-opened");
		t.treeview[r ? "close" : "open"](n);
	}
}, Mf = {
	name: "treeview",
	create() {
		ao(this, { treeview: jf });
	},
	clicks: {
		".treeview-toggle": function(e, t, n) {
			let r = this;
			if (e.parents(".treeview-item-toggle").length) return;
			let i = e.parents(".treeview-item").eq(0);
			i.length && (n.preventF7Router = !0, r.treeview.toggle(i[0]));
		},
		".treeview-item-toggle": function(e, t, n) {
			let r = this, i = e.closest(".treeview-item").eq(0);
			i.length && (n.preventF7Router = !0, r.treeview.toggle(i[0]));
		}
	}
}, Nf = {
	bold: [
		"bold",
		"format_bold",
		"bold"
	],
	italic: [
		"italic",
		"format_italic",
		"italic"
	],
	underline: [
		"underline",
		"format_underlined",
		"underline"
	],
	strikeThrough: [
		"strikethrough",
		"strikethrough_s",
		"strikeThrough"
	],
	orderedList: [
		"list_number",
		"format_list_numbered",
		"insertOrderedList"
	],
	unorderedList: [
		"list_bullet",
		"format_list_bulleted",
		"insertUnorderedList"
	],
	link: [
		"link",
		"link",
		"createLink"
	],
	image: [
		"photo",
		"image",
		"insertImage"
	],
	paragraph: [
		"paragraph",
		"<i class=\"icon\">¶</i>",
		"formatBlock.P"
	],
	h1: [
		"<i class=\"icon\">H<sub>1</sub></i>",
		"<i class=\"icon\">H<sub>1</sub></i>",
		"formatBlock.H1"
	],
	h2: [
		"<i class=\"icon\">H<sub>2</sub></i>",
		"<i class=\"icon\">H<sub>2</sub></i>",
		"formatBlock.H2"
	],
	h3: [
		"<i class=\"icon\">H<sub>3</sub></i>",
		"<i class=\"icon\">H<sub>3</sub></i>",
		"formatBlock.H3"
	],
	alignLeft: [
		"text_alignleft",
		"format_align_left",
		"justifyLeft"
	],
	alignCenter: [
		"text_aligncenter",
		"format_align_center",
		"justifyCenter"
	],
	alignRight: [
		"text_alignright",
		"format_align_right",
		"justifyRight"
	],
	alignJustify: [
		"text_justify",
		"format_align_justify",
		"justifyFull"
	],
	subscript: [
		"textformat_subscript",
		"<i class=\"icon\">A<sub>1</sub></i>",
		"subscript"
	],
	superscript: [
		"textformat_superscript",
		"<i class=\"icon\">A<sup>1</sup></i>",
		"superscript"
	],
	indent: [
		"increase_indent",
		"format_indent_increase",
		"indent"
	],
	outdent: [
		"decrease_indent",
		"format_indent_decrease",
		"outdent"
	]
}, Pf = class extends Z {
	constructor(e, t) {
		super(t, [e]);
		let n = this, r = V(), i = X(), a = J({}, e.params.textEditor);
		n.useModulesParams(a), n.params = J(a, t);
		let o = n.params.el;
		if (!o) return n;
		let s = W(o);
		if (s.length === 0) return n;
		if (s[0].f7TextEditor) return s[0].f7TextEditor;
		let c = s.children(".text-editor-content");
		if (c.length || (s.append("<div class=\"text-editor-content\" contenteditable></div>"), c = s.children(".text-editor-content")), J(n, {
			app: e,
			$el: s,
			el: s[0],
			$contentEl: c,
			contentEl: c[0]
		}), "value" in t && (n.value = n.params.value), n.params.mode === "keyboard-toolbar" && !(i.cordova || i.capacitor) && !i.android && (n.params.mode = "popover"), typeof n.params.buttons == "string") try {
			n.params.buttons = JSON.parse(n.params.buttons);
		} catch {
			throw Error("Framework7: TextEditor: wrong \"buttons\" parameter format");
		}
		return s[0].f7TextEditor = n, n.onButtonClick = n.onButtonClick.bind(n), n.onFocus = n.onFocus.bind(n), n.onBlur = n.onBlur.bind(n), n.onInput = n.onInput.bind(n), n.onPaste = n.onPaste.bind(n), n.onSelectionChange = n.onSelectionChange.bind(n), n.closeKeyboardToolbar = n.closeKeyboardToolbar.bind(n), n.attachEvents = function() {
			n.params.mode === "toolbar" && n.$el.find(".text-editor-toolbar").on("click", "button", n.onButtonClick), n.params.mode === "keyboard-toolbar" && (n.$keyboardToolbarEl.on("click", "button", n.onButtonClick), n.$el.parents(".page").on("page:beforeout", n.closeKeyboardToolbar)), n.params.mode === "popover" && n.popover && n.popover.$el.on("click", "button", n.onButtonClick), n.$contentEl.on("paste", n.onPaste), n.$contentEl.on("focus", n.onFocus), n.$contentEl.on("blur", n.onBlur), n.$contentEl.on("input", n.onInput, !0), W(r).on("selectionchange", n.onSelectionChange);
		}, n.detachEvents = function() {
			n.params.mode === "toolbar" && n.$el.find(".text-editor-toolbar").off("click", "button", n.onButtonClick), n.params.mode === "keyboard-toolbar" && (n.$keyboardToolbarEl.off("click", "button", n.onButtonClick), n.$el.parents(".page").off("page:beforeout", n.closeKeyboardToolbar)), n.params.mode === "popover" && n.popover && n.popover.$el.off("click", "button", n.onButtonClick), n.$contentEl.off("paste", n.onPaste), n.$contentEl.off("focus", n.onFocus), n.$contentEl.off("blur", n.onBlur), n.$contentEl.off("input", n.onInput, !0), W(r).off("selectionchange", n.onSelectionChange);
		}, n.useModules(), n.init(), n;
	}
	setValue(e) {
		let t = this;
		return t.value === e ? t : (t.value = e, t.$contentEl.html(e), t.$el.trigger("texteditor:change", t.value), t.emit("local::change textEditorChange", t, t.value), t);
	}
	getValue() {
		return this.value;
	}
	clearValue() {
		let e = this;
		return e.setValue(""), e.params.placeholder && !e.$contentEl.html() && e.insertPlaceholder(), e;
	}
	createLink() {
		let e = this, t = H(), n = V(), r = t.getSelection(), i = [], a;
		if (r && r.anchorNode && W(r.anchorNode).parents(e.$el).length) {
			let e = r.anchorNode;
			for (; e;) i.push(e), (!e.nextSibling || e === r.focusNode) && (e = null), e &&= e.nextSibling;
			let t = [], n = W(i);
			for (let e = 0; e < n.length; e += 1) {
				let r = n[e].children;
				if (r) for (let e = 0; e < r.length; e += 1) W(r[e]).is("a") && t.push(r[e]);
			}
			a = n.closest("a").add(W(t));
		}
		if (a && a.length) return a.each((e) => {
			let r = t.getSelection(), i = n.createRange();
			i.selectNodeContents(e), r.removeAllRanges(), r.addRange(i), n.execCommand("unlink", !1), r.removeAllRanges();
		}), e;
		let o = e.getSelectionRange();
		return o && e.app.dialog.prompt("", e.params.linkUrlText, (t) => {
			t && t.trim().length && (e.setSelectionRange(o), n.execCommand("createLink", !1, t.trim()), e.$el.trigger("texteditor:insertlink", { url: t.trim() }), e.emit("local:insertLink textEditorInsertLink", e, t.trim()));
		}).$el.find("input").focus(), e;
	}
	insertImage() {
		let e = this, t = V(), n = e.getSelectionRange();
		return n && e.app.dialog.prompt("", e.params.imageUrlText, (r) => {
			r && r.trim().length && (e.setSelectionRange(n), t.execCommand("insertImage", !1, r.trim()), e.$el.trigger("texteditor:insertimage", { url: r.trim() }), e.emit("local:insertImage textEditorInsertImage", e, r.trim()));
		}).$el.find("input").focus(), e;
	}
	removePlaceholder() {
		this.$contentEl.find(".text-editor-placeholder").remove();
	}
	insertPlaceholder() {
		let e = this;
		e.$contentEl.append(`<div class="text-editor-placeholder">${e.params.placeholder}</div>`);
	}
	onSelectionChange() {
		let e = this, t = H(), n = V();
		if (e.params.mode === "toolbar") return;
		let r = t.getSelection(), i = W(r.anchorNode).parents(e.contentEl).length || r.anchorNode === e.contentEl;
		if (e.params.mode === "keyboard-toolbar") {
			i ? e.openKeyboardToolbar() : e.closeKeyboardToolbar();
			return;
		}
		if (e.params.mode === "popover") {
			let a = W(r.anchorNode).parents(e.popover.el).length || r.anchorNode === e.popover.el;
			if (!i && !a) {
				e.closePopover();
				return;
			}
			if (!r.isCollapsed && r.rangeCount) {
				let i = r.getRangeAt(0).getBoundingClientRect(), a = e.app.$el[0] || n.body;
				e.openPopover(i.x + (t.scrollX || 0) - a.offsetLeft, i.y + (t.scrollY || 0) - a.offsetTop, i.width, i.height);
			} else r.isCollapsed && e.closePopover();
		}
	}
	onPaste(e) {
		let t = this, n = V();
		if (t.params.clearFormattingOnPaste && e.clipboardData && e.clipboardData.getData) {
			let t = e.clipboardData.getData("text/plain");
			e.preventDefault(), n.execCommand("insertText", !1, t);
		}
	}
	onInput() {
		let e = this;
		e.value = e.$contentEl.html(), e.$el.trigger("texteditor:input"), e.emit("local:input textEditorInput", e, e.value), e.$el.trigger("texteditor:change", e.value), e.emit("local::change textEditorChange", e, e.value);
	}
	onFocus() {
		let e = this;
		e.removePlaceholder(), e.$contentEl.focus(), e.$el.trigger("texteditor:focus"), e.emit("local::focus textEditorFocus", e);
	}
	onBlur() {
		let e = this, t = H(), n = V();
		if (e.params.placeholder && e.$contentEl.html() === "" && e.insertPlaceholder(), e.params.mode === "popover") {
			let r = t.getSelection(), i = W(r.anchorNode).parents(e.contentEl).length || r.anchorNode === e.contentEl;
			!(n.activeElement && e.popover && W(n.activeElement).closest(e.popover.$el).length) && !i && e.closePopover();
		}
		if (e.params.mode === "keyboard-toolbar") {
			let n = t.getSelection();
			W(n.anchorNode).parents(e.contentEl).length || n.anchorNode === e.contentEl || e.closeKeyboardToolbar();
		}
		e.$el.trigger("texteditor:blur"), e.emit("local::blur textEditorBlur", e);
	}
	onButtonClick(e) {
		let t = this, n = H(), r = V(), i = n.getSelection();
		if (!(W(i.anchorNode).parents(t.contentEl).length || i.anchorNode === t.contentEl)) return;
		let a = W(e.target).closest("button");
		a.parents("form").length && e.preventDefault();
		let o = a.attr("data-button"), s = t.params.customButtons && t.params.customButtons[o];
		if (!o || !(Nf[o] || s)) return;
		if (a.trigger("texteditor:buttonclick", o), t.emit("local::buttonClick textEditorButtonClick", t, o), s) {
			s.onClick && s.onClick(t, a[0]);
			return;
		}
		let c = Nf[o][2];
		if (c === "createLink") {
			t.createLink();
			return;
		}
		if (c === "insertImage") {
			t.insertImage();
			return;
		}
		if (c.indexOf("formatBlock") === 0) {
			let e = c.split(".")[1], t = W(i.anchorNode);
			t.parents(e.toLowerCase()).length || t.is(e) ? r.execCommand("formatBlock", !1, "div") : r.execCommand("formatBlock", !1, e);
			return;
		}
		r.execCommand(c, !1);
	}
	getSelectionRange() {
		let e = H(), t = V();
		if (e.getSelection) {
			let t = e.getSelection();
			if (t.getRangeAt && t.rangeCount) return t.getRangeAt(0);
		} else if (t.selection && t.selection.createRange) return t.selection.createRange();
		return null;
	}
	setSelectionRange(e) {
		let t = H(), n = V();
		if (e) if (t.getSelection) {
			let n = t.getSelection();
			n.removeAllRanges(), n.addRange(e);
		} else n.selection && e.select && e.select();
	}
	renderButtons() {
		let e = this, t = "";
		function n(t) {
			let n = e.app.theme === "md" ? "material-icons" : "f7-icons";
			if (e.params.customButtons && e.params.customButtons[t]) return `<button type="button" class="text-editor-button" data-button="${t}">${e.params.customButtons[t].content || ""}</button>`;
			if (!Nf[t]) return "";
			let r = Nf[t][+(e.app.theme === "md")];
			return `<button type="button" class="text-editor-button" data-button="${t}">${r.indexOf("<") >= 0 ? r : `<i class="${n}">${r}</i>`}</button>`.trim();
		}
		return e.params.buttons.forEach((r, i) => {
			Array.isArray(r) ? (r.forEach((e) => {
				t += n(e);
			}), i < e.params.buttons.length - 1 && e.params.dividers && (t += "<div class=\"text-editor-button-divider\"></div>")) : t += n(r);
		}), t;
	}
	createToolbar() {
		let e = this;
		e.$el.prepend(`<div class="text-editor-toolbar">${e.renderButtons()}</div>`);
	}
	createKeyboardToolbar() {
		let e = this;
		e.$keyboardToolbarEl = W(`<div class="toolbar toolbar-bottom text-editor-keyboard-toolbar"><div class="toolbar-inner">${e.renderButtons()}</div></div>`);
	}
	createPopover() {
		let e = this;
		e.popover = e.app.popover.create({
			content: `
        <div class="popover dark text-editor-popover">
          <div class="popover-inner">${e.renderButtons()}</div>
        </div>
      `,
			closeByOutsideClick: !1,
			backdrop: !1
		});
	}
	openKeyboardToolbar() {
		let e = this;
		e.$keyboardToolbarEl.parent(e.app.$el).length || (e.$el.trigger("texteditor:keyboardopen"), e.emit("local::keyboardOpen textEditorKeyboardOpen", e), e.app.$el.append(e.$keyboardToolbarEl));
	}
	closeKeyboardToolbar() {
		let e = this;
		e.$keyboardToolbarEl.remove(), e.$el.trigger("texteditor:keyboardclose"), e.emit("local::keyboardClose textEditorKeyboardClose", e);
	}
	openPopover(e, t, n, r) {
		let i = this;
		i.popover && (Object.assign(i.popover.params, {
			targetX: e,
			targetY: t,
			targetWidth: n,
			targetHeight: r
		}), clearTimeout(i.popoverTimeout), i.popoverTimeout = setTimeout(() => {
			i.popover && (i.popover.opened ? i.popover.resize() : (i.$el.trigger("texteditor:popoveropen"), i.emit("local::popoverOpen textEditorPopoverOpen", i), i.popover.open()));
		}, 400));
	}
	closePopover() {
		let e = this;
		clearTimeout(e.popoverTimeout), !(!e.popover || !e.popover.opened) && (e.popoverTimeout = setTimeout(() => {
			e.popover && (e.$el.trigger("texteditor:popoverclose"), e.emit("local::popoverClose textEditorPopoverClose", e), e.popover.close());
		}, 400));
	}
	init() {
		let e = this;
		return e.value ? e.$contentEl.html(e.value) : e.value = e.$contentEl.html(), e.params.placeholder && e.value === "" && e.insertPlaceholder(), e.params.mode === "toolbar" ? e.createToolbar() : e.params.mode === "popover" ? e.createPopover() : e.params.mode === "keyboard-toolbar" && e.createKeyboardToolbar(), e.attachEvents(), e.$el.trigger("texteditor:init"), e.emit("local::init textEditorInit", e), e;
	}
	destroy() {
		let e = this;
		e.$el.trigger("texteditor:beforedestroy"), e.emit("local::beforeDestroy textEditorBeforeDestroy", e), e.detachEvents(), e.params.mode === "keyboard-toolbar" && e.$keyboardToolbarEl && e.$keyboardToolbarEl.remove(), e.popover && (e.popover.close(!1), e.popover.destroy()), delete e.$el[0].f7TextEditor, Ba(e), e = null;
	}
}, Ff = {
	name: "textEditor",
	params: { textEditor: {
		el: null,
		mode: "toolbar",
		value: void 0,
		customButtons: null,
		buttons: [
			[
				"bold",
				"italic",
				"underline",
				"strikeThrough"
			],
			["orderedList", "unorderedList"],
			["link", "image"],
			[
				"paragraph",
				"h1",
				"h2",
				"h3"
			],
			[
				"alignLeft",
				"alignCenter",
				"alignRight",
				"alignJustify"
			],
			["subscript", "superscript"],
			["indent", "outdent"]
		],
		dividers: !0,
		imageUrlText: "Insert image URL",
		linkUrlText: "Insert link URL",
		placeholder: null,
		clearFormattingOnPaste: !0
	} },
	create() {
		let e = this;
		e.textEditor = J(ho({
			defaultSelector: ".text-editor",
			constructor: Pf,
			app: e,
			domProp: "f7TextEditor"
		}));
	},
	static: { TextEditor: Pf },
	on: {
		tabMounted(e) {
			let t = this;
			W(e).find(".text-editor-init").each((e) => {
				let n = W(e).dataset();
				t.textEditor.create(J({ el: e }, n || {}));
			});
		},
		tabBeforeRemove(e) {
			W(e).find(".text-editor-init").each((e) => {
				e.f7TextEditor && e.f7TextEditor.destroy();
			});
		},
		pageInit(e) {
			let t = this;
			e.$el.find(".text-editor-init").each((e) => {
				let n = W(e).dataset();
				t.textEditor.create(J({ el: e }, n || {}));
			});
		},
		pageBeforeRemove(e) {
			e.$el.find(".text-editor-init").each((e) => {
				e.f7TextEditor && e.f7TextEditor.destroy();
			});
		}
	},
	vnode: { "text-editor-init": {
		insert(e) {
			let t = this, n = e.elm, r = W(n).dataset();
			t.textEditor.create(J({ el: n }, r || {}));
		},
		destroy(e) {
			let t = e.elm;
			t.f7TextEditor && t.f7TextEditor.destroy();
		}
	} }
}, If = {};
//#endregion
//#region node_modules/framework7/framework7-lite-bundle.esm.js
yo.use([
	bo,
	xo,
	So,
	Co,
	To,
	ss,
	rs,
	cs,
	us,
	fs,
	hs,
	_s,
	ys,
	xs,
	Ss,
	ws,
	As,
	Ms,
	Ps,
	Is,
	Rs,
	Bs,
	Hs,
	Ws,
	Ks,
	Js,
	Xs,
	Qs,
	ec,
	tc,
	rc,
	ac,
	oc,
	cc,
	fc,
	mc,
	hc,
	xc,
	Cc,
	wc,
	Tc,
	Dc,
	kc,
	jc,
	Ic,
	Lc,
	zc,
	Hc,
	Wc,
	Kc,
	Jc,
	Xc,
	Qc,
	tl,
	rl,
	af,
	sf,
	lf,
	df,
	pf,
	mf,
	Af,
	Mf,
	Ff,
	{
		name: "breadrumbs",
		create() {
			ao(this, { breadrumbs: If });
		}
	},
	{ name: "typography" }
]);
var Lf = yo, Rf, zf = !1, Bf = {
	info(...e) {
		Bf.log("info", ...e);
	},
	error(...e) {
		Bf.log("err", ...e);
	},
	fail(...e) {
		Bf.log("fail", ...e);
	},
	warn(...e) {
		Bf.log("warn", ...e);
	},
	debug(...e) {
		Bf.log("debug", ...e);
	},
	log(e, ...t) {
		let n = "[preview-shortcut]";
		switch (e) {
			case "info":
				console.info(n, ...t);
				break;
			case "err":
				console.error(n, ...t);
				break;
			case "fail": throw Error([n, ...t].join(" "));
			case "warn":
				console.warn(n, ...t);
				break;
			case "debug": return;
		}
	}
}, Vf = class {
	selector;
	name;
	url;
	data = {};
	header;
	meta;
	automations;
	variables;
	framework7;
	constructor(e) {
		if (this.selector = e.selector ?? "#shortcut-preview", this.name = e.name ?? null, this.url = e.url ?? null, this.data = e.data ?? null, this.header = e.header ?? !0, this.meta = e.meta ?? !0, this.automations = e.automations ?? !0, this.variables = e.variables ?? !1, this.framework7 = e.framework7 ?? new Lf({ theme: "ios" }), e.framework7 && Bf.debug("Inherited Framework7 instance."), this.data) {
			this.preview();
			return;
		}
		if (this.url) {
			this.loadURL();
			return;
		}
		Bf.fail("Missing `data` or `url` option.");
	}
	load(e) {
		if (e instanceof ArrayBuffer) {
			this.data = (0, Wn.parse)(e), this.preview();
			return;
		} else if (typeof e == "object") {
			this.data = e, this.preview();
			return;
		}
		try {
			this.data = JSON.parse(String(e));
		} catch {
			this.data = (0, Wn.parse)(e);
		}
		this.preview();
	}
	loadURL(e) {
		e && (this.url = e), fetch(this.url).then((e) => (e.status !== 200 && Bf.fail(`Unable to load shortcut (${e.status}): ${this.url}`), e.text())).then((e) => {
			this.load(e);
		}).catch((e) => {
			Bf.error(e);
		});
	}
	preview() {
		if (Rf = document.querySelector(this.selector), Rf?.classList.add("sp-preview"), !Rf) {
			Bf.fail(`Selector '${this.selector}' selects nothing.`);
			return;
		}
		if (Rf.innerHTML = "", Nt(o("sp-container ios")), At(), this.variables && this.data.WFWorkflowActions && this.data.WFWorkflowActions.length !== 0 && en(this.data.WFWorkflowActions), this.meta && tn(this.data), this.header) {
			let e = o("sp-header"), t = o("shortcut-icon s64");
			if (this.data.WFWorkflowIcon) {
				let e = this.data.WFWorkflowIcon.WFWorkflowIconStartColor, n = this.data.WFWorkflowIcon.WFWorkflowIconGlyphNumber;
				t.classList.add("c" + e), t.classList.add("g" + n);
			}
			e.appendChild(t);
			let n = r("div", {
				className: "sp-header-title",
				innerText: this.name ?? this.data.WFWorkflowName ?? "Shortcut"
			});
			e.appendChild(n);
			let i = r("div", {
				className: "sp-header-action-count",
				innerText: (this.data?.WFWorkflowActions?.length ?? 0) + " actions"
			});
			e.appendChild(i), Rf.appendChild(e);
		}
		if (this.meta && Zt(this.data), this.automations && on(this.data), this.data.WFWorkflowActions && this.data.WFWorkflowActions.length !== 0) kt(this.data.WFWorkflowActions);
		else {
			let e = r("div", {
				className: "sp-actions-empty",
				innerText: "This Shortcut contains 0 actions."
			});
			wt.appendChild(e);
		}
		Rf.appendChild(wt);
	}
};
//#endregion
export { Bf as Log, Vf as ShortcutPreview, zf as dev };
