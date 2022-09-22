"use strict";

class Render{
    constructor(canvasID){
        this.canvas = document.getElementById(canvasID);
            try{
                this.gl = this.canvas.getContext("webgl");
                this.gl.viewport(0,0,this.canvas.clientWidth,
                    this.canvas.height);
            }
            catch(e){
                var msg = "Error WebGL:" + e.toString();
                alert(msg);
                throw Error(msg);
            }

        if(!this.gl){
            console.error("Erro ao iniciar o WebGL.");
            return;
        }
    
    //Obtermos os shaders como strings.

    var vertexShaderSource = 
        document.getElementById("meu-vertex-shader").text;

    var fragmentShaderSource = 
        document.getElementById("meu-fragment-shader").text;

    //Criamos os shaders GLSL: upload do GLSL fonte e compilamos.

    var vertexShader = Render.createShader(this.gl,
                    this.gl.VERTEX_SHADER, vertexShaderSource);

    var fragmentShader = Render.createShader(this.gl,
                        this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    //Ligamos os dois shaders em um programa.

    this.program = Render.createProgram(this.gl, vertexShader,
                                                    fragmentShader);
    this.positionAttributLocation = this.gl.getAttribLocation(this.program, "posicao");
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

    this.gl.useProgram(this.program);
    this.matrixLocation = this.gl.getUniformLocation(this.program, "u_escala");

    this.matriz = [this.canvas.height / this.canvas.width,    0, 0, 0,
                                                0,            1, 0, 0,
                                                0,            0, 1, 0,
                                                0,            0, 0, 1];
    
    } //Fim do construtor.

    draw(){
        this.gl.clearColor(0,0,0,1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        //Escolhe qual programa usar.
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(this.matrixLocation, false, this.matriz);
        var positions = [0,0,0,0,0.5,0,0.5,0,0];
        //Colocamos as coordenadas no buffer.
        this.gl.bufferData(this.gl.ARRAY_BUFFER,
            new Float32Array(positions), this.gl.STATIC_DRAW);

        //Ativa o atributo.
        this.gl.enableVertexAttribArray(this.positionAttributLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        //Explica como usar os dados do positionBuffer(ARRAY_BUFFER).
        var size = 3; //3 componentes por iteração.
        var type = this.gl.FLOAT; //Dados são 32bit floats.
        var normalize = false; //Sem normalizar os dados.
        var stride = 0; //0 = espaço entre dados (usado para representar cores, por exemplo).
        var offset = 0; //Posição inicial do buffer.
        this.gl.vertexAttribPointer(this.positionAttributeLocation,
                    size, type, normalize, stride, offset);

        //Desenhar!
        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        this.gl.drawArrays(primitiveType, offset, count);
    }

    static createShader(gl, type, source){
        var shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader,
                                            gl.COMPILE_STATUS);
        
        if(success){
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        
        gl.deleteShader(shader);
    }

    static createProgram(gl, vertexShader, fragmentShader){
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);

        if(success){
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);

    }


} // Fim da classe Render.