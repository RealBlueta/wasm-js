use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn log(s: &str);    
    fn log_i32(s: i32);  

    fn Get_Width() -> i32;
    fn Get_Height() -> i32;

    fn Draw_Rect(x: i32, y: i32, width: i32, height: i32, color: Box<[i32]>);
}

pub struct HTMLCanvasElement {
    width: i32,
    height: i32
}

impl HTMLCanvasElement {
    fn new() -> HTMLCanvasElement {
        HTMLCanvasElement {
            width: Get_Width(),
            height: Get_Height()
        }
    }

    fn get_context2d(self) -> CanvasRenderingContext2D {
        CanvasRenderingContext2D {
            color: [255, 255, 255]
        }
    }
}

pub struct CanvasRenderingContext2D {
    color: [i32; 3]
}

impl CanvasRenderingContext2D {
    fn fill_rect(&self, x: i32, y: i32, width: i32, height: i32) {
        Draw_Rect(x, y, width, height, Box::new(self.color));
    }
}

#[wasm_bindgen]
pub fn main() {
    let canvas = HTMLCanvasElement::new();
    let width = canvas.width;
    let height = canvas.height;
    let mut context = canvas.get_context2d();

    log("Starting the drawing!");
    
    context.color = [0, 0, 0];
    context.fill_rect(0, 0, width, height);

    context.color = [ 255, 132, 5 ];
    context.fill_rect(0, 0, 300, 300);
    context.color = [ 100, 0, 85 ];
    context.fill_rect(0, 400, 600, 250);

    log("Finished drawing!");
}