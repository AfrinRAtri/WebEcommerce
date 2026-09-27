<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->string('customer');
            $table->string('phone');
            $table->text('address');

            $table->decimal('total', 10, 2);

            $table->enum('payment', [
                'Cash on Delivery',
                'Card',
                'bKash',
                'Nagad',
                'Rocket'
            ]);

            $table->enum('status', [
                'Pending',
                'Processing',
                'On Hold',
                'Delivered',
                'Cancelled'
            ])->default('Pending');

            $table->timestamp('placed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};