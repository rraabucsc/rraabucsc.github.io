function reveal_mathbox(init, teardown) {
    var has_fired = false;
    var this_slide = document.currentScript.parentElement.id;
    var slide_index;

    // it's possible that Reveal isn't loaded yet
    function try_register() {
        try {
            Reveal.on('slidechanged', event => {
                if ((!has_fired) && (event.currentSlide.id == this_slide)) {
                    slide_index = event.indexh;
                    has_fired = true;
                    init();

                    Reveal.on('slidechanged', event => {

                        if (Math.abs(event.indexh - slide_index) >= 1) {
                            has_fired = false;
                            teardown();
                        }

                    });
                }
            });
        } catch(e) {
            window.setTimeout(try_register, 1000);
        }
    };

    try_register();
}

function make_mathbox(render_func, container_id, ...args) {

    var element = document.getElementById(container_id);
    var mathbox;

    function init() {

        // Define global DOM handler to format 'latex' into an HTML span
        MathBox.DOM.Types.latex = MathBox.DOM.createClass({
            render: function (el) {
                this.props.innerHTML = katex.renderToString(this.children);
                return el('span', this.props);
            }
        });
        mathbox = MathBox.mathBox({
            plugins: ["core", "controls", "cursor"],
            element: element,
            controls: {
                klass: THREE.OrbitControls,
            },
        });
        three = mathbox.three;

        // make transparent background
        three.renderer.setClearColor(new THREE.Color(0xffffff), 0.2);

        render_func(mathbox, ...args);
    }

    function teardown() {
        element.innerHTML = '';
        mathbox.remove("*");
        mathbox = null;
    }

    reveal_mathbox(init, teardown);

}
