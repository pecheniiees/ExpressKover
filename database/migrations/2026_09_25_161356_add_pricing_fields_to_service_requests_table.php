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
        Schema::table('service_requests', function (Blueprint $table) {
            $table->decimal('area_square_meters', 8, 2)->nullable()->after('address');
            $table->foreignId('tariff_id')->nullable()->after('area_square_meters')->nullOnDelete();
            $table->foreignId('discount_id')->nullable()->after('tariff_id')->nullOnDelete();
            $table->decimal('total_amount', 10, 2)->nullable()->after('discount_id');

            $table->index(['tariff_id', 'discount_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropIndex(['tariff_id', 'discount_id']);
            $table->dropConstrainedForeignId('discount_id');
            $table->dropConstrainedForeignId('tariff_id');
            $table->dropColumn(['area_square_meters', 'total_amount']);
        });
    }
};
