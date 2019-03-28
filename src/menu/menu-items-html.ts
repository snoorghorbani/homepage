import { StateHandler } from '../module/state';
import { Interaction } from '../module/interaction';
import { Utility } from '../utility/index';
import { Camera } from '../module/camera';
import { colors } from '../colors';

const interaction = new Interaction();

declare const THREE: any;
declare const TWEEN: any;

let scene, camera;
let clickableItems = [];

const menuItems = document.querySelectorAll(".menu-items");
menuItems.forEach(menu => {
	menu.addEventListener('click', (event) => {
		StateHandler.goto("close_menu")
	}, {});
	menu.addEventListener('mouseenter', (event) => {
		StateHandler.goto("bold_cursor");
		show_description(event.target);
		StateHandler.goto((event.target as any).id)
	}, {});
	menu.addEventListener('mouseleave', (event) => {
		StateHandler.goto("normal_cursor");
	}, {});
});

export const open = function () {
	/** move camera */
	Camera.save_position();
	Camera.move_far_right(222, 300);

	/** show items */
	var container = document.querySelector("#html-container");
	setTimeout(() => {
		container.classList.remove("closed-menu")
		container.classList.add("opened-menu")
	}, 1111);
};

export const close = function () {
	Camera.move_to_last_saved();

	var container = document.querySelector("#html-container");
	container.classList.remove("opened-menu")
	container.classList.add("closed-menu")
};

function typeWriter(el, text, n) {
	if (n < (text.length)) {
		//   $('.test').html(text.substring(0, n+1));
		el.innerText = text.substring(0, n + 1);
		n++;
		setTimeout(function () {
			typeWriter(el, text, n)
		}, 50);
	}
}

function show_description(menuItemEl) {
	debugger;
	const shortEl = menuItemEl.querySelector(".short");
	const descriptionEl = menuItemEl.querySelector(".description");
	const typerEl = menuItemEl.querySelector(".typer");
	const description = menuItemEl.querySelector(".description").innerText;

	typeWriter(typerEl, description, 0);

}

StateHandler.on('open_menu', open);
StateHandler.on('close_menu', close);
